# JobTrack – Job Application Tracker (MERN)

A full-stack web app that helps job seekers keep track of every application in one place: save the company and role, update the stage as things progress, and see the whole pipeline at a glance.

**Live demo:** [jobtrack-mern.vercel.app](https://jobtrack-mern.vercel.app) &nbsp;|&nbsp; **API:** [jobtrack-mern-khmi.onrender.com](https://jobtrack-mern-khmi.onrender.com/api/health)

> Hosted on free tiers (Vercel, Render and MongoDB Atlas), so the first load after a quiet period can take up to ~30 seconds while the server wakes up.

## Screenshots

### Login and registration
![JobTrack login page](docs/login.png)

### Dashboard with status filter
Status counts update automatically. The list below is filtered to show only applications in the **Interview** stage.

![Dashboard filtered by Interview status](docs/dashboard-filter-interview.png)

### Search and filter together
Search by company or role and combine it with the status filter.

![Searching for a company while filtering by status](docs/search-and-filter.png)

> The applications shown in the screenshots are sample demo data.

## Features
- **Secure authentication:** register and log in with JWT; passwords are hashed with bcrypt
- **Private data:** every user sees only their own applications
- **Full CRUD:** add, edit and delete applications (company, role, status, job link, notes)
- **Pipeline stages:** Applied, Interview, Offer and Rejected, changeable from a dropdown on each card
- **Live dashboard:** status counts calculated with a MongoDB aggregation
- **Search and filter:** find applications by company or role, and filter by status
- **Responsive UI** built with React

## Tech Stack
| Layer | Technologies |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas), Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |

## Backend Architecture
The server uses a layered structure: **routes → controllers → services → models**. This keeps HTTP handling, business logic and data access separate and easy to test.

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
All `/api/jobs` routes require the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/jobs?status=&q=` | List applications, with optional status filter and search |
| GET | `/api/jobs/stats` | Count of applications per status |
| POST | `/api/jobs` | Add an application |
| PUT | `/api/jobs/:id` | Update an application |
| DELETE | `/api/jobs/:id` | Delete an application |

## Run Locally

### Prerequisites
- Node.js 18 or higher
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB installation)

### 1. Backend
```bash
cd server
cp .env.example .env      # on Windows: copy .env.example .env
```
Edit `.env`:
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/jobtrack?retryWrites=true&w=majority
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
PORT=5000
```
Generate a strong secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then install and start:
```bash
npm install
npm run dev               # http://localhost:5000
```

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Never commit your `.env` file. It is already listed in `.gitignore`.

## Deployment
This project is deployed on free tiers:

- **Database:** MongoDB Atlas (free M0 cluster)
- **Backend:** Render (root directory `server`, build command `npm install`, start command `npm start`; set `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` as environment variables)
- **Frontend:** Vercel (root directory `client`; set `VITE_API_URL` to the Render URL)

## What I Learned
- Designing a layered REST API and keeping business logic out of route handlers
- Protecting routes with JWT middleware and scoping every query to the logged-in user
- Using MongoDB aggregation to build dashboard statistics
- Handling errors consistently with a central error handler

## Author
**Gokul P M**
[LinkedIn](https://www.linkedin.com/in/gokul-p-m135) · [GitHub](https://github.com/Gokul0678) · gokul.pm135@gmail.com
