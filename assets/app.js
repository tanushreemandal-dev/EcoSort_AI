/**
 * app.js
 * ---------------------------------------------------------------------
 * Drives the chat UI in index.html.
 *
 * Pipeline (mirrors the RAG design in /prompts/system_prompt.md):
 *   1. User Input      -> read free text from the input box
 *   2. Retrieval       -> retrieveRule() looks up the matching municipal
 *                          rule from the knowledge base (rules.js)
 *   3. Grounded Answer  -> buildResponseCard() turns the retrieved rule
 *                          into the same structured reply an LLM call
 *                          would produce when given that rule as context
 *
 * Step 3 is templated here instead of calling an LLM so the demo needs
 * no API key and runs fully offline. In production, this function would
 * be replaced by a fetch() call to the IBM Granite model using the
 * prompt template in /prompts/system_prompt.md, with `retrieved_context`
 * filled from step 2.
 * ---------------------------------------------------------------------
 */

const chatWindow = document.getElementById("chatWindow");
const inputField = document.getElementById("inputField");
const sendBtn = document.getElementById("sendBtn");
const citySelect = document.getElementById("citySelect");

function addUserBubble(text) {
  const row = document.createElement("div");
  row.className = "row user";
  row.innerHTML = `<div class="bubble user"></div>`;
  row.firstChild.textContent = text;
  chatWindow.appendChild(row);
}

function addAiText(text) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <div class="bubble ai">
      <div class="ai-label">ECOSORT AI</div>
      <div class="ai-text"></div>
    </div>`;
  row.querySelector(".ai-text").textContent = text;
  chatWindow.appendChild(row);
}

function addResultCard(rule) {
  const row = document.createElement("div");
  row.className = "row";

  const tagClass = rule ? rule.category : "unknown";
  const tagLabel = rule
    ? { dry: "DRY WASTE ♻", wet: "WET WASTE 🍃", hazard: "HAZARDOUS ⚠" }[rule.category]
    : "NO MATCH FOUND";

  const title = rule ? rule.title : "Item not in knowledge base";
  const instruction = rule
    ? rule.instruction
    : "This prototype's knowledge base doesn't have a rule for that item yet. In production, the retriever would fall back to a broader search or ask a clarifying question instead of guessing — the assistant should never invent a disposal instruction it isn't grounded on.";
  const source = rule ? rule.source : null;

  const card = document.createElement("div");
  card.className = "result-card";
  card.innerHTML = `
    <div class="result-tag ${tagClass}">${tagLabel}</div>
    <div class="result-title"></div>
    <div class="result-text"></div>
    ${source ? '<div class="result-source"></div>' : ""}
  `;
  card.querySelector(".result-title").textContent = title;
  card.querySelector(".result-text").textContent = instruction;
  if (source) card.querySelector(".result-source").textContent = "SOURCE: " + source;

  row.appendChild(card);
  chatWindow.appendChild(row);
}

function handleUserQuery(text) {
  if (!text.trim()) return;

  addUserBubble(text);
  inputField.value = "";
  scrollToBottom();

  // Step 2: retrieval
  const rule = retrieveRule(text);

  // Small delay to simulate the retrieval + generation round trip
  setTimeout(() => {
    if (rule) {
      addAiText(`Checked ${citySelect.value}'s waste rules for you:`);
    } else {
      addAiText(`I searched ${citySelect.value}'s waste rules but couldn't find a confident match.`);
    }
    addResultCard(rule);
    scrollToBottom();
  }, 450);
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener("click", () => handleUserQuery(inputField.value));
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserQuery(inputField.value);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => handleUserQuery(chip.dataset.query));
});

// Seed the conversation with one example so the page isn't empty on load
window.addEventListener("DOMContentLoaded", () => {
  addAiText(
    "Hi! I'm EcoSort AI. Type or tap an item below and I'll tell you how to dispose of it correctly."
  );
});
