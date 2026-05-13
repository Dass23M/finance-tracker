# 💰 FinanceTracker - Personal Finance & Budget Tracking Application

A full-stack web application for tracking income, expenses, budgets, and financial insights through a structured dashboard.

> **Technical Assignment Submission**
> Stack: React · Node.js · Express.js · MongoDB Atlas · REST API

---


## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [Database Design](#-database-design)

---

## ✨ Features

### Authentication
- User registration and login
- JWT access token (15 min) + refresh token (7 days)
- HTTP-only cookie for refresh token storage
- Silent token renewal on expiry
- bcrypt password hashing (12 salt rounds)
- Rate limiting, Helmet security headers, CORS protection

### Transaction Management
- Add, edit, delete, and list transactions
- Fields: title, amount, type (income/expense), category, date, note
- Filter by: type, category, date range, keyword search
- Sort by date or amount (asc/desc)
- Pagination (configurable page size)

### Budget Management
- Create monthly/weekly/yearly budgets per expense category
- Live spending calculation against actual transactions
- Progress percentage, remaining amount, exceeded flag
- Visual alert banner when limits are exceeded
- Budget summary (total budgeted, total spent, total remaining)

### Categories
- 13 default categories seeded automatically on registration
- Income: Salary, Freelance, Investments, Other Income
- Expense: Food, Transport, Rent, Shopping, Healthcare, Education, Entertainment, Utilities, Other Expense
- Create, edit, and delete custom categories
- Default categories protected from deletion
- Color picker for category personalisation

### Dashboard
- Financial summary: total income, expenses, net balance, active budgets
- **Chart 1:** Expense distribution by category (Donut / Pie chart)
- **Chart 2:** Monthly income vs expenses for the full year (Bar chart)
- **Chart 3:** Budget vs actual spending progress bars
- Recent transactions widget (last 5)
- Month/year selector to view any period

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router DOM | 6 | Client-side routing |
| TanStack React Query | 5 | Server state & caching |
| Axios | 1 | HTTP client |
| Recharts | 2 | Dashboard charts |
| React Hook Form | 7 | Form state & validation |
| React Hot Toast | 2 | Toast notifications |
| date-fns | 3 | Date formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express.js | 4 | Web framework |
| Mongoose | 8 | MongoDB ODM |
| jsonwebtoken | 9 | JWT authentication |
| bcryptjs | 2 | Password hashing |
| express-validator | 7 | Request validation |
| helmet | 7 | Security headers |
| express-rate-limit | 7 | Brute force protection |
| cors | 2 | Cross-origin requests |
| cookie-parser | 1 | Cookie handling |
| morgan | 1 | HTTP request logger |
| dotenv | 16 | Environment variables |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose ODM | Schema definition, validation, queries |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────┐
│              React Frontend (Vite)               │
│  Pages: Landing · Login · Register · Dashboard  │
│         Transactions · Budgets · Categories     │
│  State: AuthContext · React Query · Axios       │
└──────────────────┬──────────────────────────────┘
                   │  REST API (JSON)
                   │  Authorization: Bearer <token>
┌──────────────────▼──────────────────────────────┐
│           Express.js Backend (Node.js)           │
│  Middleware: Helmet · CORS · Rate Limiter        │
│             Auth (JWT) · Validator · Logger      │
│  Routes: /auth · /transactions · /budgets        │
│          /categories · /stats                   │
└──────────────────┬──────────────────────────────┘
                   │  Mongoose ODM
┌──────────────────▼──────────────────────────────┐
│              MongoDB Atlas (Cloud)               │
│  Collections: users · transactions · budgets    │
│               categories                        │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
finance-tracker/
│
├── server/                          # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── budgetController.js
│   │   │   ├── categoryController.js
│   │   │   └── statsController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT protect middleware
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── validate.js          # express-validator runner
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Budget.js
│   │   │   └── Category.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   ├── budgets.js
│   │   │   ├── categories.js
│   │   │   └── stats.js
│   │   └── utils/
│   │       ├── generateTokens.js
│   │       ├── defaultCategories.js
│   │       └── budgetHelpers.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── client/                          # React Frontend (Vite)
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js      # Axios + auto token refresh
    │   │   ├── authApi.js
    │   │   ├── transactionApi.js
    │   │   ├── budgetApi.js
    │   │   ├── categoryApi.js
    │   │   └── statsApi.js
    │   ├── components/
    │   │   ├── common/               # Modal, ConfirmDialog, StatCard...
    │   │   ├── layout/               # Sidebar, Topbar, DashboardLayout
    │   │   ├── dashboard/            # Charts, RecentTransactions
    │   │   ├── transactions/         # Form, Filters, Table, Pagination
    │   │   ├── budgets/              # BudgetForm, BudgetCard
    │   │   └── categories/           # CategoryForm, CategoryCard
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/                 # Login, Register
    │   │   ├── Dashboard.jsx
    │   │   ├── Transactions.jsx
    │   │   ├── Budgets.jsx
    │   │   ├── Categories.jsx
    │   │   └── Landing.jsx
    │   └── utils/
    │       ├── constants.js
    │       └── formatters.js
    ├── .env
    ├── .gitignore
    └── package.json
```

---

## ✅ Prerequisites

Make sure you have the following installed before running the project:

- **Node.js** v20 or higher → [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Git** → [Download](https://git-scm.com)
- **MongoDB Atlas account** (free tier) → [Sign up](https://www.mongodb.com/atlas)

---

## 🔐 Environment Variables

### Backend — `server/.env`

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas connection string
# Get from: Atlas Dashboard → Connect → Drivers → Copy connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority

# JWT secrets — use long random strings in production
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend — `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit `.env` files to GitHub. Both are already included in `.gitignore`.

