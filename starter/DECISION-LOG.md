# Decision Log

At least 8 real entries. Generic entries score nothing. Use this shape:

# Decision Log

## Decision: Gate authentication behind the booking action, not behind browsing

- Context: Thabo's brief explicitly asked to force signup before users can see anything, to capture emails ("growth hack lol"). This is the single clearest trap in the brief a wall on page one, before anyone has seen a shred of value.
- Options I considered: (1) Build exactly what he asked — an auth wall on app load, before the browse screen renders. (2) Don't gate anything at all, and treat auth as fully optional/cosmetic. (3) Let people browse and view items freely, and only require an account at the moment they try to book.
- What I chose and why: Option 3. It gets Thabo the thing he actually wants — an email on file before a real commitment is made — without the cost of option 1, which is that most first-time visitors bounce before they've seen a single item and never convert at all. The account request also makes more sense to the user at that point, because they're already invested in a specific booking, so the ask feels earned instead of arbitrary.
- What I gave up: A slightly lower raw signup count than the aggressive wall would produce in the short term, and the ability to show "signed-up users" as a vanity metric to investors on day one. I judged that trade worth it because a wall that tanks first-visit engagement is a worse long-term number even if the top-line signup count looks better in a screenshot.

## Decision: No fabricated urgency or fake activity signals ("3 people are looking at this right now")

- Context: Thabo asked for a countdown-style urgency indicator on every item, explicitly because he'd seen it work elsewhere and wanted to "create urgency." He also asked for the app to "look busy" even with few real users, "so people trust it."
- Options I considered: (1) Build it as described — a fabricated or randomly-generated "N people viewing" counter with no real data behind it. (2) Build a version backed by real (mocked-as-if-real) data, e.g. a genuine "booked 3 times this month" stat drawn from the item's actual history. (3) Omit any activity/urgency signal entirely for this sprint.
- What I chose and why: Option 3 for this sprint, with option 2 flagged as the honest version to build later once there's a real events/bookings history to draw from. A number invented purely to create pressure, with nothing real behind it, is a manufactured trust signal — the exact opposite of the trust Thabo says he wants to build with early users. Correct, clean code implementing a fabricated urgency counter is still a bad decision; the brief is explicit that this scores worse than refusing.
- What I gave up: Whatever short-term conversion lift a fake urgency cue might produce. I judged that a founder whose early users discover the "3 people are looking at this" number is fabricated loses far more trust than he gains urgency — and that's a bad trade for a marketplace whose whole pitch is neighbourhood trust.

## Decision: Local discriminated-union state for screen navigation instead of React Router

