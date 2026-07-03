// src/screens/BookingScreen.tsx
import { useMemo, useState } from "react";
import type { AvailabilityRange, Item } from "../data/types";
import "./BookingScreen.css";

interface BookingScreenProps {
  items: Item[];
  itemId: string;
  onBack: () => void;
  onDone: () => void;
}

type Step = "dates" | "review" | "confirmed";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function nightsBetween(range: AvailabilityRange): number {
  const start = new Date(range.startISO);
  const end = new Date(range.endISO);
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function BookingScreen({ items, itemId, onBack, onDone }: BookingScreenProps) {
  const item = items.find((i) => i.id === itemId);

  const [step, setStep] = useState<Step>("dates");
  const [startISO, setStartISO] = useState("");
  const [endISO, setEndISO] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const min = todayISO();

  const nights = useMemo(() => {
    if (!startISO || !endISO) return 0;
    return nightsBetween({ startISO, endISO });
  }, [startISO, endISO]);

  const totalLabel = useMemo(() => {
    if (!item || item.price === null) return "Free";
    if (nights <= 0) return "—";
    const totalCents = item.price.amountCents * nights;
    return (totalCents / 100).toLocaleString("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    });
  }, [item, nights]);

  if (!item) {
    return (
      <main className="booking booking--missing">
        <button className="booking__back" onClick={onBack}>
          ← Back
        </button>
        <p>This item couldn't be found. It may have been removed.</p>
      </main>
    );
  }

  if (item.status !== "available") {
    return (
      <main className="booking booking--missing">
        <button className="booking__back" onClick={onBack}>
          ← Back
        </button>
        <p>{item.title} isn't available to book right now.</p>
      </main>
    );
  }

  function handleContinueFromDates() {
    setError(null);

    if (!startISO || !endISO) {
      setError("Pick a start and end date.");
      return;
    }
    if (endISO <= startISO) {
      setError("The end date must be after the start date.");
      return;
    }
    if (startISO < min) {
      setError("The start date can't be in the past.");
      return;
    }

    setStep("review");
  }

  function handleConfirmBooking() {
    if (!agreedToTerms) {
      setError("You need to agree to the borrowing terms to confirm.");
      return;
    }
    setError(null);
    setStep("confirmed");
  }

  return (
    <main className="booking">
      <button className="booking__back" onClick={onBack}>
        ← Back
      </button>

      <h1 className="booking__title">Book {item.title}</h1>

      <ol className="booking__steps" aria-label="Booking progress">
        <li aria-current={step === "dates" ? "step" : undefined}>1. Dates</li>
        <li aria-current={step === "review" ? "step" : undefined}>2. Review</li>
        <li aria-current={step === "confirmed" ? "step" : undefined}>3. Confirmed</li>
      </ol>

      {error && (
        <p className="booking__error" role="alert">
          {error}
        </p>
      )}

      {step === "dates" && (
        <section className="booking__section">
          <label className="booking__field">
            Start date
            <input
              type="date"
              value={startISO}
              min={min}
              onChange={(e) => setStartISO(e.target.value)}
            />
          </label>

          <label className="booking__field">
            End date
            <input
              type="date"
              value={endISO}
              min={startISO || min}
              onChange={(e) => setEndISO(e.target.value)}
            />
          </label>

          <button className="booking__primary" onClick={handleContinueFromDates}>
            Continue
          </button>
        </section>
      )}

      {step === "review" && (
        <section className="booking__section">
          <dl className="booking__summary">
            <div>
              <dt>Item</dt>
              <dd>{item.title}</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd>
                {formatDateLabel(startISO)} → {formatDateLabel(endISO)}
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>
                {nights} night{nights === 1 ? "" : "s"}
              </dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{totalLabel}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{item.owner.displayName}</dd>
            </div>
          </dl>

          <label className="booking__terms">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            I agree to return the item in the condition I received it, on the
            date agreed with the owner.
          </label>

          <div className="booking__actions">
            <button className="booking__secondary" onClick={() => setStep("dates")}>
              Back to dates
            </button>
            <button className="booking__primary" onClick={handleConfirmBooking}>
              Confirm booking
            </button>
          </div>
        </section>
      )}

      {step === "confirmed" && (
        <section className="booking__section booking__confirmation" role="status">
          <p className="booking__confirmation-icon" aria-hidden="true">
            ✓
          </p>
          <h2>Booking confirmed</h2>
          <p>
            You're set to borrow <strong>{item.title}</strong> from{" "}
            {formatDateLabel(startISO)} to {formatDateLabel(endISO)}.
          </p>
          <p className="booking__confirmation-note">
            {item.owner.displayName} will be in touch to arrange handover.
          </p>
          <button className="booking__primary" onClick={onDone}>
            Back to browsing
          </button>
        </section>
      )}
    </main>
  );
}