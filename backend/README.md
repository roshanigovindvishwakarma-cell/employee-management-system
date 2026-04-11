## Backend (Express + PostgreSQL + Prisma + JWT)

### Setup
- Copy env:
  - `copy .env.example .env`
- Update `DATABASE_URL` + `JWT_SECRET` in `backend/.env`

### Install
- `npm install` (run inside `backend/`)

### Database
- `npx prisma generate`
- `npx prisma migrate dev --name init`

### Run
- Dev: `npm run dev`
- Prod: `npm start`

### API
- **Health**: `GET /health`
- **Auth**:
  - `POST /api/auth/signup` body: `{ "name": "...", "email": "...", "password": "...", "role": "ADMIN|USER" }`
  - `POST /api/auth/login` body: `{ "email": "...", "password": "..." }`
  - `GET /api/auth/me` (Bearer token)
- **Employees** (Bearer token required):
  - `GET /api/employees`
  - `GET /api/employees/stats`
  - `GET /api/employees/:id`
  - `POST /api/employees` (ADMIN)
  - `PUT /api/employees/:id` (ADMIN)
  - `DELETE /api/employees/:id` (ADMIN)

