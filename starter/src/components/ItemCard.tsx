import type { Item } from "../data/types";
import "./ItemCard.css";
import { formatPrice, formatDistance } from "../utils/format";

function CategoryIcon({ category }: { category: Item["category"] }) {
  return <span className={`item-card__category-icon item-card__category-icon--${category}`} />;
}

export function ItemCard({ item, onSelect }: { item: Item; onSelect: (id: string) => void }) {
  return (
    <button className="item-card" onClick={() => onSelect(item.id)}>
      <div className="item-card__hole" />

      <div className="item-card__visual">
        <CategoryIcon category={item.category} />
        {item.status === "paused" && <span className="item-card__badge">Paused</span>}
      </div>

      <span className="item-card__category">{item.category.replace("-", " ")}</span>
      <h3 className="item-card__title">{item.title}</h3>

      <div className="item-card__meta">
        <span>{formatDistance(item.distanceKm)}</span>
        <span className={item.price === null ? "item-card__price--free" : "item-card__price--paid"}>
          {formatPrice(item.price)}
        </span>
      </div>
    </button>
  );
}