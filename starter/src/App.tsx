// src/App.tsx
import { useState } from "react";
import { ITEMS } from "./data/items.ts";
import { BrowseScreen } from "./screens/BrowseScreen.tsx/index.ts";

type Screen = { name: "browse" } | { name: "detail"; itemId: string };

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

  // Detail screen wired up next
  return (
    <main style={{ padding: 24 }}>
      <button onClick={() => setScreen({ name: "browse" })}>← Back</button>
      <p>Item detail screen coming next: {screen.itemId}</p>
    </main>
  );
}