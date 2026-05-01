import type { SubscriptionStatus } from "../generated/enums";

type SubscriptionSnapshot =
  | {
      status: SubscriptionStatus;
      endDate: Date | null;
    }
  | null
  | undefined;

export const getMovieStatus = (price?: number | null): "FREE" | "PREMIUM" =>
  Number(price ?? 0) > 0 ? "PREMIUM" : "FREE";

export const hasActiveSubscription = (
  subscription: SubscriptionSnapshot,
  now = new Date(),
) => {
  if (!subscription || subscription.status !== "ACTIVE") {
    return false;
  }

  if (subscription.endDate && subscription.endDate <= now) {
    return false;
  }

  return true;
};

export const getContentStatus = (
  subscription: SubscriptionSnapshot,
  now = new Date(),
): "FREE" | "PREMIUM" =>
  hasActiveSubscription(subscription, now) ? "PREMIUM" : "FREE";

export const withMovieStatus = <T extends { price?: number | null }>(movie: T) => ({
  ...movie,
  status: getMovieStatus(movie.price),
});
