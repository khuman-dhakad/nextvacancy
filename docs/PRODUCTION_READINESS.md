# Production Readiness

## Included application hardening

- Standalone Next.js output for small container images.
- Non-root Docker runtime user.
- Compression and ETags enabled.
- Immutable one-year caching for Next static assets.
- CSP, HSTS in production, clickjacking protection, MIME sniffing protection, referrer policy, browser isolation, and restrictive permissions policy.
- AVIF/WebP image negotiation enabled through Next Image.
- Stable sitemap timestamps to avoid unnecessary crawler churn.
- `GET /api/health` for load balancers and container probes.

## Required deployment configuration

- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- Set `NODE_ENV=production`.
- Keep secrets server-side; never expose credentials through `NEXT_PUBLIC_*` variables.
- Put the app behind a CDN/reverse proxy with TLS, HTTP/2 or HTTP/3, request-rate limiting, and WAF rules.
- Use a managed database and connection pooling when replacing the mock service layer.
- Keep at least two app instances behind a health-checked load balancer for zero-downtime deployments.
- Configure centralized logs, error tracking, uptime monitoring, backups, and alerting.

## Capacity validation

A fixed concurrency guarantee cannot be proven from source code alone. Test the deployed environment with production-like data and a staging domain before launch. Start with a sustained 500 virtual-user test covering `/`, category pages, search, job details, sitemap, and `/api/health`; measure p95/p99 latency, error rate, CPU, memory, database connections, and cache hit rate.

Example tools: k6, Grafana Cloud k6, or Artillery. Set release gates such as less than 1% errors, p95 below 500 ms for cached pages, and no memory growth during a 30-minute soak test.

## Security acceptance

No application can honestly promise 100% security. Before launch, run dependency auditing, secret scanning, SAST, DAST, CSP validation, authentication/authorization tests, rate-limit tests, and an external penetration test. Review the CSP whenever analytics, payment, image, or API domains change.
