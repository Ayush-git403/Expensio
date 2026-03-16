<div align="center">

# Expensio 💸

**A full-stack personal expense tracking application**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-expensio--chi.vercel.app-black?style=for-the-badge&logo=vercel)](https://expensio-chi.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-purple?style=for-the-badge&logo=render)](https://expensio-api-izqf.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Ayush--git403%2FExpensio-181717?style=for-the-badge&logo=github)](https://github.com/Ayush-git403/Expensio)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

</div>

---

## What is Expensio?

Expensio is a production-deployed full-stack web application for personal expense management. It lets users register, log in securely, and track their expenses month by month across a yearly calendar view. All data is persisted in the cloud — accessible from any device, any time.

**Built as a learning project** to cover the entire MERN stack from scratch — local development, authentication, database design, API design, responsive UI, and cloud deployment.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://expensio-chi.vercel.app |
| Backend API | https://expensio-api-izqf.onrender.com |
| API Health | https://expensio-api-izqf.onrender.com/ |

> **Note:** The backend runs on Render's free tier and may take ~50 seconds to wake up after inactivity. Subsequent requests are fast.

---

## Features

### User Authentication
- Register with name, email and password
- Login returns a secure session via HttpOnly cookie
- Session persists across page refreshes via `/api/auth/me`
- Session clears on browser close (session cookies, not persistent)
- Logout clears the cookie on the server side

### Expense Tracking
- Add expenses with name, amount, category, date and optional note
- 10 categories: Food, Transport, Housing, Health, Entertainment, Shopping, Education, Travel, Utilities, Other
- Edit and delete any expense inline
- All data scoped to the logged-in user — no shared data between accounts

### Yearly Calendar View
- Visual 12-month grid showing total spending per month
- Progress bar showing each month relative to the peak spending month
- Year navigation (go back/forward by year)
- Current month highlighted with a "NOW" badge
- Summary cards: Total Spent, Active Months, Monthly Average, Busiest Month

### Monthly Expense View
- Click any month to see all expenses for that month
- Running total at the top
- Category color badges on each expense
- Inline add, edit and delete — no page navigation needed

### UI & Design
- **Dark / Light theme toggle** — preference saved in `localStorage`
- **Fully responsive** — works on mobile, tablet, and desktop
- Mobile hamburger menu, 2-col grid on phone, 4-col grid on desktop
- High-contrast black navbar on both themes
- DM Sans + DM Serif Display typography

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | Component-based UI framework |
| Vite | Build tool and dev server |
| React Router DOM | Client-side page routing |
| Axios | HTTP client with interceptors |
| Recharts | Pie and bar chart visualizations |
| DM Sans + DM Serif | Google Fonts typography |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework and REST API |
| Mongoose | MongoDB ODM (schema + queries) |
| bcryptjs | Password hashing (salted) |
| jsonwebtoken | JWT generation and verification |
| cookie-parser | Read HttpOnly cookies on requests |
| dotenv | Environment variable management |
| nodemon | Auto-restart server on file changes |

### Database & Deployment
| Technology | Purpose |
|-----------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Vercel | Frontend hosting with CDN |
| Render | Backend Node.js server hosting |
| GitHub | Source control and CI/CD trigger |

---

## Project Architecture

```
User Browser
     │
     │  HTTPS + HttpOnly Cookie (JWT)
     ▼
┌─────────────────────────────────────────┐
│           React App (Vercel)            │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Pages   │  │Components│  │Context│ │
│  │ Login    │  │ Navbar   │  │ Auth  │ │
│  │ Register │  │MonthView │  │ Theme │ │
│  │ Home     │  │Protected │  │ axios │ │
│  └──────────┘  └──────────┘  └───────┘ │
└────────────────────┬────────────────────┘
                     │ REST API (JSON)
                     │ withCredentials: true
                     ▼
┌─────────────────────────────────────────┐
│         Express Server (Render)         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Routes  │  │Middleware│  │Models │ │
│  │/api/auth │  │  auth    │  │ User  │ │
│  │/api/     │  │  CORS    │  │Expense│ │
│  │expenses  │  │  cookie  │  │       │ │
│  └──────────┘  └──────────┘  └───────┘ │
└────────────────────┬────────────────────┘
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────┐
│          MongoDB Atlas (Cloud)          │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │    users     │  │    expenses      │ │
│  │ name         │  │ userId (ref)     │ │
│  │ email        │  │ name             │ │
│  │ password     │  │ amount           │ │
│  │ (hashed)     │  │ category         │ │
│  └──────────────┘  │ date  note       │ │
│                    └──────────────────┘ │
└─────────────────────────────────────────┘
```

### Request Flow (Authenticated)

```
1. User visits expensio-chi.vercel.app
2. AuthContext calls GET /api/auth/me
3. Browser auto-sends HttpOnly cookie
4. authMiddleware verifies JWT in cookie
5. Returns user object → user stays logged in
6. User clicks March → GET /api/expenses?month=3&year=2026
7. Backend filters expenses by userId + month/year
8. Returns JSON array → MonthView renders the list
```

### Authentication Flow

```
Register / Login
      │
      ▼
POST /api/auth/login
      │
      ├─ Find user in MongoDB
      ├─ bcrypt.compare(password, hash)
      ├─ jwt.sign({ id: userId }, JWT_SECRET)
      └─ res.cookie('expensio_token', token, { httpOnly: true, secure: true, sameSite: 'none' })
                                │
                                ▼
                   Token stored in HttpOnly cookie
                   (JavaScript cannot access it)
                                │
                      Every subsequent request
                                │
                                ▼
                   Browser auto-sends cookie
                                │
                                ▼
                   authMiddleware → jwt.verify()
                                │
                                ▼
                   req.user = { id } → fetch user data
```

---

## Folder Structure

```
Expensio/
├── expensio/                    ← React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         ← Axios instance with credentials
│   │   ├── components/
│   │   │   ├── Navbar.jsx       ← Sticky top bar with theme toggle
│   │   │   ├── MonthView.jsx    ← Monthly expense list + add form
│   │   │   └── ProtectedRoute.jsx ← Auth guard for private pages
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  ← Global user state + session check
│   │   │   └── ThemeContext.jsx ← Dark/light theme token system
│   │   ├── hooks/
│   │   │   └── useWindowSize.js ← Responsive breakpoint hook
│   │   ├── pages/
│   │   │   ├── Login.jsx        ← Login form
│   │   │   ├── Register.jsx     ← Registration form
│   │   │   └── Home.jsx         ← Yearly calendar dashboard
│   │   ├── utils/
│   │   │   └── helpers.js       ← Categories, colors, formatINR
│   │   ├── App.jsx              ← Router + context providers
│   │   ├── App.css              ← Global styles + fonts
│   │   └── main.jsx             ← React DOM entry point
│   ├── vercel.json              ← SPA routing rewrite rule
│   ├── vite.config.js
│   └── package.json
│
└── server/                      ← Node.js + Express backend
    ├── middleware/
    │   └── authMiddleware.js    ← JWT verification on protected routes
    ├── models/
    │   ├── User.js              ← Mongoose user schema
    │   └── Expense.js           ← Mongoose expense schema
    ├── routes/
    │   ├── auth.js              ← /register /login /logout /me
    │   └── expenses.js          ← CRUD + month/year filtering
    ├── .env                     ← Local secrets (gitignored)
    ├── index.js                 ← Express app entry point
    └── package.json
```

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `POST` | `/register` | Create new account, sets cookie | No |
| `POST` | `/login` | Login, sets HttpOnly cookie | No |
| `POST` | `/logout` | Clear session cookie | No |
| `GET` | `/me` | Get current user from cookie | Cookie |

### Expense Routes — `/api/expenses`

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `GET` | `/` | Get all expenses for user | JWT Cookie |
| `GET` | `/?month=3&year=2026` | Filter by month and year | JWT Cookie |
| `GET` | `/?year=2026` | Filter by year only | JWT Cookie |
| `POST` | `/` | Create new expense | JWT Cookie |
| `PUT` | `/:id` | Update expense by ID | JWT Cookie |
| `DELETE` | `/:id` | Delete expense by ID | JWT Cookie |

### Example Request

```javascript
// GET expenses for March 2026
GET https://expensio-api-izqf.onrender.com/api/expenses?month=3&year=2026
Cookie: expensio_token=eyJhbGciOiJIUzI1NiJ9...

// Response
[
  {
    "_id": "67b1...",
    "userId": "67a0...",
    "name": "Groceries",
    "amount": 1200,
    "category": "Food",
    "date": "2026-03-05T00:00:00.000Z",
    "note": "Big Bazaar weekly shop"
  }
]
```

---

## Database Schema

### User

```javascript
{
  name:      String  (required, trimmed),
  email:     String  (required, unique, lowercase),
  password:  String  (required, bcrypt hashed),
  createdAt: Date    (auto),
  updatedAt: Date    (auto)
}
```

### Expense

```javascript
{
  userId:    ObjectId  (ref: 'User', required),
  name:      String    (required, trimmed),
  amount:    Number    (required),
  category:  String    (enum: 10 categories),
  date:      Date      (required),
  note:      String    (default: ''),
  createdAt: Date      (auto),
  updatedAt: Date      (auto)
}
```

---

## Security Implementation

### HttpOnly Cookies vs localStorage

```
localStorage (less secure):
  ✗ Accessible by JavaScript
  ✗ Vulnerable to XSS attacks
  ✗ Stolen by malicious scripts

HttpOnly Cookie (used in Expensio):
  ✓ JavaScript cannot read it
  ✓ XSS attacks cannot steal the token
  ✓ Browser sends it automatically on every request
  ✓ Cleared on browser close (session cookie)
```

### Cookie Options

```javascript
const COOKIE_OPTIONS = {
  httpOnly: true,     // JS cannot access
  secure: true,       // HTTPS only (production)
  sameSite: 'none',   // Required for cross-domain (Vercel ↔ Render)
  // No maxAge = session cookie, cleared on browser close
};
```

### CORS Setup

```javascript
// Dynamic origin whitelist — allows all *.vercel.app subdomains
const corsOptions = {
  origin: function(origin, callback) {
    const isVercel = origin?.endsWith('.vercel.app');
    const isLocalhost = origin?.includes('localhost');
    if (isVercel || isLocalhost) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,   // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
```

---

## Local Development Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Ayush-git403/Expensio.git
cd Expensio/expensio
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expensio
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
# ✅ MongoDB connected
# 🚀 Server running on port 5000
```

### 3. Setup the frontend

```bash
cd ..   # back to expensio/
npm install
```

Create `expensio/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
# → Local: http://localhost:5173
```

### 4. Open the app

Visit `http://localhost:5173` → Register a new account → Start tracking!

---

## Deployment

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `expensio/server` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Environment Variables | `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production` |

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `expensio` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | `VITE_API_URL=https://your-render-url.onrender.com/api` |

### Auto-deploy on push

Both Render and Vercel watch the GitHub `main` branch. Every `git push` triggers an automatic redeploy — no manual steps needed.

```bash
# Make changes locally → test → push
git add .
git commit -m "feat: your change"
git push origin main
# Both services redeploy automatically in ~2 minutes ✅
```

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_secret_key` |
| `NODE_ENV` | Environment mode | `development` / `production` |

### Frontend (`.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

> Never commit `.env` files. They are listed in `.gitignore`.

---

## What I Learned Building This

- **React** — components, hooks, Context API, React Router, custom hooks
- **Node.js + Express** — REST API design, middleware, route protection
- **MongoDB + Mongoose** — schema design, CRUD operations, query filtering
- **Authentication** — JWT tokens, bcrypt hashing, HttpOnly cookies, session management
- **Security** — CORS configuration, XSS prevention, `.env` secret management
- **Deployment** — Vercel (frontend), Render (backend), environment variables in production
- **Debugging** — CORS errors, 404 routing issues, redirect loops, Git case-sensitivity on Windows
- **Responsive Design** — custom breakpoint hooks, mobile-first layouts, hamburger menus

---

## Future Improvements

- [ ] Export expenses to CSV
- [ ] Budget alerts (push notifications when nearing limit)
- [ ] Recurring expense templates
- [ ] Multi-currency support
- [ ] Google / GitHub OAuth login
- [ ] Charts on the monthly view (category breakdown pie chart)
- [ ] Search and filter expenses by keyword

---

## License

MIT — free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by **Ayush** · March 2026

[Live App](https://expensio-chi.vercel.app) · [GitHub](https://github.com/Ayush-git403/Expensio) · [API](https://expensio-api-izqf.onrender.com)

</div>