import type { Item } from "../data/types";
import "./ItemCard.css";

interface ItemCardProps {
  item: Item;
  onSelect: (id: string) => void;
}

function formatPrice(price: Item["price"]): string {
  if (price === null) return "FREE";
  const amount = (price.amountCents / 100).toFixed(2);
  const perUnit = { hour: "hr", day: "day", week: "wk" }[price.period];
  return `R${amount}/${perUnit}`;
}

export function ItemCard({ item, onSelect }: ItemCardProps) {
  return (
    <button className="item-card" onClick={() => onSelect(item.id)}>
      <div className="item-card__hole" />

      <span className="item-card__category">
        {item.category.replace("-", " ")}
      </span>

      <h3 className="item-card__title">{item.title}</h3>

      <div className="item-card__meta">
        <span>
          {item.distanceKm === null
            ? "Distance unknown"
            : `${item.distanceKm.toFixed(1)} km away`}
        </span>
        <span
          className={
            item.price === null
              ? "item-card__price--free"
              : "item-card__price--paid"
          }
        >
          {formatPrice(item.price)}
        </span>
      </div>
    </button>
  );
}