# Production Readiness

## Included application hardening


## Required deployment configuration

- Apply versioned Drizzle migrations with `npm run db:migrate` before serving a new database. Use `npm run db:seed` only for development or staging unless the production data plan explicitly requires the initial catalog seed.
- Keep at least two app instances behind a health-checked load balancer for zero-downtime deployments.
- Configure centralized logs, error tracking, uptime monitoring, backups, and alerting.

## Capacity validation

A fixed concurrency guarantee cannot be proven from source code alone. Test the deployed environment with production-like data and a staging domain before launch. Start with a sustained 500 virtual-user test covering `/`, category pages, search, job details, sitemap, and `/api/health`; measure p95/p99 latency, error rate, CPU, memory, database connections, and cache hit rate.

Example tools: k6, Grafana Cloud k6, or Artillery. Set release gates such as less than 1% errors, p95 below 500 ms for cached pages, and no memory growth during a 30-minute soak test.

## Security acceptance

## Vercel and PostgreSQL deployment

1. Create a managed PostgreSQL database with the provider of your choice.
2. Ensure the Vercel Git integration account and the commit author have access to the Vercel project so deployments are not blocked by project permissions.
3. Add its connection string as `DATABASE_URL` in the Vercel project under both Preview and Production environments. Do not add it as a `NEXT_PUBLIC_*` variable.
4. Set `DATABASE_SSL=true` unless the provider explicitly requires another setting. Set `DB_POOL_MAX` to a conservative value appropriate for the provider's connection limit, and keep `DB_DEBUG=false` in Preview and Production.
5. From `apps/web`, run `npm run db:migrate` against the intended database before the first deployment and after each migration release. Do not use `db:push` as the production deployment workflow.
6. Run `npm run db:seed` only against local or staging databases unless production requires the repository's initial master data. The seed uses conflict-safe inserts and can be repeated for those environments.
7. Redeploy Vercel after saving the variables, then verify `/api/health`, database-backed category/job/organization routes, and `/sitemap.xml`.
8. Confirm deployment logs contain no `ECONNREFUSED` errors and no production request is served from mock/static fallback data.
No application can honestly promise 100% security. Before launch, run dependency auditing, secret scanning, SAST, DAST, CSP validation, authentication/authorization tests, rate-limit tests, and an external penetration test. Review the CSP whenever analytics, payment, image, or API domains change.
