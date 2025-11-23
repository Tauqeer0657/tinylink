# 🔗 TinyLink - URL Shortener

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=netlify)](https://eclectic-duckanoo-f33089.netlify.app/)
[![Backend API](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=render)](https://tinylink-fa5s.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Tauqeer0657/tinylink)

A modern, full-stack URL shortener application built with Node.js, Express, React, and PostgreSQL. Create short, shareable links and track their analytics.

---

## 🌐 Live Links

| Service | URL | Status |
|---------|-----|--------|
| 🌍 **Frontend** | [https://eclectic-duckanoo-f33089.netlify.app](https://eclectic-duckanoo-f33089.netlify.app/) | ✅ Live |
| ⚙️ **Backend API** | [https://tinylink-fa5s.onrender.com](https://tinylink-fa5s.onrender.com) | ✅ Live |
| 🏥 **Health Check** | [https://tinylink-fa5s.onrender.com/healthz](https://tinylink-fa5s.onrender.com/healthz) | ✅ Live |
| 💻 **Source Code** | [https://github.com/Tauqeer0657/tinylink](https://github.com/Tauqeer0657/tinylink) | 📂 Public |

> **Note:** Backend may take 30-60 seconds to wake up on first request (Render free tier).

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

## ✨ Features

- ✅ Create short URLs with auto-generated or custom codes (6-8 alphanumeric characters)
- ✅ Click tracking and analytics
- ✅ Search and filter links
- ✅ Pagination for large datasets
- ✅ Responsive design with Tailwind CSS
- ✅ 302 redirects for proper analytics
- ✅ Input validation and error handling
- ✅ Security features (Helmet, XSS protection, Rate limiting)
- ✅ Health check endpoint

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js v20+
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **Security:** Helmet, XSS-Clean, Express Rate Limit

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router DOM

## 📁 Project Structure

tinylink/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── database.js
│ │ ├── controllers/
│ │ │ └── linkController.js
│ │ ├── routes/
│ │ │ └── linkRoutes.js
│ │ ├── middlewares/
│ │ │ └── errorHandler.js
│ │ ├── utils/
│ │ │ ├── asyncHandler.js
│ │ │ ├── ApiError.js
│ │ │ └── codeGenerator.js
│ │ ├── app.js
│ │ └── server.js
│ ├── .env
│ ├── .env.example
│ └── package.json
│
└── frontend/
├── src/
│ ├── components/
│ │ ├── Header.jsx
│ │ ├── LinkForm.jsx
│ │ └── LinkTable.jsx
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ └── StatsPage.jsx
│ ├── services/
│ │ └── api.js
│ ├── utils/
│ │ └── helpers.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env
└── package.json

text

## 📋 Prerequisites

- Node.js v20.6.0 or higher (for native `--env-file` support)
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository

git clone https://github.com/Tauqeer0657/tinylink.git
cd tinylink

### 2. Backend Setup

cd backend
npm install

text

Create `.env` file:

DATABASE_URL=postgresql://username:password@host/database
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development

### 3. Frontend Setup

cd ../frontend
npm install

Create `.env` file:

VITE_API_URL=http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)

| Variable         | Description                  | Example                            |
| ---------------- | ---------------------------- | ---------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `BASE_URL`     | Backend base URL             | `http://localhost:3000`          |
| `FRONTEND_URL` | Frontend URL for CORS        | `http://localhost:5173`          |
| `PORT`         | Server port                  | `3000`                           |
| `NODE_ENV`     | Environment mode             | `development` or `production`  |

### Frontend (.env)

| Variable         | Description     | Example                   |
| ---------------- | --------------- | ------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
cd backend
npm run dev

Server runs on: `http://localhost:3000`

**Terminal 2 - Frontend:**
cd frontend
npm run dev

Frontend runs on: `http://localhost:5173`

## 📡 API Endpoints

### Health Check

GET /healthz
Response: 200 OK
{
"ok": true,
"version": "1.0",
"uptime": 123.45,
"timestamp": "2025-11-23T12:00:00.000Z"
}

text

### Create Short Link

POST /api/links
Content-Type: application/json

{
"url": "https://example.com/very/long/url",
"code": "custom1" // Optional: 6-8 alphanumeric characters
}

Response: 201 Created
{
"code": "custom1",
"shortUrl": "http://localhost:3000/custom1",
"targetUrl": "https://example.com/very/long/url",
"clicks": 0,
"createdAt": "2025-11-23T12:00:00.000Z"
}

### Get All Links

GET /api/links

Response: 200 OK
[
{
"code": "abc123",
"targetUrl": "https://example.com",
"clicks": 42,
"lastClickedAt": "2025-11-23T11:30:00.000Z",
"createdAt": "2025-11-22T10:00:00.000Z"
}
]

### Get Single Link Stats

GET /api/links/:code

Response: 200 OK
{
"code": "abc123",
"targetUrl": "https://example.com",
"clicks": 42,
"lastClickedAt": "2025-11-23T11:30:00.000Z",
"createdAt": "2025-11-22T10:00:00.000Z"
}

### Delete Link

DELETE /api/links/:code

Response: 200 OK
{
"message": "Link deleted successfully"
}

### Redirect (Short URL)

GET /:code

Response: 302 Found
Location: https://example.com

## 📸 Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)
*Main dashboard showing all shortened links with search and pagination*

### Stats Page

![Stats Page](screenshots/stats.png)
*Detailed analytics for individual short links*

### Create Link

![Create Link](screenshots/create-link.png)
*Form to create new short links with custom codes*

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **XSS-Clean** - Sanitizes user input
- **Rate Limiting** - Prevents abuse (20 requests per 1 minutes)
- **CORS** - Configured for specific origins
- **Input Validation** - Server-side validation for all inputs

## 🧪 Testing

### Manual Testing with Postman

1. **Health Check:** `GET http://localhost:3000/healthz`
2. **Create Link:** `POST http://localhost:3000/api/links`
3. **Get All Links:** `GET http://localhost:3000/api/links`
4. **Test Redirect:** `GET http://localhost:3000/{code}`

### Test Cases

- ✅ Create link with auto-generated code
- ✅ Create link with custom code
- ✅ Duplicate custom code returns 409
- ✅ Invalid URL returns 400
- ✅ Redirect increments click count
- ✅ Delete link returns 404 on subsequent access

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Md Tauqeer Iqbal**

---

**Made with ❤️ using Node.js and React**
