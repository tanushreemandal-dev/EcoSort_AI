# EcoSort AI 🧹

A smart AI assistant for household waste segregation & responsible
disposal - built for the **1M1B AI for Sustainability Virtual
Internship** (in collaboration with IBM SkillsBuild & AICTE).

> **SDG alignment:** SDG 11 (Sustainable Cities & Communities) ·
> SDG 12 (Responsible Consumption & Production)

## What this is

A resident-facing chat assistant that tells you how to dispose of a
household item correctly, plus a municipal officer's dashboard
concept for tracking ward-level segregation compliance.

This repo is a **prototype**, not a production system: the "AI"
classification step is implemented as a small, transparent
keyword-matched lookup against a local rules file
(`assets/rules.js`), which stands in for what would be a retrieval
step against a real vector database of municipal bylaws, followed by
a call to an LLM (IBM Granite) grounded on the retrieved rule. This
keeps the demo fully offline and runnable with zero setup, while
keeping the exact same retrieve → ground → answer architecture a real
deployment would use. See [`prompts/system_prompt.md`](prompts/system_prompt.md)
for the prompt template and the reasoning behind that architecture.

## Running it

**Option A - just double-click it**
Double-click `index.html` (or `dashboard.html`) in your file explorer
and it opens directly in your default browser.

**Option B - VS Code Live Server extension**
If you're using VS Code with the "Live Server" extension installed:
1. Click on `index.html` in the file explorer so it's the active tab
2. Right-click inside that tab → **"Open with Live Server"**
3. To switch pages, either click the nav links in the app itself, or
   change the file in the browser's address bar

**Option C - Python's built-in server (any OS, from a terminal)**
```bash
git clone <this-repo-url>
cd ecosort-ai
python3 -m http.server 8000
# then open http://localhost:8000/index.html in your browser
```

Try typing "pizza box", "milk carton", "old battery", or use the
quick-reply chips in the app. Use the "Officer view →" link in the
header to jump to the dashboard, and "← Back to chat" to return.

## Project structure

```
ecosort-ai/
├── index.html              # Resident chat assistant (functional prototype)
├── dashboard.html           # Municipal officer's ward dashboard (mock data)
├── assets/
│   ├── style.css             # Shared styling
│   ├── rules.js               # Knowledge base - simulates the RAG corpus
│   └── app.js                  # Chat logic - simulates retrieve → ground → answer
├── prompts/
│   └── system_prompt.md      # Prompt template for the Granite model call
└── docs/
    ├── problem_and_sdg.md    # Problem statement, SDG mapping, target users, impact
    └── responsible_ai.md      # Fairness / transparency / ethics / privacy notes
```

## How it works

1. **User input** — resident types or picks an item in `index.html`
2. **Retrieval** — `retrieveRule()` in `assets/rules.js` finds the
   matching municipal rule
3. **Grounded answer** — `assets/app.js` renders a structured reply
   (category badge, instruction, source citation) from that rule,
   exactly the shape an LLM call would return if given the same rule
   as context (see `prompts/system_prompt.md`)

## What would change for a production build

- Replace the keyword lookup in `assets/rules.js` with a real vector
  store (e.g. embeddings over each city's official waste bylaws) and
  an actual similarity-search retriever
- Replace the templated response in `assets/app.js` with a live API
  call to IBM Granite (or similar) using the prompt in
  `prompts/system_prompt.md`, passing the retrieved rule as context
- Add image classification so users can photograph an item instead of
  typing its name
- Wire `dashboard.html` to real aggregated query/compliance data
  instead of the current mock numbers
- Add consent and data-retention handling before collecting any
  resident- or location-level data

## Responsible AI

See [`docs/responsible_ai.md`](docs/responsible_ai.md) for how
fairness, transparency, ethics, and privacy were considered, and for
this prototype's known limitations.

## Author

Tanushree Mandal · Institute Of Engineering & Management, Kolkata

Built for the 1M1B AI for Sustainability Virtual Internship (IBM
SkillsBuild & AICTE)

## 🤝 Connect

Have questions, feedback, or ideas for collaboration? Feel free to reach out or open an issue on this repo!

- 💼 LinkedIn: [Tanushree Mandal](https://linkedin.com/in/tanushree-mandal-aba24b286)
- 📧 Email: [tanushreemandal235@gmail.com](tanushreemandal235@gmail.com)
