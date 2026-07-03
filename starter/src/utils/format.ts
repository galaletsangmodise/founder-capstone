/* ============================================================
 * Shared formatters for displaying item data.
 * Centralised here so ItemCard, ItemDetailPage, and anywhere
 * else that renders price/distance/rating stay consistent —
 * one place to fix formatting, not three.
 * ============================================================ */

import type { Item } from "../data/types";

/**
 * item.price is null for free items (per the mock data comment).
 * Anthropic's mock data stores amounts in cents, matching how a
 * real payments API (e.g. Stripe) would send them.
 */
export function formatPrice(price: Item["price"]): string {
  if (price === null) return "FREE";
  const rands = price.amountCents / 100;
  return `R${rands.toFixed(0)}/${price.period}`;
}

/**
 * distanceKm is null when the viewer hasn't shared their location.
 * Don't show "null km away" — say why it's missing instead.
 */
export function formatDistance(distanceKm: number | null): string {
  return distanceKm === null ? "Distance unknown" : `${distanceKm.toFixed(1)} km away`;
}

/**
 * owner.rating is null for brand-new lenders with no bookings yet.
 * Showing "0.0 stars" would be misleading (looks bad, isn't earned) —
 * "New lender" is honest and still communicates something useful.
 */
export function formatRating(owner: Item["owner"]): string {
  return owner.rating === null
    ? "New lender"
    : `★ ${owner.rating.toFixed(1)} (${owner.ratingCount})`;
}

/**
 * Only "available" items should ever be bookable. "paused" items are
 * temporarily off (owner's choice), "removed" items shouldn't even
 * be visible in the list — that filtering happens at the list level,
 * this just answers the bookable question for a single item.
 */
export function isBookable(status: Item["status"]): boolean {
  return status === "available";
}