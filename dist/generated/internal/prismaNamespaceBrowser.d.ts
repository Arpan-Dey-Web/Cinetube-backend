import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Movie: "Movie";
    readonly Review: "Review";
    readonly ReviewLike: "ReviewLike";
    readonly Watchlist: "Watchlist";
    readonly Purchase: "Purchase";
    readonly Subscription: "Subscription";
    readonly Session: "Session";
    readonly Account: "Account";
    readonly Verification: "Verification";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly phone: "phone";
    readonly address: "address";
    readonly role: "role";
    readonly emailVerified: "emailVerified";
    readonly isBlocked: "isBlocked";
    readonly image: "image";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const MovieScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly director: "director";
    readonly cast: "cast";
    readonly year: "year";
    readonly duration: "duration";
    readonly rating: "rating";
    readonly genres: "genres";
    readonly posterUrl: "posterUrl";
    readonly backdropUrl: "backdropUrl";
    readonly trailerUrl: "trailerUrl";
    readonly streamingUrl: "streamingUrl";
    readonly platform: "platform";
    readonly price: "price";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly isPublished: "isPublished";
    readonly isTrending: "isTrending";
};
export type MovieScalarFieldEnum = (typeof MovieScalarFieldEnum)[keyof typeof MovieScalarFieldEnum];
export declare const ReviewScalarFieldEnum: {
    readonly id: "id";
    readonly rating: "rating";
    readonly comment: "comment";
    readonly tags: "tags";
    readonly isSpoiler: "isSpoiler";
    readonly isApproved: "isApproved";
    readonly likes: "likes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly userId: "userId";
    readonly movieId: "movieId";
    readonly parentId: "parentId";
};
export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum];
export declare const ReviewLikeScalarFieldEnum: {
    readonly id: "id";
    readonly reviewId: "reviewId";
    readonly userId: "userId";
};
export type ReviewLikeScalarFieldEnum = (typeof ReviewLikeScalarFieldEnum)[keyof typeof ReviewLikeScalarFieldEnum];
export declare const WatchlistScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly movieId: "movieId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type WatchlistScalarFieldEnum = (typeof WatchlistScalarFieldEnum)[keyof typeof WatchlistScalarFieldEnum];
export declare const PurchaseScalarFieldEnum: {
    readonly id: "id";
    readonly transactionId: "transactionId";
    readonly paymentStatus: "paymentStatus";
    readonly userId: "userId";
    readonly movieId: "movieId";
    readonly amount: "amount";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PurchaseScalarFieldEnum = (typeof PurchaseScalarFieldEnum)[keyof typeof PurchaseScalarFieldEnum];
export declare const SubscriptionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly status: "status";
    readonly plan: "plan";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly stripeCustomerId: "stripeCustomerId";
    readonly stripeSubscriptionId: "stripeSubscriptionId";
};
export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly expiresAt: "expiresAt";
    readonly token: "token";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly userId: "userId";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly accountId: "accountId";
    readonly providerId: "providerId";
    readonly userId: "userId";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly idToken: "idToken";
    readonly accessTokenExpiresAt: "accessTokenExpiresAt";
    readonly refreshTokenExpiresAt: "refreshTokenExpiresAt";
    readonly scope: "scope";
    readonly password: "password";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const VerificationScalarFieldEnum: {
    readonly id: "id";
    readonly identifier: "identifier";
    readonly value: "value";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map