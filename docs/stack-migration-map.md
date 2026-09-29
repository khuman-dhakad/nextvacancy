# NextVacancy Stack Migration Map

## Rollout

This is a parity-first migration. The current Next.js application in `apps/web`
remains the production frontend until each replacement route and workflow is
implemented and verified. The React application now has database-backed public
catalog and organization routes, admin CRUD pages, and Spring APIs for those
surfaces. This is still partial parity: the React routes are client-rendered,
candidate settings/notifications remain unmigrated, PWA service-worker
behavior is not present, and production database/API/deployment access has not
been verified. A request-time sitemap function and explicit Vercel rewrite are
implemented, but their real API and Vercel runtime behavior remain unverified.

No production deployment or data migration is performed by this change. The
Spring service uses the existing PostgreSQL catalog schema and Hibernate
`validate`; it does not create, seed, or alter production data.

## Technology and data mapping

| Current | Target | Status |
|---|---|---|
| `apps/web` Next.js App Router, React, TypeScript | `apps/frontend` Vite, React, JavaScript, Tailwind CSS | Public catalog, authentication pages, and persisted candidate saved jobs are present; old app retained for remaining parity |
| `apps/web/services/jobs/jobs.service.ts` with Drizzle | Spring MVC `JobController`, `JobCatalogService`, Spring Data `JobRepository`, DTOs and JPA `JobEntity` | Database-backed search, filters, pagination, detail, and related jobs implemented; production DB parity remains unverified |
| `apps/web/services/categories/categories.service.ts` with Drizzle | Spring MVC `CategoryController`, `CategoryCatalogService`, Spring Data `CategoryRepository`, DTO and JPA entity | Active category list migrated |
| `apps/web/services/organization/organization-profile.service.ts` | Spring organization API/service/repository and React organization routes | Directory/profile/jobs/related organization APIs and React routes implemented; production DB parity remains unverified |
| `apps/web/services/dashboard/dashboard.service.ts` | Candidate dashboard REST resources and React dashboard | Saved jobs use existing PostgreSQL records; old tracker/profile/security/preferences remain static mock data and are not treated as real workflows |
| `apps/web/services/settings/settings.service.ts` | Candidate settings REST resources and React settings | Pending |
| `apps/web/services/notifications/notification.service.ts` | Candidate notification REST resources and React notifications | Pending |
| `apps/web/services/admin/*` and `app/admin/actions.ts` | Role-protected admin REST resources, audit trail, React admin routes | Job/category/organization CRUD, status, duplicate, bulk actions, analytics, and activity surfaces implemented; parity and production access remain unverified |
| `apps/web/lib/auth/*`, `app/auth/actions.ts`, `app/auth/password-reset-actions.ts` | Spring Security, JWT filter, role-aware auth, persistent session/token/rate-limit services, Resend email, React auth routes | Candidate/admin sign-in, registration, token lifecycle, reset and verification implemented; integration gated on PostgreSQL |
| Drizzle schema and versioned migrations | PostgreSQL, JPA/Hibernate schema validation, additive Flyway `V0002` | Existing schema retained; new auth session/rate tables only; production migration not run |
| Next server actions and `app/api/health/route.ts` | Spring REST API and Actuator health endpoints | Catalog, organization, candidate saved-job, and admin mutation endpoints implemented; remaining candidate actions are pending |

## Current route inventory and target

All current routes remain available from `apps/web` during parity. Page
components and current service/API dependencies below were traced from source;
"Verified" means implemented and tested to the level stated, not production
deployed. The replacement uses React Router and `VITE_API_BASE_URL`.

