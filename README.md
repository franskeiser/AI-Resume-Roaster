# 🔥 Resume Roaster

> AI-powered, no-BS resume feedback for tech professionals.

Resume Roaster analyzes your resume with Google's Gemini models and returns a brutally honest, technical critique — an overall score, section-by-section feedback, and concrete action items — which you can export as a PDF.

<p>
  <img alt="Java" src="https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white">
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white">
  <img alt="Gemini" src="https://img.shields.io/badge/Google%20Gemini-AI-8E75B2?logo=googlegemini&logoColor=white">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg">
</p>

---

## ✨ Features

- **AI-powered analysis** — Google Gemini scores your resume and gives technical, actionable feedback.
- **Multi-format upload** — PDF, DOCX, and plain text, plus images (PNG/JPG) via on-device OCR.
- **PDF export** — download your roast report as a polished PDF.
- **Configurable model** — switch the Gemini model from an environment variable, no code changes.
- **Resilient by design** — automatic retry with backoff for transient AI rate-limit/overload errors.
- **Modern UI** — clean, responsive interface built with React and Tailwind CSS.

## 🏗️ Architecture

A decoupled frontend and backend, deployed independently:

```
┌──────────────────────┐         ┌───────────────────────────┐         ┌──────────────────┐
│   React + Vite SPA   │  HTTPS  │   Spring Boot REST API    │  HTTPS  │  Google Gemini   │
│   (Vercel)           │ ───────▶│   (Railway · Docker)      │ ───────▶│  generateContent │
│   Tailwind CSS       │◀─────── │   Text extraction · OCR   │◀─────── │                  │
└──────────────────────┘  JSON   │   PDF generation          │   JSON  └──────────────────┘
                                 └────────────┬──────────────┘
                                              │ JPA / Hibernate
                                              ▼
                                     ┌──────────────────┐
                                     │   PostgreSQL     │
                                     │   (Railway)      │
                                     └──────────────────┘
```

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router |
| **Backend** | Java 17, Spring Boot 3.5, Spring Data JPA |
| **AI** | Google Gemini API (`generateContent`) |
| **Database** | PostgreSQL (production) · H2 in-memory (local) |
| **Document processing** | Apache PDFBox, Apache POI, Tess4J (Tesseract OCR) |
| **Deployment** | Vercel (frontend) · Railway + Docker (backend & database) |

## 🚀 Getting Started (Local)

### Prerequisites

- **Java 17+** and **Node.js 18+**
- A **Google AI Studio API key** — [create one here](https://aistudio.google.com/app/apikey) (free tier available)

### 1. Clone

```bash
git clone https://github.com/franskeiser/AI-Resume-Roaster.git
cd AI-Resume-Roaster
```

### 2. Backend

The backend uses an in-memory **H2** database locally, so no database setup is required.

```bash
cd backend
# Provide your Gemini key (PowerShell: $env:GEMINI_API_KEY="..."; macOS/Linux below)
export GEMINI_API_KEY="your_gemini_api_key_here"
./mvnw spring-boot:run
```

The API starts on **http://localhost:8080**.

> **OCR note:** image uploads require [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installed locally. PDFs, DOCX, and TXT files work without it.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and talks to the backend at `http://localhost:8080/api` by default.

## ⚙️ Configuration

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend API (include `/api`, no trailing slash) | `http://localhost:8080/api` |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google AI Studio API key **(required)** | — |
| `GEMINI_MODEL` | Gemini model id (e.g. `gemini-flash-latest`, `gemini-2.5-flash`) | `gemini-flash-latest` |
| `SPRING_PROFILES_ACTIVE` | Set to `prod` to use PostgreSQL instead of H2 | _(unset → H2)_ |
| `SPRING_DATASOURCE_URL` | JDBC URL, e.g. `jdbc:postgresql://host:5432/db` | _(prod only)_ |
| `SPRING_DATASOURCE_USERNAME` | Database username | _(prod only)_ |
| `SPRING_DATASOURCE_PASSWORD` | Database password | _(prod only)_ |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins (your frontend URL) | local Vite ports |
| `PORT` | Port to listen on (injected by the host) | `8080` |

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resumes/analyze` | Upload a resume (multipart `resume`) and receive the analysis |
| `GET`  | `/api/resumes/{id}/export` | Download a given analysis as a PDF |

## ☁️ Deployment

The app deploys as two independent services.

### Backend → Railway (Docker)

1. Add a **PostgreSQL** plugin to your Railway project.
2. Create a service from this repo with **Root Directory = `backend`** (the `Dockerfile` is auto-detected).
3. Set the environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
   GEMINI_API_KEY=your_key
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
4. Generate a public domain (port `8080`).

### Frontend → Vercel

1. Import the repo with **Root Directory = `frontend`** (framework auto-detected as Vite).
2. Set `VITE_API_URL` to `https://your-backend.up.railway.app/api`.
3. Deploy.

## 📁 Project Structure

```
AI-Resume-Roaster/
├── backend/                      # Spring Boot API
│   ├── Dockerfile                # Multi-stage build + Tesseract OCR
│   └── src/main/java/com/resumeroaster/
│       ├── controller/           # REST endpoints
│       ├── service/              # AI, text extraction, OCR, PDF
│       ├── model/                # JPA entities
│       ├── repository/           # Spring Data repositories
│       └── config/               # CORS and app config
├── frontend/                     # React + Vite SPA
│   ├── vercel.json               # SPA rewrites + framework config
│   └── src/
│       ├── components/           # UI components
│       ├── services/             # API client
│       └── App.jsx               # Routes and main flow
└── README.md
```

## 🛠️ Build

```bash
# Backend
cd backend && ./mvnw clean package

# Frontend
cd frontend && npm run build && npm run lint
```

## 📄 License

Released under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- AI by [Google Gemini](https://ai.google.dev/)
- [Spring Boot](https://spring.io/projects/spring-boot) · [React](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/)

---

> **Note:** This is a portfolio/educational project. The AI feedback is intentionally blunt and shouldn't be taken as professional career advice.
