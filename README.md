# Real-Time Expert Booking System

Production-oriented full-stack implementation with Node.js, Express, MongoDB, Socket.io, and React.

## Project Structure

- `backend/` - REST APIs, booking concurrency guard, socket events.
- `frontend/` - React pages for expert list, detail, booking form, and bookings by email.
- `docker-compose.yml` - one-command deployment for MongoDB + backend + frontend.

## Run locally (without Docker)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in frontend environment if API is not at `http://localhost:5000`.

## Deploy and run with Docker

```bash
docker compose up --build -d
```

Then access:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/health`

To stop containers:

```bash
docker compose down
```

To stop and remove DB volume:

```bash
docker compose down -v
```


## Deploy to Render

This repo includes `render.yaml` for blueprint deployment.

1. Push repository to GitHub.
2. In Render, choose **New +** → **Blueprint** and select this repo.
3. Set required secret env vars in Render:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Deploy both services (`expert-booking-backend`, `expert-booking-frontend`).

After deployment:

- Frontend URL: `https://expert-booking-frontend.onrender.com`
- Backend URL: `https://expert-booking-backend.onrender.com`

## Seeder

- Run `npm run seed` in `backend/` to load sample experts for evaluator/demo usage.
- Seeder file: `backend/scripts/seedExperts.js`.

## API functionality demo (curl)

1. **Health check**

```bash
curl http://localhost:5000/health
```

2. **List experts with pagination/filter/search**

```bash
curl "http://localhost:5000/api/experts?page=1&limit=5&search=ava&category=Technology"
```

3. **Create booking**

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "expertId": "<EXPERT_ID>",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "1234567890",
    "date": "2026-03-01T00:00:00.000Z",
    "timeSlot": "09:00",
    "notes": "Career planning"
  }'
```

4. **Race-condition protection check** (run same booking request again)

Expected response message:

```json
{"success":false,"message":"Slot already booked"}
```

5. **Get bookings by email**

```bash
curl "http://localhost:5000/api/bookings?email=jane@example.com"
```

## Core behavior

- Double-booking protection via MongoDB unique compound index on `(expert, date, timeSlot)`.
- Duplicate write conflict handled with `409` and message `Slot already booked`.
- Socket event `slotBooked` emitted after successful booking creation.
- Lightweight request logging middleware logs `METHOD URL STATUS - duration` for each request.

## Demo flow suggestion

1. Show expert listing with search, category filter, and pagination.
2. Open two browser tabs for the same expert and slot.
3. Submit both bookings simultaneously and show only one succeeds (`Slot already booked` for the other).
4. Show real-time slot disable on the second tab via `slotBooked` socket event.
5. Show booking form validations.
6. Show My Bookings lookup by email.
