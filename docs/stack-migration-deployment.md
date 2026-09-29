# NextVacancy migration deployment guide

## Current rollout status

The original Next.js application remains at `apps/web` and should remain the
Vercel production root until the migration parity gates in
[stack-migration-map.md](./stack-migration-map.md) are complete. The new
React/Vite application is at `apps/frontend`; the initial Spring Boot API is at
`backend`.

## Verification and deployment status

* Backend unit tests and frontend tests/build have passed locally. PostgreSQL
  Testcontainers integration tests are configured, but were skipped locally
  because the Docker daemon is unavailable.
* CI runs `docker info` before Maven verification so a missing Docker engine
  fails the backend job instead of silently skipping the PostgreSQL tests. The
  workflow has not run for the current uncommitted branch state.
* Production PostgreSQL connection/migration and the cloud/VPS deployment have
  not been exercised. Deployment status: **BLOCKED — EXTERNAL SERVER ACCESS
  REQUIRED**.

The new API reads the existing PostgreSQL catalog and account schema. Flyway
baselines an existing Drizzle schema at version 1 and applies the additive
`V0002__api_authentication.sql` migration for API sessions and persistent
rate-limit counters. Hibernate schema mode is `validate`: startup fails if the
existing mapped schema does not match; Hibernate does not create or drop
tables. An empty or unknown schema is not provisioned by this service and must
fail validation. There is no embedded database, seed-on-startup, or content
fallback. Verify the baseline, review the additive migration, and take a tested
backup before first production startup.

## Required external resources and credentials

Provision these outside source control:

* A Linux/Ubuntu VPS or cloud VM with Java 17, Maven for building (or use the
  provided container image), Nginx, systemd, and an operator account with sudo.
* A reachable PostgreSQL production database with the existing catalog/auth
  schema and dedicated least-privilege application credentials. `DATABASE_URL`
  must be a JDBC PostgreSQL URL.
* DNS access to create the API hostname and issue a TLS certificate.
* The real production web origin(s) for `CORS_ALLOWED_ORIGINS`.
* Vercel project access only when ready to switch the frontend project root to
  `apps/frontend`; keep current Vercel settings/domain intact before cutover.
* Production frontend environment variable `VITE_API_BASE_URL`, set to the
  HTTPS API origin including any API base path if one is configured.
* Secret-manager or root-controlled deployment access for database credentials.

No production credentials, provider account names, domain, or API hostname are
provided or invented here.

## Build and verify

From the repository root:

```powershell
mvn -f backend\pom.xml test
npm --prefix apps\frontend ci
npm --prefix apps\frontend test
# Set VITE_API_BASE_URL to the provisioned HTTPS API URL before this build.
npm --prefix apps\frontend run build
```

Copy `backend\.env.example` to a protected environment file outside the
repository and populate every required value using the provisioned services.
`CORS_ALLOWED_ORIGINS` must list explicit HTTPS frontend origins, comma
separated; non-HTTPS and wildcard origins are rejected. Do not put credentials
in `.env` files that can be committed. Set `VITE_API_BASE_URL` to the actual
verified HTTPS API origin in the build environment before building; the example
file intentionally contains no URL.

Build the backend jar:

```powershell
mvn -f backend\pom.xml clean package
```

The initial public catalog surface is read-only:

* `GET /api/v1/jobs` — database-backed text search, category/status filters,
  safe sort allowlist, and bounded pagination.
* `GET /api/v1/jobs/{slug}` — database-backed detail lookup.
* `GET /api/v1/categories` — database-backed active categories.
* `GET /api/v1/candidate/saved-jobs`, `PUT
  /api/v1/candidate/saved-jobs/{jobId}`, and `DELETE
  /api/v1/candidate/saved-jobs/{jobId}` — candidate-owned bookmarks over the
  existing `saved_jobs` table.
* `POST /api/v1/auth/register`, `/login`, `/admin/login`, `/refresh`, and
  `/logout`; `GET /api/v1/auth/me` — persistent account/session authentication.
