# Real-Time Expert Booking System

Production-oriented full-stack implementation with Node.js, Express, MongoDB, Socket.io, and React.

## Project Structure

- `backend/` - REST APIs, booking concurrency guard, socket events.
- `frontend/` - React pages for expert list, detail, booking form, and bookings by email.

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in frontend environment if API is not at `http://localhost:5000`.

## Core behavior

- Double-booking protection via MongoDB unique compound index on `(expert, date, timeSlot)`.
- Duplicate write conflict handled with `409` and message `Slot already booked`.
- Socket event `slotBooked` emitted after successful booking creation.
- Lightweight request logging middleware logs `METHOD URL STATUS - duration` for each request.

## Seeder

- Run `npm run seed` in `backend/` to load sample experts for evaluator/demo usage.
- Seeder file: `backend/scripts/seedExperts.js`.

## Demo flow suggestion

1. Show expert listing with search, category filter, and pagination.
2. Open two browser tabs for the same expert and slot.
3. Submit both bookings simultaneously and show only one succeeds (`Slot already booked` for the other).
4. Show real-time slot disable on the second tab via `slotBooked` socket event.
5. Show booking form validations.
6. Show My Bookings lookup by email.
