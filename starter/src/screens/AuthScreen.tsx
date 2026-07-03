// src/screens/AuthScreen.tsx
import { useState, type FormEvent } from "react";
import type { AuthUser } from "../data/types";
import "./AuthScreen.css";

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
  onBack: () => void;
  /** Why we're asking — shown so the request feels earned, not arbitrary. */
  reason?: string;
}

type Mode = "signup" | "login";

function isValidEmail(value: string): boolean {
  // Deliberately simple — this is a client-side sanity check, not
  // real verification. A real API would own the source of truth.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function AuthScreen({ onAuthenticated, onBack, reason }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("signup");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs to be at least 8 characters.");
      return;
    }
    if (mode === "signup" && displayName.trim().length === 0) {
      setError("Tell us what to call you.");
      return;
    }

    // No backend yet — this stands in for a real signup/login call.
    // A real implementation must never fabricate an id/session client-side.
    const user: AuthUser = {
      id: `usr_${Date.now()}`,
      email,
      displayName: mode === "signup" ? displayName.trim() : email.split("@")[0],
    };

    onAuthenticated(user);
  }

  return (
    <main className="auth">
      <button className="auth__back" onClick={onBack}>
        ← Back
      </button>

      <h1 className="auth__title">{mode === "signup" ? "Create an account" : "Log in"}</h1>

      {reason && <p className="auth__reason">{reason}</p>}

      <div className="auth__toggle" role="tablist" aria-label="Choose sign up or log in">
        <button
          role="tab"
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "auth__toggle-btn auth__toggle-btn--active" : "auth__toggle-btn"}
          onClick={() => setMode("signup")}
          type="button"
        >
          Sign up
        </button>
        <button
          role="tab"
          aria-selected={mode === "login"}
          className={mode === "login" ? "auth__toggle-btn auth__toggle-btn--active" : "auth__toggle-btn"}
          onClick={() => setMode("login")}
          type="button"
        >
          Log in
        </button>
      </div>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {mode === "signup" && (
          <label className="auth__field">
            Name
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
            />
          </label>
        )}

        <label className="auth__field">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="auth__field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <button className="auth__submit" type="submit">
          {mode === "signup" ? "Create account" : "Log in"}
        </button>
      </form>
    </main>
  );
}