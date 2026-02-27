# CipherSQLStudio

A browser-based SQL learning platform where students practice SQL queries against pre-configured assignments with real-time execution and intelligent LLM-powered hints.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Express](https://img.shields.io/badge/Express-4-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Seeding Sample Data](#seeding-sample-data)
8. [Running the App](#running-the-app)
9. [Data-Flow Diagram](#data-flow-diagram)
10. [Technology Choices Explanation](#technology-choices-explanation)

---

## Features

| Feature | Description |
|---|---|
| **Assignment Listing** | Browse SQL assignments filtered by difficulty (easy / medium / hard) with search |
| **SQL Editor** | Monaco Editor with syntax highlighting, auto-complete, and Ctrl+Enter execution |
| **Real-time Execution** | Queries run against a live PostgreSQL sandbox; results displayed in a formatted table |
| **Sample Data Viewer** | Expandable panels showing each table's schema + first 50 rows |
| **LLM Hints** | Gemini-powered hints that guide without revealing the solution |
| **Auth (Optional)** | JWT-based login / signup to track per-user attempts |
| **Responsive UI** | Mobile-first SCSS (320 → 641 → 1024 → 1281 px breakpoints) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, SCSS (vanilla), Monaco Editor |
| Backend | Node.js, Express.js |
| Sandbox DB | PostgreSQL |
| Persistence DB | MongoDB (Atlas) |
| LLM | Google Gemini 1.5 Flash |
| Auth | JWT + bcrypt |

---

## Project Structure

```
CipherSQLStudio/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios API helper
│   │   ├── components/         # Reusable UI components (BEM + SCSS)
│   │   │   ├── AssignmentCard/
│   │   │   ├── Auth/
│   │   │   ├── HintPanel/
│   │   │   ├── Navbar/
│   │   │   ├── QuestionPanel/
│   │   │   ├── ResultsPanel/
│   │   │   ├── SampleDataViewer/
│   │   │   └── SQLEditor/
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Home/
│   │   │   └── Assignment/
│   │   └── styles/             # SCSS partials (_variables, _mixins, _reset)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # DB connections (MongoDB, PostgreSQL)
│   │   ├── middleware/         # Auth JWT + SQL query validator
│   │   ├── models/             # Mongoose schemas (Assignment, User, Attempt)
│   │   ├── routes/             # REST endpoints
│   │   ├── services/           # LLM integration (Gemini)
│   │   └── seed/               # Seed script for PG tables + Mongo assignments
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 running locally (or a cloud instance)
- **MongoDB Atlas** account (free tier works) — or local MongoDB
- **Gemini API key** — free at https://aistudio.google.com/app/apikey

---

## Installation & Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/CipherSQLStudio.git
cd CipherSQLStudio

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

---

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` → `server/.env` and fill in your values:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PG_HOST` | PostgreSQL host (default: `localhost`) |
| `PG_PORT` | PostgreSQL port (default: `5432`) |
| `PG_USER` | PostgreSQL user |
| `PG_PASSWORD` | PostgreSQL password |
| `PG_DATABASE` | Sandbox DB name (e.g. `ciphersql_sandbox`) |
| `JWT_SECRET` | Secret for signing JWTs |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: `5000`) |

### Client (`client/.env`)

Copy `client/.env.example` → `client/.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (default: `http://localhost:5000/api`) |

---

## Seeding Sample Data

Create the PostgreSQL database first:

```bash
psql -U postgres -c "CREATE DATABASE ciphersql_sandbox;"
```

Then run the seed script to populate both PostgreSQL (tables + rows) and MongoDB (assignments):

```bash
cd server
npm run seed
```

This inserts:
- **PostgreSQL**: `departments`, `employees`, `customers`, `products`, `orders`, `order_items`
- **MongoDB**: 6 assignments (easy / medium / hard)

---

## Running the App

```bash
# Terminal 1 — Start backend
cd server
npm run dev          # nodemon on port 5000

# Terminal 2 — Start frontend
cd client
npm run dev          # Vite dev server on port 3000
```

Open **http://localhost:3000** in your browser.

---



---

## Technology Choices Explanation

| Choice | Rationale |
|---|---|
| **React 19 + Vite** | Fast HMR, modern JSX transform, minimal config |
| **Vanilla SCSS** | Demonstrates fundamental CSS knowledge; uses variables, nesting, mixins, and partials following BEM conventions |
| **Monaco Editor** | Same editor engine as VS Code — SQL syntax highlighting, IntelliSense-ready, keyboard shortcuts |
| **Express.js** | Lightweight, widely-used Node.js framework; easy middleware chaining for validation and auth |
| **PostgreSQL** | Industry-standard relational DB; perfect for a SQL learning sandbox with `statement_timeout` for safety |
| **MongoDB Atlas** | Flexible document model ideal for storing assignments with nested table schemas; free cloud tier |
| **Gemini 1.5 Flash** | Free-tier LLM API with strong instruction-following for hint generation without leaking solutions |
| **JWT + bcrypt** | Stateless auth suitable for SPAs; bcrypt for secure password hashing |
| **Mobile-first SCSS** | Breakpoints at 320, 641, 1024, 1281 px ensure usability from phones to ultrawide displays |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get single assignment |
| POST | `/api/query/execute` | Execute a SQL query |
| GET | `/api/query/sample-data?table=name` | Get sample rows for a table |
| POST | `/api/hint` | Generate an LLM hint |
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Validate token & get user |

---

## License

MIT
