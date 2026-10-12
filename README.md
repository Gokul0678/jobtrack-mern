# JobTrack – Job Application Tracker (MERN)

A full-stack app to track job applications: secure login, add/edit/delete applications, search, status filters and a live dashboard.

**Live demo:** _add your Vercel link here_  |  **API:** _add your Render link here_

## Features
- JWT authentication (register / login) with bcrypt-hashed passwords
- Full CRUD for applications, scoped per user (users only see their own data)
- Search by company or role, filter by status, quick status change
- Dashboard counts per status using a MongoDB aggregation
- Responsive React UI

## Tech Stack
React (Vite), Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs

## Backend Architecture
Layered structure: **routes -> controllers -> services -> models**, so HTTP handling, business logic and data access stay separate.

```
server/
├── server.js                  # Entry point: connects to MongoDB, starts the server
└── src/
    ├── app.js                 # Express setup: middleware, routes, error handling
    ├── config/db.js           # MongoDB connection
    ├── routes/                # URL -> controller mapping (auth, jobs)
    ├── controllers/           # Read the request, call a service, send the response
    ├── services/              # Business logic (hashing, tokens, queries, aggregation)
    ├── models/                # Mongoose schemas (User, Job)
    ├── middleware/            # auth (JWT), notFound, errorHandler
    └── utils/                 # ApiError, asyncHandler, token helpers
```

## API
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in, returns JWT |
| GET | /api/jobs?status=&q= | List, filter, search |
| GET | /api/jobs/stats | Counts per status |
| POST | /api/jobs | Add application |
| PUT | /api/jobs/:id | Update application |
| DELETE | /api/jobs/:id | Delete application |

## Run locally
```bash
# 1. Backend  (needs MongoDB running locally, or a MongoDB Atlas URI)
cd server
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

## Deploy (free)
1. **Database:** create a free cluster on MongoDB Atlas, copy the connection string.
2. **Backend on Render:** New Web Service, root directory `server`, build `npm install`, start `npm start`. Env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL).
3. **Frontend on Vercel:** import the repo, root directory `client`, env var `VITE_API_URL` = your Render URL.
