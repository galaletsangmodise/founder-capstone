// src/App.tsx
import { useState } from "react";
import { ITEMS } from "./data/items.ts";
import { BrowseScreen } from "./screens/BrowseScreen";
import { ItemDetailScreen } from "./screens/ItemDetails";

type Screen =
  | { name: "browse" }
  | { name: "detail"; itemId: string }
  | { name: "booking"; itemId: string };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "browse" });

  if (screen.name === "browse") {
    return (
      <BrowseScreen
        items={ITEMS}
        onSelectItem={(itemId) => setScreen({ name: "detail", itemId })}
      />
    );
  }

  if (screen.name === "detail") {
    return (
      <ItemDetailScreen
        items={ITEMS}
        itemId={screen.itemId}
        onBack={() => setScreen({ name: "browse" })}
        onBook={(itemId) => setScreen({ name: "booking", itemId })}
      />
    );
  }

  // Booking flow wired up next
  return (
    <main style={{ padding: 24 }}>
      <button onClick={() => setScreen({ name: "detail", itemId: screen.itemId })}>
        ← Back
      </button>
      <p>Booking flow coming next: {screen.itemId}</p>
    </main>
  );
}