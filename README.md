# AuthentiNet

A human-only social network MVP built from the PRD: Node/Express + MongoDB backend, React (Vite) web client, and Docker Compose for orchestration. Features cover proof-of-humanity, verified posting, curated feeds, topic filters, and community spaces.

## Features
- Human verification workflow (recaptcha token submission + selfie confirmation stub) gating posting
- JWT authentication, profile settings, and positivity/topic filters for the chronological feed
- Human-stamped posts with topic tags and positivity flags
- Community creation and joining for trend-focused spaces
- Trending topics aggregation and curated discovery

## Project Structure
- `backend/` – Express API, Mongo models, auth/verification/posts/community routes
- `frontend/` – React client (Vite) with auth, verification, posting, feed, community, and settings views
- `docker-compose.yml` – Runs API, web, and MongoDB on obscure ports (43100/43210/43017)

## Environment
- Copy `backend/.env.example` to `backend/.env` and update `JWT_SECRET`, `MONGODB_URI`, `RECAPTCHA_SECRET` as needed.
- Copy `frontend/.env.example` to `frontend/.env` if overriding `VITE_API_URL` (defaults to API service in Docker or `http://localhost:43100`).

## Running (Docker Compose)
```bash
docker compose build
docker compose up
```
Services:
- API: http://localhost:43100
- Web: http://localhost:43210
- Mongo: localhost:43017 (mapped to container 27017)

## Running Locally (no Docker)
```bash
# Backend
cd backend
npm install
npm run dev # or npm start with PORT=43100

# Frontend
cd frontend
npm install
npm run dev -- --host --port 43210
```
Set `VITE_API_URL` to your API URL (defaults to http://localhost:43100).

## API Overview
- `POST /api/auth/register` – Create account (username, email, password)
- `POST /api/auth/login` – Authenticate
- `GET /api/auth/me` – Current user
- `PUT /api/auth/settings` – Feed preferences (positivity filter, topic boosts)
- `POST /api/verification/request` – Submit recaptcha token + note
- `POST /api/verification/confirm` – Confirm selfie (simulated) to mark verified
- `GET /api/verification/status` – Current verification state
- `POST /api/posts` – Create verified post (requires humanVerified)
- `GET /api/posts` – List posts with filters
- `GET /api/feed` – Chronological feed with optional positivity/topics filters
- `GET /api/feed/trending` – Trending topics aggregation
- `POST /api/communities` – Create community
- `GET /api/communities` – List communities
- `POST /api/communities/:id/join` – Join a community

## Notes
- Verification flows are stubbed for MVP and ready to swap with real recaptcha/biometric providers.
- Frontend uses positivity filters and topic boosts from user settings; posting is blocked until verification.
- Ports avoid common defaults per instructions: API 43100, Web 43210, Mongo 43017.

## Task Tracking
Ongoing work and summaries are maintained in `TASKS.md` (gitignored).
