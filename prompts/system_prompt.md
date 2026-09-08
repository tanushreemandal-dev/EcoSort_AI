# System Prompt - EcoSort AI

This is the prompt template the assistant would send to an IBM Granite
(or similar) model in production, once retrieval (see
`assets/rules.js` / a real vector store) has found the relevant
municipal rule.

```
You are EcoSort AI, a waste-segregation assistant for Kolkata.

Using ONLY the retrieved municipal rule below, do the following:
1. Classify the user's item as Wet / Dry / Recyclable / Hazardous.
2. Give one short, practical disposal instruction in plain language.
3. If the retrieved rule does not clearly cover this item, say so
   honestly and suggest the user check with local municipal staff —
   never invent a plausible-sounding rule that wasn't retrieved.

Retrieved rule: {retrieved_context}
User item: {user_input}
```

## Why retrieval-then-generation (RAG) instead of asking the model directly

Municipal waste rules are hyper-local — a rule that's true in Bengaluru
may not hold in Mumbai or Delhi, and rules change over time. A model
asked to classify an item purely from its training data would be
guessing. Grounding every answer in a specific, retrieved municipal
clause means:

- The assistant can name **which rule** it used (transparency)
- It can honestly say "I don't know" instead of hallucinating when no
  rule matches (ethics)
- Updating the underlying rules doesn't require retraining anything —
  just updating the knowledge base

## Sample agent turn (worked example)

**User item:** "used pizza box"
**Retrieved rule:** *Municipal Dry-Waste Guidelines, Sec. 4.2 - Soiled Paper & Cardboard: grease-contaminated paper/cardboard is compostable; clean sections are recyclable dry waste.*
**Model output:**
> Only the clean part. Grease-stained sections count as wet waste — tear those off first. The rest is recyclable dry waste for your next dry-waste collection day.

This exact flow (retrieve → ground → answer) is implemented in
`assets/app.js` using a small local lookup table (`assets/rules.js`)
instead of a live vector database, so the prototype runs with no API
key. See the main `README.md` for what would change to make this
production-ready.
