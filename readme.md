# 🎬 CineTube Backend – Movie & Series Rating & Streaming Portal API

A scalable and modular backend API for a **Movie and Series Rating & Streaming Portal**, built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**. This system supports user interactions such as reviews, ratings, purchases, and watchlists, along with robust admin management and analytics.

---

## 🚀 Live Links

* 🔗 Backend Live: [https://cinetube-backend.vercel.app/](https://cinetube-backend.vercel.app/)
* 🔗 Frontend Live: [https://cinetube-frontend-ten.vercel.app](https://cinetube-frontend-ten.vercel.app)

---

## 🧑‍💻 Tech Stack

* **Backend Framework:** Node.js + Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** Better Auth
* **Payment Integration:** Stripe
* **Deployment:** Vercel

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── interfaces/        # Type definitions
 │   ├── middleware/        # Auth & validation middleware
 │   ├── modules/           # Feature-based modules
 │   │   ├── admin/
 │   │   ├── movie/
 │   │   ├── payment/
 │   │   ├── purchase/
 │   │   ├── review/
 │   │   └── watchlist/
 │
 ├── enums/                 # Enum constants
 ├── types/                 # Global types
 ├── lib/                   # Prisma & auth utilities
 ├── utils/                 # Helper functions
 ├── app.ts                 # Express app config
 └── server.ts              # Entry point
```

---

## 🔐 Authentication

This project uses **Better Auth** for authentication and session management.

* Email/password authentication
* OAuth login (Google, GitHub)
* Secure session handling via Better Auth
* Cookie-based authentication (with credentials enabled in CORS)
* Role-based access control (User & Admin)

> Note: Traditional JWT implementation is not used here.

---

## 👥 User Roles

### 👤 User Features

* Register & Login
* Browse movies/series
* Rate (1–10) and review content
* Add spoiler tags & custom tags
* Like/unlike reviews
* Comment on reviews
* Add to watchlist
* Purchase or subscribe for premium content
* View purchase history

### 🛠️ Admin Features

* Manage movies/series (CRUD)
* Approve/unpublish reviews
* Remove inappropriate content
* View analytics (ratings, reviews, sales)

---

## 🎥 Core Modules

### 🎬 Movie Module

* Add, update, delete movies/series
* Includes metadata: title, genre, cast, release year, platform
* Pricing: free / premium
* Streaming link support (YouTube)

### ⭐ Review Module

* Create reviews with rating
* Admin approval system
* Like & comment system
* Spoiler toggle and tags

### 💳 Payment Module

* Stripe payment intent flow
* Webhook-based verification

### 🛒 Purchase Module

* Track user purchases
* Manage access control for paid content

### 📌 Watchlist Module

* Save and manage favorite movies/series

---

## 🔎 Features

* 🔍 Advanced Search & Filtering
* 📊 Admin Dashboard Analytics
* ❤️ Like & Comment System
* 🧾 Purchase & Subscription Handling
* 📱 Fully RESTful API design

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Arpan-Dey-Web/Cinetube-backend.git
cd cinetube-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=your_postgresql_database_url

FRONTEND_URL=http://localhost:3000

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

⚠️ Never commit real secrets to GitHub.

---

### 4️⃣ Run database migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Start the development server

```bash
npm run dev
```

---

## 📬 API Endpoints (Detailed)

### 🔐 Auth (Better Auth)

* `ALL /api/auth/*`

---

### 🎬 Movie Routes (`/api/movie`)

* `GET /`
* `GET /:id`
* `POST /create-movie` (**Admin**)
* `PUT /update-movie/:id` (**Admin**)
* `DELETE /:id` (**Admin**)

---

### ⭐ Review Routes (`/api/review`)

* `GET /:movieId`
* `POST /`
* `PATCH /my-review/:id`
* `DELETE /my-review/:id`
* `POST /like/:id`
* `PATCH /moderate/:id`

---

### 💳 Payment Routes (`/api/payment`)

* `POST /create-intent`
* `POST /webhook`

---

### 📌 Watchlist Routes (`/api/watchlist`)

* `GET /`
* `POST /toggle`

---

### 🛒 Purchase Routes (`/api/purchase`)

* `GET /my-purchases`
* `GET /check-access/:movieId`
* `POST /create`

---

### 🛠️ Admin Routes (`/api/admin`)

* `GET /dashboard-stats`

---

### 🌐 Root Route

```json
{
  "success": true,
  "message": "Movie Server Is Running"
}
```

---

## ⚙️ Express App Configuration Highlights

* Custom query parser (`qs`)
* Cookie parser enabled
* Credential-based CORS
* Stripe webhook with raw body

---

## 🧪 Testing Admin & User Access

User Email      : user@cinetube.com
User Password   : @User-123

Admin Email     : admin@cinetube.com
Admin Password  : @Admin-123

---

## 📦 Deployment

* Vercel deployment
* Environment variables configured
* PostgreSQL connected via Prisma

---

## 🎥 Demo Video

📺 [https://drive.google.com/file/d/1GJ6Y_Mi8WuRMPp-8f7fKNYM8-RWrB_r0/view](https://drive.google.com/file/d/1GJ6Y_Mi8WuRMPp-8f7fKNYM8-RWrB_r0/view)

---

## ✨ Author

**Arpan Dey**

* GitHub: [https://github.com/Arpan-Dey-Web](https://github.com/Arpan-Dey-Web)
* Portfolio: [https://arpandeyweb.vercel.app](https://arpandeyweb.vercel.app)

---

## 💡 Final Notes

Clean, modular backend using real-world architecture patterns. Suitable for production-level MERN applications and backend-focused roles.

---

## 🧩 Architecture Highlights

* **Modular (feature-first) architecture** with clear separation of concerns (controller → service → validation → router)
* **Middleware pipeline** for auth, validation, and error handling
* **Prisma ORM layer** for type-safe database access
* **Webhook-first payment confirmation** (Stripe) to avoid client-side trust issues

---

## 🧪 Sample Requests

### Create Movie (Admin)

```http
POST /api/movie/create-movie
Content-Type: application/json
```

```json
{
  "title": "Inception",
  "genre": ["Sci-Fi", "Action"],
  "releaseYear": 2010,
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio"],
  "priceType": "premium",
  "streamingLink": "https://youtube.com/..."
}
```

---

### Create Review (User)

```http
POST /api/review
```

```json
{
  "movieId": "movie_id_here",
  "rating": 9,
  "review": "Amazing storyline and visuals",
  "spoiler": false,
  "tags": ["mind-bending"]
}
```

---

## 🗃️ Prisma (Conceptual Model)

> Simplified representation of core entities

* **User** → id, email, role
* **Movie** → id, title, genre, priceType
* **Review** → id, userId, movieId, rating, approved
* **Purchase** → id, userId, movieId, access
* **Watchlist** → id, userId, movieId

---

## ⚠️ Error Handling Strategy

* Centralized async handler (`catchAsync`)
* Standard API response format via `sendResponse`
* Validation errors handled via request schema middleware

```json
{
  "success": false,
  "message": "Validation Error",
  "error": {}
}
```

---

## 📜 NPM Scripts

```bash
npm run dev      # Run development server
npm run build    # Build project (tsup)
npm start        # Run production build
```

---

## 📈 Why This Project Stands Out

* Real-world **payment integration (Stripe)**
* Secure **role-based authorization system**
* Clean **scalable backend architecture**
* Production-ready patterns (webhooks, modular routing, validation)

---
