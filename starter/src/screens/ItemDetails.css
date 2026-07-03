// src/screens/ItemDetailScreen.tsx
import type { Item } from "../data/types";
import "./ItemDetailScreen.css";

interface ItemDetailScreenProps {
  items: Item[];
  itemId: string;
  onBack: () => void;
  onBook: (itemId: string) => void;
}

function formatPrice(item: Item): string {
  if (item.price === null) return "Free";
  const amount = (item.price.amountCents / 100).toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  });
  return `${amount} / ${item.price.period}`;
}

function formatRating(owner: Item["owner"]): string {
  if (owner.rating === null) return "No ratings yet";
  return `${owner.rating.toFixed(1)} ★ (${owner.ratingCount} review${owner.ratingCount === 1 ? "" : "s"})`;
}

function formatDistance(distanceKm: number | null): string | null {
  if (distanceKm === null) return null;
  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m away`
    : `${distanceKm.toFixed(1)} km away`;
}

export function ItemDetailScreen({ items, itemId, onBack, onBook }: ItemDetailScreenProps) {
  const item = items.find((i) => i.id === itemId);

  // Defensive: item could theoretically be missing (bad link, stale id).
  // We don't control how this screen gets reached in the future, so
  // handle it rather than assume it can't happen.
  if (!item) {
    return (
      <main className="detail detail--missing">
        <button className="detail__back" onClick={onBack}>
          ← Back
        </button>
        <p>This item couldn't be found. It may have been removed.</p>
      </main>
    );
  }

  const isBookable = item.status === "available";
  const distanceLabel = formatDistance(item.distanceKm);

  return (
    <main className="detail">
      <button className="detail__back" onClick={onBack}>
        ← Back
      </button>

      {item.photoUrls.length > 0 ? (
        <div className="detail__gallery">
          {item.photoUrls.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`${item.title} photo ${i + 1}`}
              className="detail__photo"
            />
          ))}
        </div>
      ) : (
        <div className="detail__photo detail__photo--placeholder" role="img" aria-label="No photo available">
          No photo yet
        </div>
      )}

      <div className="detail__body">
        <div className="detail__heading">
          <h1 className="detail__title">{item.title}</h1>
          <span className="detail__price">{formatPrice(item)}</span>
        </div>

        {item.status === "paused" && (
          <p className="detail__notice" role="status">
            This item is temporarily unavailable — the owner has paused it.
          </p>
        )}

        {distanceLabel && <p className="detail__distance">{distanceLabel}</p>}

        <p className="detail__description">{item.description}</p>

        <section className="detail__owner" aria-label="Owner details">
          <h2 className="detail__owner-heading">Owner</h2>
          <p className="detail__owner-name">{item.owner.displayName}</p>
          <p className="detail__owner-rating">{formatRating(item.owner)}</p>
        </section>

        <button
          className="detail__book"
          onClick={() => onBook(item.id)}
          disabled={!isBookable}
          aria-disabled={!isBookable}
        >
          {isBookable ? "Book now" : "Currently unavailable"}
        </button>
      </div>
    </main>
  );
}