| Current route | Current page/component | Existing service/data dependency | New React route | Spring API | Migration status | Verified? |
|---|---|---|---|---|---|---|
| `/` | `HomePage`; desktop hero, stats, featured jobs, notifications, category grid | Jobs service `getFeaturedJobs`, `getLatestJobs`; categories; DB-backed legacy reads with empty/error results no longer replaced by mock jobs | `/` (`JobDirectory`) | `GET /api/v1/jobs`, `GET /api/v1/categories` | Partial: directory replaces homepage presentation; route renders real API data and reports failures | React production build; PostgreSQL runtime pending |
| `/search` | `SearchPage`, `CategoryPageTemplate` | `jobs.service.searchJobs`; Drizzle, filters and pagination; no fake result fallback | `/search` | `GET /api/v1/jobs` with server-side keyword/category/status/qualification/location/sort/page filters | React route and database query path implemented; UI/SEO parity and live database behavior remain unverified | Unit tests; production build currently blocked on provisioned API URL |
| `/results` | `ResultsPage`, search template | `jobs.service.searchJobs`; Drizzle | `/results` | `GET /api/v1/jobs?category=result` | React route uses the real catalog API; full visual/SEO parity remains unverified | Code/tests; live database unverified |
| `/government-jobs` | `GovernmentJobsPage`, category template | Job/category DB queries | `/government-jobs` | `GET /api/v1/jobs?category=government` | React route uses the real catalog API; full parity remains unverified | Code/tests; live database unverified |
| `/private-jobs` | `PrivateJobsPage`, category template | Job/category DB queries | `/private-jobs` | `GET /api/v1/jobs?category=private` | React route uses the real catalog API; full parity remains unverified | Code/tests; live database unverified |
| `/admit-cards` | `AdmitCardsPage`, category template | Job/category/status DB queries | `/admit-cards` | `GET /api/v1/jobs?category=admit-card` | React route uses the real catalog API; full parity remains unverified | Code/tests; live database unverified |
| `/category/[category]` | `DynamicCategoryPage`, category template | Category config plus `jobs.service.searchJobs` | `/category/:category` | `GET /api/v1/categories`, `GET /api/v1/jobs?category=` | React category route, not-found/error states, filters, and server pagination implemented; SEO/live DB parity remain unverified | Focused component tests; production build currently blocked on provisioned API URL |
| `/jobs/[slug]` | `JobDetailPage`, recruitment/job components | `getJobBySlug`, related jobs, DB-backed legacy reads; no mock result on empty/miss/error | `/jobs/:slug` | `GET /api/v1/jobs/{slug}`, `GET /api/v1/jobs/{slug}/related` | Real API detail, related items, save action, structured fields, FAQs/links and metadata implemented client-side; server-rendered SEO/view-increment parity remains unverified | Code/tests; live database unverified |
| `/organizations` | `OrganizationsDirectoryPage` | `organization-profile.service`; DB-only records | `/organizations` | `GET /api/v1/organizations` | Searchable/filterable real-API directory implemented; live DB parity remains unverified | Component tests; production build currently blocked on provisioned API URL |
| `/organizations/[slug]` | `OrganizationProfilePage`, profile/vacancy components | Organization profile, jobs and related organizations; DB-only legacy reads | `/organizations/:slug` | `GET /api/v1/organizations/{slug}`, `/jobs`, `/related` | Real profile, stats, content sections, jobs, related orgs and client metadata/structured data implemented; server SEO and complete job pagination remain parity gaps | Component tests; live database unverified |
| `/login` | `LoginPage`, `LoginForm` | Candidate auth actions; PostgreSQL users/sessions, scrypt, rate limit/lockout | `/login` | `POST /api/v1/auth/login`, `POST /refresh`, `POST /logout`, `GET /me` | Migrated auth flow; page UX only partially equivalent | JUnit; live PostgreSQL integration pending |
| `/register` | `RegisterPage`, `RegisterForm` | Candidate user insert, email verification token, Resend | `/register` | `POST /api/v1/auth/register` | Migrated API/form; email delivery requires config | Unit tests; provider not verified |
| `/forgot-password` | `ForgotPasswordPage`, `ForgotPasswordForm` | Password reset token update, Resend email | `/forgot-password` | `POST /api/v1/auth/password-reset/request` | Migrated API/form | Code/build; live email pending |
| `/reset-password` (linked by current email; no current page) | Current reset action/token flow | User reset-token columns, session deletion | `/reset-password` | `POST /api/v1/auth/password-reset/complete` | New React flow and endpoint added | Unit/code; DB integration pending |
| `/verify-email` | `VerifyEmailPage` | Single-use candidate verification token | `/verify-email` | `POST /api/v1/auth/email-verification/confirm` | Migrated route/API; resend API also protected | Unit/code; email pending |
| `/dashboard` | `DashboardPage`, candidate dashboard components | `dashboard.service`; old tracker and profile cards are mock data; `saved_jobs` is a real table | `/dashboard` | `GET /api/v1/auth/me`, `GET /api/v1/candidate/saved-jobs`, `PUT/DELETE /api/v1/candidate/saved-jobs/{jobId}` | Partial protected account profile and persisted saved jobs migrated; no application tracker or settings data exists in the legacy schema | React saved-jobs component test; PostgreSQL Testcontainers integration configured but Docker unavailable locally |
| `/settings` | `SettingsPage`, profile/security/preferences forms | `settings.service`, candidate DB | `/settings` | — | Pending | No |
| `/notifications` | `NotificationsPage`, notification center | `notification.service`, candidate preferences | `/notifications` | — | Pending | No |
| `/admin/login` | `AdminLoginPage`, `AdminLoginForm` | Configured admin username/email/hash and signed session | `/admin/login` | `POST /api/v1/auth/admin/login` | Admin credential auth migrated; dashboard absent | Unit/code; end-to-end PostgreSQL test pending |
| `/admin/dashboard` | `AdminDashboardPage` | Admin session, jobs stats/activity/audit services | `/admin/dashboard` | `GET /api/v1/admin/dashboard`, `/activity` | Protected database-backed dashboard and audit activity implemented | Admin authorization tests; live database unverified |
| `/admin/jobs` | `AdminJobsPage`, `AdminJobsManager` | Admin jobs reads/mutations, audit, DB | `/admin/jobs` | `/api/v1/admin/jobs` and `/bulk/*` | Create/edit/delete/duplicate/status and bulk status/delete UI/API implemented | Admin authorization tests; live database unverified |
| `/admin/jobs/new` | `AdminNewJobPage`, `AdminJobForm` | Admin job create action/service | `/admin/jobs/new` | `POST /api/v1/admin/jobs` | Database-backed form with validation/error states implemented | Admin authorization tests; live database unverified |
| `/admin/jobs/[id]/edit` | `AdminEditJobPage`, `AdminJobForm` | Admin job read/update action/service | `/admin/jobs/:id/edit` | `GET/PUT /api/v1/admin/jobs/{id}` | Database-backed edit form implemented | Admin authorization tests; live database unverified |
| `/admin/categories` | `AdminCategoriesPage`, `AdminCategoryManager` | Admin category CRUD/master data | `/admin/categories` | `/api/v1/admin/categories` and `/bulk/*` | CRUD, active/featured status, and bulk active/delete implemented | Admin authorization tests; live database unverified |
| `/admin/organizations` | `AdminOrganizationsPage`, manager | Admin organization CRUD/master data | `/admin/organizations` | `/api/v1/admin/organizations` and `/bulk/*` | CRUD, active status, and bulk active/delete implemented | Admin authorization tests; live database unverified |
| `/admin/analytics` | `AdminAnalyticsPage`, analytics components | Admin analytics service; jobs/audit/traffic data | `/admin/analytics` | `GET /api/v1/admin/analytics` | Database-backed job/org/category analytics implemented; traffic metrics not migrated unless persisted by source | Admin authorization tests; live database unverified |
| `/about` | Static about page | Static source content | `/about` | — | Pending | No |
| `/contact` | Static contact page | Static source content | `/contact` | — | Pending | No |
| `/disclaimer` | Static disclaimer page | Static source content | `/disclaimer` | — | Pending | No |
| `/privacy-policy` | Static privacy page | Static source content | `/privacy-policy` | — | Pending | No |
| `/terms` | Static terms page | Static source content | `/terms` | — | Pending | No |
| `/robots.txt` | `app/robots.ts` | Static robots policy | `/robots.txt` | Static hosting | Static robots policy migrated; its sitemap path is routed to the request-time function, whose API/Vercel runtime remains unverified | Static file plus sitemap rewrite |
| `/sitemap.xml` | `app/sitemap.ts` | PostgreSQL jobs/categories/organizations and SEO metadata | `/sitemap.xml` | Vercel request-time function fetches paginated Spring jobs and real category/organization APIs; explicit rewrite from `/sitemap.xml` | Dynamic source and no-build-time-DB path implemented; real API environment and Vercel runtime remain unverified | Unit tests; production build/deployment blocked on provisioned API URL |
| `/manifest.webmanifest` | `app/manifest.ts` | Static PWA metadata | `/manifest.webmanifest` | Static hosting | Manifest migrated | Static file |
| `/offline` | Offline route and PWA components/service worker | Static offline page, service worker | `/offline` | — | Offline page, install prompt and connectivity notice implemented; no production service worker/caching was present in legacy behavior or migrated | Code and local build verified |
| `/api/health` | Next route handler | Runtime health response | `/actuator/health` | `GET /actuator/health` | Replaced in backend; public deployment not verified | Local build only |

