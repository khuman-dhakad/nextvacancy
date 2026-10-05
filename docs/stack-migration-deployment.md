# NextVacancy migration deployment guide

## Current rollout status

The original Next.js application is archived at `archive/legacy-next-app` and
the React/Vite application is at `frontend`; the Spring Boot API is at
`backend`. The supplied Vercel build log runs from `frontend`, so keep that
existing project root and its domains unchanged while applying the build fix.

## Verification and deployment status

* Backend unit tests and frontend tests/build have passed locally. PostgreSQL
  Testcontainers integration tests are configured, but were skipped locally
  because the Docker daemon is unavailable.
* CI tests and builds the frontend and verifies the Spring backend. Render
  deploys the API from the root `render.yaml` Blueprint after GitHub checks
  pass; Vercel deploys the frontend through its linked Git integration.
* Production PostgreSQL connection/migration and deployments have not been
  exercised. Deployment status: **PENDING — EXTERNAL PROVIDER CONFIGURATION
  AND CREDENTIALS REQUIRED**.

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
  schema and dedicated least-privilege application credentials.
  `SPRING_DATASOURCE_URL` must be a JDBC PostgreSQL URL.
* DNS access to create the API hostname and issue a TLS certificate.
* The real production web origin(s) for `CORS_ALLOWED_ORIGINS`.
* Vercel project access only when ready to switch the frontend project root to
  `frontend`; keep current Vercel settings/domain intact before cutover.
* Production frontend environment variable `VITE_API_BASE_URL`, set to the
  HTTPS API origin including any API base path if one is configured.
* Secret-manager or root-controlled deployment access for database credentials.

No production credentials, provider account names, domain, or API hostname are
provided or invented here.

## Build and verify

From the repository root:

```powershell
mvn -f backend\pom.xml test
npm --prefix frontend ci
npm --prefix frontend test
# Set VITE_API_BASE_URL to the provisioned HTTPS API URL before this build.
npm --prefix frontend run build
```

Keep local environment files out of source control. Vite reads
`frontend\.env`; Spring Boot does not automatically read dotenv files, so
provide backend values through the process environment or a protected
environment file loaded by your IDE or service manager. For production,
populate `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and
`SPRING_DATASOURCE_PASSWORD` from the provisioned services.
`CORS_ALLOWED_ORIGINS` must list explicit HTTPS frontend origins, comma
separated; non-HTTPS and wildcard origins are rejected. Set
`VITE_API_BASE_URL` to the actual verified HTTPS API origin in the build
environment before building.

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
   `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`,
   `SPRING_DATASOURCE_PASSWORD`,
   `CORS_ALLOWED_ORIGINS`, and any pool/log overrides from the secret manager.
   `SPRING_DATASOURCE_URL` must start with `jdbc:postgresql:` and configure
   PostgreSQL TLS with `sslmode=verify-full`. Never commit or print it. Use
   `sudoedit` to populate the root-owned environment file. Also configure the
   JWT key, admin identity/hash, Resend API key and sender, public application
   URL, and exact allowed HTTPS origins. Verify the Drizzle schema and take a tested
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

Keep the existing Vercel project's Git connection, branch, domains, and
environment settings unchanged. Its Root Directory should remain `frontend`,
matching the supplied build log. The checked-in `frontend/vercel.json` pins
`npm ci`, `npm run build`, and `dist`, and preserves the SPA and sitemap
rewrites. Set `VITE_API_BASE_URL` in Vercel Preview and Production to the
actual Render service's HTTPS URL ending in `/api`; do not use a localhost or
placeholder URL.

## Render

Create a Blueprint from the repository root and select `render.yaml`. It
defines the Docker-based Spring API, health check, and automatic deploys from
`main` only after GitHub checks pass. The `starter` plan is always on and is
billable. The manifest deliberately does not create, migrate, or replace a
database; configure the existing PostgreSQL connection through Render's
environment settings:

* `SPRING_DATASOURCE_URL` — the existing PostgreSQL JDBC URL, using verified
  TLS (for example, `sslmode=verify-full` where supported).
* `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` — least-
  privilege production credentials.
* `JWT_SECRET` — a base64-encoded key of at least 32 bytes.
* `CORS_ALLOWED_ORIGINS` — the exact HTTPS origin(s) of the frontend.
* `APP_PUBLIC_URL` — the public HTTPS frontend URL used to generate account
  links.
* `RESEND_API_KEY` and `RESEND_FROM_EMAIL` — required for email verification
  and password-reset delivery.
* `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` — configure only
  when enabling the initial admin account.

After the first deploy, verify `/api/actuator/health` and the API routes before
setting Vercel's `VITE_API_BASE_URL` to the Render URL ending in `/api`. No
Vercel or Render account access, database credentials, or provider environment
was available to create or verify an actual deployment here.