---

## 🚀 Installation & Setup

### Step 1 — Clone the repositories

```bash
# Clone backend
git clone <your-backend-repo-url>
cd server

# Clone frontend (in a separate terminal or folder)
git clone <your-frontend-repo-url>
cd client
```

### Step 2 — Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign in
2. Create a free **M0** cluster
3. Under **Database Access** → Add a database user with a username and password
4. Under **Network Access** → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<username>` and `<password>` with your credentials
7. Paste the full URI into `server/.env` as `MONGODB_URI`

### Step 3 — Install backend dependencies

```bash
cd server
npm install
```

### Step 4 — Install frontend dependencies

```bash
cd client
npm install
```

### Step 5 — Configure environment files

```bash
# Backend
cp server/.env.example server/.env
# Then edit server/.env and fill in your MONGODB_URI and JWT secrets

# Frontend
cp client/.env.example client/.env
# VITE_API_URL=http://localhost:5000/api is already set
```

---

## ▶️ Running the Application

You need **two terminals** running simultaneously.

### Terminal 1 — Run the Backend

```bash
cd server
npm run dev
```

Expected output:
```
Server running in development mode on port 5000
MongoDB connected: cluster0.xxxxx.mongodb.net
```

### Terminal 2 — Run the Frontend

```bash
cd client
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Open in browser

```
http://localhost:5173
```

You should see the **FinanceTracker landing page**.

---

## 🗄️ Database

The application uses **MongoDB Atlas** (cloud-hosted). There is no local database installation required.

- Database name: `finance-tracker`
- Collections created automatically by Mongoose on first run:
  - `users`
  - `transactions`
  - `budgets`
  - `categories`
- Default categories (13) are **seeded automatically** when a new user registers — no manual seeding required.

To verify your database connection, hit the health check endpoint:
```
GET http://localhost:5000/api/health
```
Expected:
```json
{ "success": true, "message": "Server is running", "env": "development" }
```

---

## 📡 API Reference

All protected routes require:
```
Authorization: Bearer <accessToken>
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and get tokens |
| POST | `/logout` | 🔒 | Logout and clear session |
| POST | `/refresh` | Public | Refresh access token via cookie |
| GET | `/me` | 🔒 | Get current logged-in user |

### Transactions — `/api/transactions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | 🔒 | Get transactions (filter + paginate) |
| GET | `/:id` | 🔒 | Get single transaction |
| GET | `/summary` | 🔒 | Get income/expense totals |
| POST | `/` | 🔒 | Create transaction |
| PUT | `/:id` | 🔒 | Update transaction |
| DELETE | `/:id` | 🔒 | Delete transaction |

**Query params for GET /**
```
?type=income|expense
?category=<categoryId>
?startDate=YYYY-MM-DD
?endDate=YYYY-MM-DD
?search=keyword
?sortBy=date|amount
?order=asc|desc
?page=1&limit=10
```

### Budgets — `/api/budgets`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | 🔒 | Get budgets with live spending |
| GET | `/:id` | 🔒 | Get single budget |
| POST | `/` | 🔒 | Create budget |
| PUT | `/:id` | 🔒 | Update budget amount |
| DELETE | `/:id` | 🔒 | Delete budget |

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | 🔒 | Get all categories |
| GET | `/:id` | 🔒 | Get single category |
| POST | `/` | 🔒 | Create custom category |
| PUT | `/:id` | 🔒 | Update category |
| DELETE | `/:id` | 🔒 | Delete category (non-default only) |

### Stats — `/api/stats`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | 🔒 | Full dashboard data (single call) |
| GET | `/summary` | 🔒 | Financial summary for a period |
| GET | `/monthly-trend` | 🔒 | Monthly income vs expense for a year |
| GET | `/category-breakdown` | 🔒 | Expense breakdown by category |

---

## 🗃️ Database Design

### `users` collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `name` | String | Full name |
| `email` | String | Unique email address |
| `password` | String | bcrypt hashed password |
| `refreshToken` | String | Stored refresh token |
| `createdAt` | Date | Auto timestamp |
| `updatedAt` | Date | Auto timestamp |

### `transactions` collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `user` | ObjectId | Ref → users |
| `title` | String | Transaction title |
| `amount` | Number | Transaction amount |
| `type` | String | `income` or `expense` |
| `category` | ObjectId | Ref → categories |
| `date` | Date | Transaction date |
| `note` | String | Optional note |

### `budgets` collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `user` | ObjectId | Ref → users |
| `category` | ObjectId | Ref → categories |
| `amount` | Number | Budget limit |
| `period` | String | `monthly`, `weekly`, `yearly` |
| `month` | Number | 1–12 |
| `year` | Number | e.g. 2025 |
| `isActive` | Boolean | Active status |

### `categories` collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `user` | ObjectId | Ref → users |
| `name` | String | Category name |
| `type` | String | `income` or `expense` |
| `color` | String | Hex color code |
| `icon` | String | Icon identifier |
| `isDefault` | Boolean | Seeded default flag |

---

## 🔒 Security Implementation

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs with 12 salt rounds |
| Authentication | JWT access (15m) + refresh (7d) tokens |
| Token storage | Access token in memory, refresh in HTTP-only cookie |
| Route protection | `protect` middleware on all private routes |
| Request validation | express-validator on all POST/PUT endpoints |
| Security headers | Helmet.js |
| CORS | Whitelisted frontend origin only |
| Rate limiting | 100 requests per 15 minutes per IP |

---

## 📝 Available Scripts

### Backend (`server/`)

```bash
npm run dev      # Start with nodemon (development)
npm start        # Start without nodemon (production)
```

### Frontend (`client/`)

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

*Built with React, Express.js, and MongoDB Atlas*