The current framework also supplies loading/error/not-found boundaries, page
metadata, Open Graph/Twitter tags, structured JobPosting/BreadcrumbList/FAQ
data, canonical URLs and PWA behavior. These remain parity gates; static
React/Vercel client rendering does not by itself preserve Next SSR or dynamic
SEO.

## Existing services and workflows

| Existing service or capability | Target owner | Status |
|---|---|---|
| `services/jobs/jobs.service.ts` (search, filters, sorting, pagination, listing, detail, related jobs, views) | `JobController` + `JobCatalogService` + `JobRepository` | Search, filters, pagination, detail and related-job APIs migrated; original service reads view counts but no increment behavior was found |
| `services/jobs/jobs.mock.ts` | No production equivalent | Legacy public job reads and featured-job UI no longer substitute fixtures when data is absent; fixture module is used only by explicitly opted-in non-production seeding |
| `services/categories/categories.service.ts` | `CategoryController` + `CategoryCatalogService` | Active category read API migrated |
| `services/organization/organization-profile.service.ts` and `.mock.ts` | Organization REST resources and service | Organization directory/profile/jobs/related APIs and React routes implemented; organization fixtures are used only by explicitly opted-in non-production seeding |
| `services/admin/admin-jobs.service.ts` | Admin job REST resources | CRUD, duplicate, status, bulk status/delete, validation and audit implemented |
| `services/admin/admin-master-data.service.ts` | Admin category/organization REST resources | CRUD, active/featured status where supported, bulk active/delete and audit implemented |
| `services/admin/admin-analytics.service.ts` | Admin analytics REST resources | Database-backed jobs/org/category metrics implemented; any non-persisted legacy metrics remain out of scope |
| `services/dashboard/dashboard.service.ts` | Candidate dashboard REST resources | Pending |
| `services/settings/settings.service.ts` | Candidate settings REST resources | Pending |
| `services/notifications/notification.service.ts` | Candidate notification REST resources | Pending |
| Candidate registration, login, logout, persistent sessions, lockout | Spring Security, short-lived signed JWT, rotating opaque refresh token in HttpOnly cookie, BCrypt with legacy scrypt verification/upgrade, PostgreSQL session/rate limit persistence | Implemented; PostgreSQL integration waits for container-capable environment |
| Candidate saved jobs | Candidate-authorized Spring MVC endpoints; JPA relationships to existing `users`, `jobs`, and `saved_jobs`; React job detail and account views | Migrated end to end; serialization-safe DTOs; candidate-scoped; save idempotency serialized by locking the user's row |
| Email verification and password reset | Spring one-use hashed token lifecycle plus configured Resend delivery | Implemented; provider delivery not verified |
| Candidate/admin authorization | JWT filter checks claims and persisted active session; role claims from existing `CANDIDATE` and configured `ADMIN` models; method-level candidate check | Admin controller enforces `hasRole('ADMIN')`; tests cover unauthenticated 401, candidate 403 and admin mutation allow |
| Sitemap and SEO metadata | React hosting plus backend sitemap/content API as appropriate | Client-side route metadata/JSON-LD and request-time database-backed sitemap function exist; server-rendered route metadata and production Vercel/API wiring remain unverified |
| Search result and catalog page server components | React route loaders/components backed by Spring REST | Dedicated public routes and database-side filters/pagination implemented; live DB and SSR parity remain unverified |

