a5-prisma/
├── prisma/                  # Database schema and migrations
├── src/
│   ├── app/
│   │   ├── interfaces/      # Global TypeScript types (index.d.ts)
│   │   ├── middleware/      # Auth and validation logic
│   │   └── modules/         # <--- WHERE YOUR LOGIC GOES
│   │        ├── user/       # Mentor's User module
│   │        │    ├── user.controller.ts
│   │        │    └── user.router.ts
│   │        └── movie/      # <--- CREATE THIS FOR YOUR LOGIC
│   │             ├── movie.controller.ts
│   │             ├── movie.router.ts
│   │             └── movie.service.ts (Optional but recommended)
│   ├── generated/           # Likely Prisma client or Better Auth types
│   ├── lib/                 # Shared utilities (auth.ts, prisma.ts)
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Entry point (port listening)
├── .env                     # Secrets
├── package.json             # Dependencies
├── tsconfig.json            # TS compiler rules
└── tsup.config.ts           # Build configuration





1. The "Search & Filter" Engine
Your assignment requires filtering by genre, year, and rating. Currently, your getAllMoviesFromDB likely just returns everything. You need to implement a query builder.

Goal: Allow the frontend to call /api/movie?genres=Action&searchTerm=Inception&limit=10.

Implement Pagination (using skip and take in Prisma).

Implement Partial Search (using contains and mode: 'insensitive').

Return the meta data (total count, total pages) using that sendResponse utility you just built.

2. Role-Based Access Control (RBAC)
Right now, anyone with the URL can POST a movie or DELETE one. This is a huge security risk.

The Task: Create an auth middleware.

Logic: 1.  Verify the JWT token from the headers.
2.  Check if the user exists in the DB.
3.  Check if the user's role is ADMIN.

Implementation: movieRouter.post("/create-movie", auth("ADMIN"), MovieController.createMovie);

3. The Review & Rating System
This is a core requirement. A movie portal is nothing without user feedback.

The Task: Create a new module Review.

Logic: When a user submits a review, you must:

Save the review (marked as isApproved: false by default).

Recalculate the Movie's Average Rating: This is a professional touch. Every time a review is approved, update the rating field in the Movie table.

4. Validation with Zod
Don't trust the user's input. If a user sends a string where a number should be, Prisma might throw a cryptic error.

The Task: Create Zod schemas for createMovie and updateMovie.

Logic: Validate the req.body before it even reaches your controller.

5. Watchlist & Purchases (The "Portal" Logic)
Since your portal allows "Buying" or "Streaming," you need logic to connect Users to Movies.

Watchlist: A simple POST to add a movieId to a userId.

Purchases: Prepare the logic for Stripe/SSLCommerz. You’ll need a "Transaction" table to track successful payments before granting access to streamingUrl.