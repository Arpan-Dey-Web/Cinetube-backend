# 🎬 CineTube Backend – Movie & Series Rating & Streaming Portal API

A scalable and modular backend API for a **Movie and Series Rating & Streaming Portal**, built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**. This system supports user interactions such as reviews, ratings, purchases, and watchlists, along with robust admin management and analytics.

---

## 🚀 Live Links

* 🔗 Backend Live: *Add your deployed URL here*
* 🔗 Frontend Live: *Add your frontend URL here*

---

## 🧑‍💻 Tech Stack

* **Backend Framework:** Node.js + Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT
* **Payment Integration:** SSLCommerz / Stripe
* **Deployment:** Vercel / Render / Railway

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

> Note: Traditional JWT implementation is not used here; Better Auth manages authentication flows and sessions internally.

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

* Subscription-based payment system
* Integration with payment gateway
* Webhook handling for payment confirmation

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
git clone https://github.com/your-username/cinetube-backend.git
cd cinetube-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file and configure the following:

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

⚠️ **Security Note:** Never commit real secrets to GitHub. Always use environment variables and keep them private.

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

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

* `ALL /api/auth/*` → handled via Better Auth

### 🎬 Movie Routes

* `GET /api/movie` → Get all movies
* `POST /api/movie` → Create movie (Admin)
* `PATCH /api/movie/:id` → Update movie (Admin)
* `DELETE /api/movie/:id` → Delete movie (Admin)

### ⭐ Review Routes

* `POST /api/review` → Create review
* `GET /api/review` → Get all reviews
* `PATCH /api/review/:id` → Update review
* `DELETE /api/review/:id` → Delete review

### 💳 Payment Routes

* `POST /api/payment` → Create payment session
* `POST /api/payment/webhook` → Stripe webhook (raw body)

### 📌 Watchlist Routes

* `POST /api/watchlist` → Add to watchlist
* `GET /api/watchlist` → Get user watchlist
* `DELETE /api/watchlist/:id` → Remove item

### 🛒 Purchase Routes

* `POST /api/purchase` → Create purchase
* `GET /api/purchase` → Get purchase history

### 🛠️ Admin Routes

* `GET /api/admin` → Admin dashboard data
* Review moderation & analytics endpoints

---

## ⚙️ Express App Configuration Highlights

* Custom query parser using `qs`
* Secure CORS configuration with credentials support
* Cookie parsing enabled
* Stripe webhook uses **raw body parser** (important for signature verification)
* Modular route architecture

```ts
// Stripe webhook must be before express.json()
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Better Auth handler
app.all("/api/auth/*", toNodeHandler(auth));
```

---

## 🧪 Testing Admin Access

> Provide admin credentials here for testing:

Admin Email      : admin@cinetube.com
Admin Password   : admin123

```
Email: admin@example.com
Password: 123456
```

---

## 📦 Deployment

* Configure environment variables in hosting platform
* Use **Render / Railway / Vercel** for deployment
* Ensure database is properly connected

---

## 🎥 Demo Video

📺 *https://drive.google.com/file/d/1GJ6Y_Mi8WuRMPp-8f7fKNYM8-RWrB_r0/view?usp=sharing*

---

## 📄 License

This project is licensed for educational and portfolio purposes.

---

## ✨ Author

**Arpan Dey**

* GitHub: [https://github.com/Arpan-Dey-Web](https://github.com/Arpan-Dey-Web)
* Portfolio: [https://arpandeyweb.vercel.app](https://arpandeyweb.vercel.app)

---

## 💡 Final Notes

This project is built following **clean architecture principles**, modular structure, and scalable backend practices. It demonstrates real-world implementation of authentication, payment systems, and user interaction features.

> Feel free to fork, contribute, or use it as a reference for your own projects 🚀