* `POST /api/v1/auth/password-reset/request` and `/complete` — hashed,
  expiring, single-use reset tokens.
* `POST /api/v1/auth/email-verification/confirm` and `/resend` — hashed,
  expiring, single-use verification tokens with Resend delivery.
* `GET /actuator/health` — Spring Boot health probes including datasource.

The frontend requires `VITE_API_BASE_URL`. Production builds reject anything
other than an HTTPS API URL. It contains no data fixtures and reports API
failures in the UI. Auth routes use in-memory short-lived access tokens and
rotating Secure/HttpOnly refresh cookies protected by CSRF tokens.

Against a database that already contains the existing Drizzle schema and no
Flyway history, Flyway records baseline 1 and applies `V0002`. Review and back
up before that startup. Do not baseline an empty/unverified database; Hibernate
must fail validation rather than create a new catalog schema.

## Ubuntu systemd + Nginx deployment

1. Provision the VM, PostgreSQL access, DNS, TLS, and firewall rules. Keep
   PostgreSQL inaccessible from the public internet; allow only the API host
   or private network. Allow inbound 80/443 and SSH from an approved operator
   network. Restrict application port 8080 to loopback.
2. Install a supported Java 17 runtime and Nginx. Create a dedicated
   `nextvacancy` system user and `/opt/nextvacancy`,
   `/etc/nextvacancy`, and `/var/log/nextvacancy` directories with least
   privilege ownership.
3. Build with Maven or build the supplied `backend/Dockerfile` in CI. Copy
   `backend/target/nextvacancy-api-0.1.0.jar` to
   `/opt/nextvacancy/nextvacancy-api.jar`.
4. Create `/etc/nextvacancy/api.env` as root, mode `0600`. Populate
   `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`,
   `CORS_ALLOWED_ORIGINS`, and any pool/log overrides from the secret manager.
   `DATABASE_URL` must start with `jdbc:postgresql:` and configure PostgreSQL
   TLS with `sslmode=verify-full`. Never commit or print it. Use `sudoedit` to
   populate the root-owned environment file. Also configure the JWT key,
   admin identity/hash, Resend API key and sender, public application URL, and
   exact allowed HTTPS origins. Verify the Drizzle schema and take a tested
   backup before first startup because Flyway applies the additive V0002
   migration.
5. Install `deploy/systemd/nextvacancy-api.service` into
   `/etc/systemd/system/nextvacancy-api.service` with root ownership and mode
   `0644`, then run `systemctl daemon-reload`,
   `systemctl enable --now nextvacancy-api`, and verify
   `systemctl status nextvacancy-api` and the health endpoint.
6. Render `deploy/nginx/nextvacancy-api.conf.template` into an Nginx
   configuration by replacing `__API_HOSTNAME__`, `__TLS_FULLCHAIN_PATH__`,
   and `__TLS_PRIVATE_KEY_PATH__` with the provisioned hostname and issued
   certificate paths. Never install the unrendered template. Enable the site,
   run `nginx -t`, then reload Nginx.
   The loopback upstream is private behind Nginx; the browser API URL remains
   the public HTTPS hostname.
7. Monitor `journalctl -u nextvacancy-api`, Nginx access/error logs, and the
   configured rolling application log. Configure external uptime alerting,
   PostgreSQL backups with restore drills, log retention, and VM monitoring.
   systemd restarts the application after an unexpected exit.
8. Test GET catalog requests, CORS preflight from the exact frontend origin,
   missing/invalid query inputs, database outage handling, process restart,
   HTTPS redirect, and certificate renewal. Do not declare production ready
   until runtime checks pass against the provisioned environment.

## Vercel

Do not change the existing project's deployment settings during this phase.
When public-route parity and SEO behavior are complete, create a Preview
deployment for `apps/frontend`, set `VITE_API_BASE_URL` to the verified HTTPS
API URL, confirm all routes and static assets, and only then decide whether to
change the Vercel Root Directory. No Vercel, VPS, DNS, PostgreSQL, or email
provider access was available to perform or verify an actual deployment here.
