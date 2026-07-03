// src/screens/BrowseScreen.tsx
import { useMemo, useState } from "react";
import type { Category, Item } from "../data/types";
import { ItemCard } from "../components/ItemCard";
import "./BrowseScreen.css";

interface BrowseScreenProps {
  items: Item[];
  onSelectItem: (id: string) => void;
}

type PriceFilter = "all" | "free" | "paid";
type CategoryFilter = "all" | Category;

const MAX_DISTANCE_KM = 15;

export function BrowseScreen({ items, onSelectItem }: BrowseScreenProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [maxDistance, setMaxDistance] = useState(MAX_DISTANCE_KM);

  const visible = items.filter((item) => item.status !== "removed");

  const filtered = useMemo(() => {
    return visible.filter((item) => {
      const matchesQuery = item.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      const matchesCategory = category === "all" || item.category === category;

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && item.price === null) ||
        (priceFilter === "paid" && item.price !== null);

      // Unknown distance always passes — we can't exclude what we can't measure.
      const matchesDistance =
        item.distanceKm === null || item.distanceKm <= maxDistance;

      return matchesQuery && matchesCategory && matchesPrice && matchesDistance;
    });
  }, [visible, query, category, priceFilter, maxDistance]);

  return (
    <main className="browse">
      <h1 className="browse__title">Nearby items</h1>

      <div className="browse__filters">
        <input
          type="search"
          placeholder="Search items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search items"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          <option value="power-tools">Power tools</option>
          <option value="hand-tools">Hand tools</option>
          <option value="garden">Garden</option>
          <option value="kitchen">Kitchen</option>
          <option value="outdoor">Outdoor</option>
          <option value="party">Party</option>
          <option value="other">Other</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
          aria-label="Filter by price"
        >
          <option value="all">Free & paid</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
        </select>

        <label className="browse__distance">
          Within {maxDistance} km
          <input
            type="range"
            min={1}
            max={MAX_DISTANCE_KM}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            aria-label="Maximum distance in kilometres"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="browse__empty">No items match your filters.</p>
      ) : (
        <div className="browse__grid">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      )}
    </main>
  );
}