# AI Usage Log

## AI moment 1

- What I was trying to do: Get a working item detail screen quickly, matching my existing project's patterns (no router, plain CSS, local screen-switching in `App.tsx`).
- The prompt I wrote: Asked it to build the item detail screen, but before writing any code it asked me for my item type, my routing setup, my mock data file, and my styling approach — rather than assuming.
- What the AI gave back: A component and matching CSS file built against my actual `Item` type and my actual `App.tsx` navigation pattern (a `Screen` discriminated union with `useState`), not a generic React Router example.
- What was wrong / weak / risky about it: Nothing wrong in that first pass, but I want to flag why it went well here rather than take it for granted: it explicitly refused to guess my routing setup and asked instead. A confidently-wrong version of this same request would have assumed `react-router-dom`, produced a `useParams()`-based component, and I'd have had a broken import and a routing library I never installed. The value here was as much in what it didn't assume as in what it wrote.
- What I changed and why: I didn't need to change the output itself, but I did rename files afterward (`ItemDetailScreen.tsx` → `ItemDetails.tsx`) without going back to update the component's internal export name in the same pass — which is on me, not the AI, but it's exactly the kind of drift a solo sprint produces if you're not disciplined about touching every reference when you rename something.

## AI moment 2

- What I was trying to do:Build the auth screen per the brief, which explicitly told me this was a "trap" section I needed to read carefully before building anything.
- The prompt I wrote: Asked it to move to the auth screen next, having already flagged (myself, from reading the brief) that Thabo's request to force signup before browsing was a dark pattern worth pushing back on.
- What the AI gave back: It didn't build the literal brief — no forced wall on app load. It gated the `AuthScreen` behind the "Book Now" action specifically, with a `reason` prop explaining to the user why they're being asked, and wired `App.tsx` so Browse and Detail stay fully open.
- What was wrong / weak / risky about it: The generated `AuthUser.id` is created client-side with `` `usr_${Date.now()}` ``. That's a real problem if taken at face value: `Date.now()` has millisecond resolution, so two rapid signups (or the same user double-clicking submit) can produce colliding or non-unique IDs, and a client is never a trustworthy place to mint an identity anyway — a real backend must own that. This is exactly the kind of thing that looks fine in a demo and is quietly wrong in production. I caught it on review, not because the code looked broken (it runs perfectly), but because "who is allowed to assign a user's ID" is a basic auth-security question I checked deliberately.
- What I changed and why: I didn't rewrite it, because there's no real backend in this sprint to hand ID assignment to — but I documented it explicitly as a known limitation in the Decision Log and flagged it here rather than let a plausible-looking fake ID pass as if it were production-ready. If this sprint had a backend, real ID assignment would happen server-side on account creation, never client-side.

## AI moment 3

- What I was trying to do: Decide what to do about the mock item photos, which use Lorem Picsum seeded URLs that don't visually match the items they're attached to (a random stock photo assigned to "drill," not an actual photo of a drill).
- The prompt I wrote: Said I wanted to fix this by sourcing better-matching photos so the app "looks really professional," 
- What the AI gave back: It started pulling actual image search results to find real matching photos rather than just asserting URLs from memory.
- What was wrong / weak / risky about it: This was the right instinct to verify rather than fabricate, but I stopped it here because on reflection the deeper issue isn't which specific photos to use — it's that hand-picking convincing-looking mock photos risks making placeholder data look more finished and "real" than the product actually is at this stage. A photo-accurate-looking mock is a small, easy-to-miss form of the same problem as the fake urgency counter: something that looks more real than it is.
- What I changed and why: I chose not to pursue photo-matching further and instead documented the placeholder photos as an explicitly-labelled limitation in FOUNDER-RESPONSE.md, tied to the fact that real item photos are an owner-upload feature requiring backend work, not a frontend styling problem. This was my call to make, not something the AI got wrong, but it's the clearest example in this sprint of stepping back from "make the AI's output more convincing" toward "is convincing actually the right goal here."


