# NextVacancy

NextVacancy is a recruitment and job alert platform for India, designed to help users discover verified government and private job opportunities across sectors such as banking, railways, defense, state PSCs, and tech roles.

The project is split into a modern frontend and a Java-based backend service, with deployment configuration for cloud hosting and environment-based configuration.

## Overview

This repository contains the full source for the NextVacancy platform:

- Frontend: React + Vite + Tailwind CSS
- Backend: Spring Boot REST API
- Database: PostgreSQL
- Deployment: Render for API, Vercel or similar hosting for frontend
- Legacy code: archived migration code retained for reference

## Why NextVacancy?

The platform is built to:

- Surface the latest job vacancies quickly and clearly
- Organize postings by category and source
- Provide a clean user experience on both desktop and mobile
- Support administration and secure access for internal operations
- Deliver email-based notifications and operational alerts

## Features

- Search and browse vacancies by category and location
- Latest recruitment updates for government and private sectors
- Responsive, modern frontend experience
- Secure authentication and authorization for admin workflows
- JWT-based backend security
- Database-backed persistence for jobs and application data
- Email notification support via Resend
- Production-ready deployment configuration

## Architecture

This project is structured as a full-stack application:

- Frontend app in `frontend/`
- Backend API in `backend/`
- Deployment config in `render.yaml`
- Archived legacy implementation in `archive/`

### Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router
- Backend: Java, Spring Boot 3, Spring Security, Spring Data JPA
- Database: PostgreSQL
- Hosting: Render (API), Vercel-friendly frontend deployment

## Repository Structure

```text
nextvacancy/
├── backend/              # Spring Boot API
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   └── pom.xml
├── frontend/             # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── api/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── archive/              # Legacy or historical app artifacts
├── .gitignore
├── render.yaml           # Render deployment config
├── README.md
└── .vscode/