- Context: The app needs to move between Browse, Item Detail, Auth, and Booking screens. The starter repo had no router installed, and `App.tsx` was already using a `useState`-based screen switch before I touched it.
- Options I considered: (1) Introduce `react-router-dom` and give each screen a real URL (`/items/:id`, `/book/:id`). (2) Keep and extend the existing pattern — a `Screen` discriminated union in `App.tsx`, switched with `useState`. (3) A custom hash-based router without a library, to get shareable URLs without adding a dependency.
- What I chose and why: Option 2. For a four-screen sprint, adding a routing library is real complexity (route config, layout nesting, 404 handling) for a benefit — shareable/bookmarkable URLs — that doesn't materially affect what's being assessed here. Extending the pattern already in the codebase also meant every screen's props stayed simple and fully typed (`Screen` is an exhaustive union TypeScript can check), rather than pulling `useParams()` values that are `string | undefined` by default and need re-validating.
- What I gave up: Deep-linking (you can't share a URL straight to one item), no working browser back/forward button, and the whole navigation layer will need a real rewrite the moment this app needs to be indexed, shared on social media, or handle more than a handful of screens. I've noted this explicitly as a known limitation rather than a hidden one.

## Decision: Booking flow is one self-contained multi-step component, not three separate top-level screens

- Context: The brief requires a booking flow of "at least two steps that ends in a clear confirmation." I needed to decide where the state for the in-progress booking (chosen dates, terms agreement) should live.
- Options I considered: (1) Make Dates, Review, and Confirmation three separate entries in the top-level `Screen` union in `App.tsx`, each with its own navigation case. (2) Keep booking as a single `BookingScreen` component with an internal `step` state (`"dates" | "review" | "confirmed"`), and only expose it to `App.tsx` as one screen.
- What I chose and why: Option 2. The in-progress booking data (selected dates, whether the user has agreed to terms) is only meaningful within the booking flow itself — nothing outside `BookingScreen` needs to read or react to it mid-flow. Keeping that state internal means `App.tsx` doesn't need to carry booking-draft data through its top-level state, and the booking flow can add or reorder internal steps later without touching the app's navigation type at all.
- What I gave up: If a later feature needed to interrupt the booking flow (e.g. a "resume your booking" push notification, or an abandoned-cart email trigger), that state currently isn't visible outside the component and would need to be lifted up or persisted. I judged that unlikely to matter in this sprint.

## Decision: `Item.price: null` renders as "Free," never as "R0"

- Context: The mock data models free-to-borrow items with `price: null` rather than a price object with `amountCents: 0`. Several UI surfaces (item card, detail screen, booking total) need to display a price.
- Options I considered: (1) Treat `null` the same as zero and just format it through the normal currency formatter, which would print "R0." (2) Write an explicit check for `null` and render the word "Free" instead. (3) Push the free/paid distinction into a separate boolean field on `Item` so the UI never has to branch on it.
- What I chose and why: Option 2. "R0" reads like a data error or a broken price feed to a real user — it invites the question "why does it cost nothing, is that a bug?" "Free" is an intentional, legible product state. I didn't take option 3 because the type already encodes free-vs-paid correctly (`Price | null`) — adding a redundant boolean would just create a second source of truth that could disagree with the price field.
- What I gave up: Every place a price is displayed now needs its own null check instead of always trusting a `Price` object exists. I accepted that as the honest cost of the type being accurate (some items really don't have a price), rather than hiding the null behind a fake default.

## Decision: Distance filter treats `distanceKm: null` as always passing, not as "0 km" or "excluded"

- Context: `distanceKm` is `null` when the viewer hasn't shared their location. The Browse screen has a "within N km" distance filter.
- Options I considered: (1) Treat `null` as `0`, which would make unknown-distance items always appear as if they're right next door — misleading. (2) Exclude any item with unknown distance from filtered results entirely, on the theory that we can't confirm it matches. (3) Always include unknown-distance items regardless of the distance filter setting, since we have no basis to exclude them.
- What I chose and why: Option 3. We cannot know whether an item three streets away or ten kilometres away is inside the filter radius if we have no distance for it at all — excluding it (option 2) penalises the item for a UI limitation (no location permission), not for actually being far away, and including it as "0km" (option 1) is simply false. Letting it through with an honest "distance unknown" label preserves the user's trust in the other numbers shown.
- What I gave up: The distance filter is not a hard guarantee — "within 5km" can technically show an item that's actually 40km away if its distance is unknown. I judged that more honest than either alternative, and it's a natural candidate for a "distance unknown, tap to allow location" prompt in a later sprint.

## Decision: Booking review step adds a return-condition agreement checkbox that Thabo never asked for

- Context: Thabo's brief for the booking flow was minimal — "pick your dates, confirm, done." Nothing in the brief addresses what happens if a borrowed item comes back damaged or late, which is the single most common failure mode for peer-to-peer lending platforms.
- Options I considered: (1) Build exactly the two steps described and nothing more. (2) Add a lightweight checkbox on the review step confirming the borrower agrees to return the item in the condition received. (3) Build a full dispute/deposit system, which is well beyond sprint scope.
- What I chose and why: Option 2. It's one checkbox and one line of copy — negligible build cost — but it's the first artifact of accountability between two strangers exchanging physical tools, which is the actual trust problem this whole product exists to solve. Leaving it out entirely (option 1) would mean shipping a literal reading of the brief that misses what "protect the founder from himself" is supposed to mean here — Thabo didn't think to ask for it, but it's cheap enough that it's worth adding rather than deferring.
- What I gave up: This is not a binding agreement or a real deposit/insurance mechanism — it's a soft nudge, and I was careful not to oversell it as more protection than it actually provides. A real dispute-resolution flow is listed as future work, not implied to already exist.

## Decision: Defensive handling for missing/paused items on Detail and Booking screens, even though Browse already filters them out

- Context: The Browse screen filters out items with `status: "removed"`, so in the current app a user can't currently reach a removed item's detail page through normal navigation. I still had to decide whether Detail and Booking should assume that guarantee holds.
- Options I considered: (1) Trust that if you can reach the Detail or Booking screen, the item is valid and available, and skip the check — simpler code, fewer branches. (2) Re-check item existence and status independently in each screen that needs it, and render an honest fallback state if the item is missing or unavailable.
- What I chose and why: Option 2. The moment real routing/deep-linking exists (a very likely near-term change, see the routing decision above), a stale or shared link could point directly at a removed or paused item without ever passing through the Browse screen's filter. Writing the guard now, while it's cheap, is far less risk than writing every future screen assuming an invariant that a different screen enforces elsewhere in the codebase.
- What I gave up: A small amount of extra code and a couple of early returns in each screen, for a scenario that can't currently be triggered through the UI. I judged that worth it because "trust that upstream filtered it" is exactly the kind of assumption that quietly breaks when a codebase grows past a single afternoon's work.

## Decision: Item photos use seeded stock placeholders and are explicitly labelled as such, rather than trying to source photo-accurate images for mock data

Decision: Ignore photoUrls entirely, always render category icons
Context: Mock data uses Picsum seeded URLs (e.g. seed/drill); seeds hash to arbitrary stock photos with no relation to the seed word — one rendered as an unrelated, inappropriate image for a "drill" listing.
Options: (1) Keep photoUrls, manually vet/replace each seed. (2) Ignore photoUrls, always use deterministic category icons.
Chose: (2) — the data source is fundamentally unreliable (seed ≠ content match), and this also cleanly handles items with empty photoUrls arrays with one code path instead of two.
Gave up: Visual variety per-item; every "power-tools" item looks the same. Acceptable since real user-uploaded photos will replace this once there's a backend