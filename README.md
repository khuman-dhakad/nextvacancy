# NextVacancy

NextVacancy is an official recruitment updates and verified job vacancy portal for India, covering government recruitments (Sarkari Naukri), state PSCs, defence, railways, banking, and private technology opportunities.

## Project Architecture

- **Frontend**: React 19 SPA built with Vite, Tailwind CSS v4, and React Router 7. Hosted on Vercel.
- **Backend**: Spring Boot 3.5.x REST API with Spring Security 6, JWT session rotation, Spring Data JPA, and Flyway. Hosted on Render.
- **Database**: PostgreSQL 16 on Neon.

---

## Required Production Environment Variables

### Frontend (Vercel Project Settings)

Configure these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Description | Example Production Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Public origin of the Spring Boot REST API | `https://nextvacancy-api.onrender.com` |

---

### Backend (Render Service Settings)

Configure these in **Render Dashboard → nextvacancy-api → Environment**:

| Variable | Description | Required | Example Production Value |
| :--- | :--- | :---: | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | **Yes** | `prod` |
| `DATABASE_URL` | PostgreSQL JDBC connection string with SSL | **Yes** | `postgresql://user:pass@ep-pooler.neon.tech/nextvacancy?sslmode=require` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins | **Yes** | `https://nextvacancy.vercel.app` |
| `APP_PUBLIC_URL` | Authoritative public frontend URL for email links | **Yes** | `https://nextvacancy.vercel.app` |
| `JWT_SECRET` | Base64 or plain secret key (min 32 characters) | **Yes** | `dGVzdC1zZWNyZXQta2V5LWZvci1jaS1jZC1waXBlbGluZS1taW4tMzItY2hhcnM=` |
| `ADMIN_USERNAME` | Administrator login username | **Yes** | `admin` |
| `ADMIN_EMAIL` | Administrator alert email address | **Yes** | `admin@nextvacancy.vercel.app` |
| `ADMIN_PASSWORD_HASH` | BCrypt hash of the administrator password | **Yes** | `$2a$10$abcdef...` |
| `RESEND_API_KEY` | Resend REST API key for transactional emails | **Yes** | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Verified sender address for candidate emails | **Yes** | `NextVacancy <alerts@nextvacancy.vercel.app>` |
| `LOG_FILE` | Log file destination path | No | `/var/log/nextvacancy/api.log` |

---

## Local Development Setup

1. Copy `.env.example` in `frontend/` and `backend/` to `.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
2. Start the backend:
   ```bash
   cd backend && mvn spring-boot:run
   ```
3. Start the frontend:
   ```bash
   cd frontend && npm install && npm run dev
   ```