## API contract for migrated surfaces

* `GET /api/v1/jobs?page=0&size=20&q=&category=&status=` returns a Spring
  paginated response of real job rows.
* `GET /api/v1/jobs/{slug}` returns one real job row or HTTP 404.
* `GET /api/v1/jobs/{slug}/related` returns related database-backed jobs.
* `GET /api/v1/categories` returns active categories from PostgreSQL.
* `GET /api/v1/organizations`, `/api/v1/organizations/{slug}`,
  `/api/v1/organizations/{slug}/jobs`, and
  `/api/v1/organizations/{slug}/related` serve active organization records and
  their database-backed public job/profile data.
* `/api/v1/admin/**` provides database-backed dashboard, job/category/
  organization CRUD, status, bulk operations, activity, and analytics.
  `AdminController` applies `@PreAuthorize("hasRole('ADMIN')")` at class level.
* `GET /actuator/health` reports application health; database health is included
  by Spring Boot Actuator.
* `POST /api/v1/auth/register` creates candidate records and sends verification.
* `POST /api/v1/auth/login` and `POST /api/v1/auth/admin/login` issue short-lived
  access JWTs and persistent rotating refresh sessions.
* `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`, and `GET
  /api/v1/auth/me` refresh, revoke, and inspect the current principal.
* `POST /api/v1/auth/password-reset/request`, `/complete`,
  `/api/v1/auth/email-verification/confirm`, and `/resend` manage email flows.
