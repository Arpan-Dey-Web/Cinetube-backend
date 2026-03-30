```
cinetube-Backend/
├── prisma/                  # Database schema and migrations
├── .vercel/
├── node_modules/
├── dist/
├── scripts/                 
├── src/
│   ├── app/
│   │   ├── interfaces/
│   │            ├── index.d.ts     
│   │   ├── middleware
│   │   │        ├── auth.ts
│   │   │        └── validateRequest.ts     
│   │   └── modules/         
│   │        ├── admin/      
│   │        │    ├── admin.controller.ts
│   │        │    └── admin.router.ts
│   │        │    └── admin.service.ts
│   │        └── movie/      
│   │        │     ├── movie.controller.ts
│   │        │     ├── movie.router.ts
│   │        │     └── movie.service.ts 
│   │        │     └── movie.validation.ts
│   │        ├── payment/      
│   │        │    ├── payment.controller.ts
│   │        │    └── payment.router.ts
│   │        │    └── payment.service.ts
│   │        │    └── payment.webhook.ts
│   │        └── purchase/      
│   │        │     ├── purchase.controller.ts
│   │        │     ├── purchase.router.ts
│   │        │     └── purchase.service.ts 
│   │        │     └── purchase.validation.ts
│   │        └── review/      
│   │        │     ├── review.controller.ts
│   │        │     ├── review.router.ts
│   │        │     └── review.service.ts 
│   │        │     └── review.validation.ts
│   │        │     └── review.utilis.ts 
│   │        └── watchlist/      
│   │              ├── watchlist.controller.ts
│   │              ├── watchlist.router.ts
│   │              └── watchlist.service.ts 
│   │              └── watchlist.validation.ts
│   │        
│   ├── generated/
│   ├── enums/
│   │     └── enums.ts
│   ├── types/
│   │     └── types.ts              
│   ├── lib/
│   │     ├── auth.ts
│   │     └── prisma.ts
│   ├── utils/
│   │     ├── catchAsync.ts
│   │     └── sendResponse.ts
│   │          
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Entry point (port listening)
├── .env                     # Secrets
├── package.json             # Dependencies
├── tsconfig.json            # TS compiler rules
├── tsup.config.ts           # Build configuration
├── readme.md            
├── .gitignore            
└── vercel.json             

```



```
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
```


```

1. The "Streaming Link" Security (Critical)
The Requirement: "View purchase history and streaming links."
The Current Gap: Your MovieController.getMovieById currently returns the streamingUrl to everyone.
The Fix: You need to redact (hide) this URL if the movie is PREMIUM and the user hasn't bought it.

Update your getMovieById in movie.controller.ts:

TypeScript
const getMovieById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user; // From auth middleware

  const movie = await MovieService.getSingleMovieFromDB(id);
  if (!movie) throw new Error("Movie not found");

  // Logic: Only show link if FREE, or user is ADMIN, or user has PURCHASED
  let canStream = false;
  if (movie.status === "FREE" || user?.role === "ADMIN") {
    canStream = true;
  } else if (user?.id) {
    const access = await PurchaseService.checkMovieAccess(user.id, user.role, id);
    canStream = access;
  }

  const data = {
    ...movie,
    streamingUrl: canStream ? movie.streamingUrl : null, // REDACTED if no access
    hasAccess: canStream
  };

  sendResponse(res, { httpStatusCode: 200, success: true, message: "Details fetched", data });
});
2. Like/Unlike Tracking
The Requirement: "One like per user per review."
The Current Gap: Your schema uses a simple Int for likes. This allows a user to spam the "Like" button or like multiple times.
The Fix: 1. Update Schema: Add a ReviewLike model (as we discussed earlier) with @@unique([userId, reviewId]).
2. Update Service: Create a toggleLike service that adds/removes a record in that table.

3. Review Edit/Delete Constraints
The Requirement: "Users can edit/delete their own reviews (if unpublished)."
The Current Gap: You don't have a check to prevent users from changing a review once an Admin has already approved/published it.
The Fix: In your review.service.ts (when you add the update/delete methods), add this guard:

TypeScript
const review = await prisma.review.findUnique({ where: { id: reviewId } });
if (review?.isApproved) {
  throw new Error("Published reviews cannot be edited. Please contact support.");
}
4. Admin Dashboard "Most Reviewed" Logic
The Requirement: "View aggregated ratings and reports (e.g., most-reviewed titles)."
The Current Gap: Your AdminService currently counts all reviews.
The Fix: You should distinguish between Total Reviews and Pending Reviews. Admins specifically need to see a list of "Pending Reviews" so they can approve them.

Add this to AdminService:

TypeScript
const pendingReviews = await prisma.review.findMany({
  where: { isApproved: false },
  include: { movie: { select: { title: true } }, user: { select: { name: true } } },
  take: 10
});
5. Global Error Handling (The "Safety Net")
The Requirement: "Maintainability... clean code."
The Current Gap: I haven't seen your globalErrorHandler.ts yet.
The Fix: Make sure your error handler specifically catches Prisma Unique Constraint errors (P2002). If a user tries to add a movie to their watchlist twice, Prisma will throw a P2002 error. Your global handler should turn that into a nice message like "This movie is already in your watchlist" instead of a "500 Internal Server Error."

📋 Your Final "To-Do" Checklist
[ ] Uncomment/Implement the Streaming Link redaction in MovieController.

[ ] Add ReviewLike model to schema.prisma and run npx prisma migrate dev.

[ ] Add Delete/Update routes for Reviews with the isApproved check.

[ ] Create a "Search/Filter" for the Admin to see Unpublished movies (Drafts).

[ ] Finalize the README.md with the API endpoint list.

Would you like me to help you write the code for the "Review Like/Unlike" toggle logic specifically? It’s the trickiest relationship left.
```