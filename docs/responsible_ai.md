# Responsible AI Considerations

**Fairness.** Rules are sourced per-city rather than assumed uniform,
so guidance stays accurate for both large metros and smaller towns
with different collection systems.

**Transparency.** Every answer names the specific rule/source it
relied on (see the "SOURCE:" line in each result card), so users can
see *why*, not just *what*.

**Ethics.** When no rule matches an item, the assistant says so
explicitly instead of guessing — see the "no match found" path in
`assets/app.js`. A production system should treat this as a hard
requirement: never let the model fabricate a disposal instruction
that wasn't grounded in a retrieved source.

**Privacy.** The prototype collects no personal or location-tracking
data — only a city name the user selects from a dropdown. A
production version handling resident-level data (e.g. per-household
compliance tracking for the officer dashboard) would need an explicit
consent and data-retention policy, which is out of scope for this
prototype.

## Known limitations of this prototype

- The "AI" step is a deterministic keyword-matched lookup, not a real
  LLM call — this was a deliberate choice so the demo runs without an
  API key. `prompts/system_prompt.md` documents exactly how it would
  be swapped for a real IBM Granite call.
- The knowledge base (`assets/rules.js`) covers a small, illustrative
  set of items, not a full municipal rulebook.
- The dashboard (`dashboard.html`) uses mock data, not real
  measurements from any deployment.
