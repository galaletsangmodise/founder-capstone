import type { Item } from "../data/types";
import "./ItemCard.css";

interface ItemCardProps {
  item: Item;
  onSelect: (id: string) => void;
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
        <span>{item.distanceKm.toFixed(1)} km away</span>
        <span
          className={
            item.priceType === "free"
              ? "item-card__price--free"
              : "item-card__price--paid"
          }
        >
          {item.priceType === "free" ? "FREE" : `R${item.pricePerDay}/day`}
        </span>
      </div>
    </button>
  );
}