// src/App.tsx
import { useState } from "react";
import { ITEMS } from "./data/items.ts";
import type { AuthUser } from "./data/types";
import { BrowseScreen } from "./screens/BrowseScreen";
import { ItemDetails } from "./screens/ItemDetails";
import { BookingScreen } from "./screens/BookingScreen";
import { AuthScreen } from "./screens/AuthScreen";

type Screen =
  | { name: "browse" }
  | { name: "detail"; itemId: string }
  | { name: "auth"; itemId: string }
  | { name: "booking"; itemId: string };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "browse" });
  const [user, setUser] = useState<AuthUser | null>(null);

  function handleBookRequest(itemId: string) {
    // The only place auth is required — not on landing, not on browsing,
    // not on viewing a detail page. See FOUNDER-RESPONSE.md for why.
    if (user) {
      setScreen({ name: "booking", itemId });
    } else {
      setScreen({ name: "auth", itemId });
    }
  }

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
      <ItemDetails
        items={ITEMS}
        itemId={screen.itemId}
        onBack={() => setScreen({ name: "browse" })}
        onBook={handleBookRequest}
      />
    );
  }

  if (screen.name === "auth") {
    return (
      <AuthScreen
        reason="Sign up to confirm your booking — this is the only step that needs an account."
        onBack={() => setScreen({ name: "detail", itemId: screen.itemId })}
        onAuthenticated={(authedUser) => {
          setUser(authedUser);
          setScreen({ name: "booking", itemId: screen.itemId });
        }}
      />
    );
  }

  // screen.name === "booking"
  return (
    <BookingScreen
      items={ITEMS}
      itemId={screen.itemId}
      onBack={() => setScreen({ name: "detail", itemId: screen.itemId })}
      onDone={() => setScreen({ name: "browse" })}
    />
  );
}