* `GET /api/v1/candidate/saved-jobs`, `PUT
  /api/v1/candidate/saved-jobs/{jobId}`, and `DELETE
  /api/v1/candidate/saved-jobs/{jobId}` provide the authenticated candidate's
  persisted saved jobs. Spring method authorization restricts these endpoints
  to `CANDIDATE`; responses map to DTOs rather than exposing JPA entities.

The backend requires an externally provisioned PostgreSQL database via
`DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`. Production
configuration fails rather than selecting an embedded/local database. The
frontend requires `VITE_API_BASE_URL`; production builds reject non-HTTPS API
origins. No endpoint substitutes mock or demo content.

## Cutover gates

Do not change the Vercel production root directory, domain, or existing
deployment until all public, candidate, recruiter, and admin route/workflow
parity, SEO, database migration, runtime, and deployment checks have passed.
Recruiter-specific workflows are not present in the existing application.
Admin CRUD endpoints/UI are implemented but still need full parity and live
database validation. Candidate applications/notifications/settings (no
persisted implementation was found in the source), remaining candidate
dashboard features, server-rendered SEO, live sitemap/API/Vercel runtime
verification, production PWA behavior, provider delivery, live PostgreSQL
runtime, and actual deployment remain incomplete and are not claimed as
complete.

## Old-stack and fixture audit

Git-tracked count under `apps/web` (generated/cache path and filename filters
applied): 254 `.ts`/`.tsx` files; no tracked generated/cache files matched those
filters. This includes 2 test scripts and 2 TypeScript configuration files,
leaving 250 legacy application source files under the classification used for
this report.

| Classification | Current findings |
|---|---|
| A. Still required for legacy production | `next` remains a runtime dependency and direct Next imports occur in 105 tracked source files; the legacy app remains the production app pending cutover. TypeScript source remains required by that app. |
| B. Already replaced | React/Spring route/API replacements exist for public catalog, organization, admin, auth, and saved-job surfaces; the legacy counterparts remain until parity/deployment gates pass. |
| C. Obsolete and safe to remove after parity | None approved for removal. |
| D. Test-only / fixture tooling | Two tracked TypeScript test scripts; `jobs.mock.ts` and `organization-profile.mock.ts` are only used by explicitly opted-in non-production seeding. Dashboard/settings/notification fixture services are gated out of production. Test fixtures include reserved `.invalid` URLs. |
| E. Documentation/configuration | Migration/deployment documents and `next.config.ts`/`drizzle.config.ts` remain. |

Additional legacy runtime inventory: one Next API route (`app/api/health`),
three `"use server"` modules, and 11 tracked files with Drizzle imports or
configuration. Those Next/Drizzle files remain in category A until parity is
verified. No legacy code was deleted in this iteration.

The repository-wide keyword scan found development fixtures and historical
legacy mock implementations. Public catalog/category/admin job reads and the
featured-job component no longer use fake records as empty/error fallbacks.
Legacy dashboard/settings/
notification service functions now refuse to return their non-persisted
fixtures in production; they remain development-only until replaced. The seed
script requires `ALLOW_DEMO_SEEDING=true` and rejects production. `127.0.0.1`
in deployment configuration is the private Nginx-to-Spring loopback upstream,
not a browser API URL. Nginx deployment settings now contain explicit render
tokens and must be rendered with provisioned host/certificate values before
deployment. No legacy route/runtime was removed; the fixture exports and
production fallback paths changed here do not replace the old app.
