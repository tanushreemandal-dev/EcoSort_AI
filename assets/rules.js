/**
 * rules.js
 * ---------------------------------------------------------------------
 * This file is the "knowledge base" in the EcoSort AI RAG pipeline.
 *
 * In a production build, this would be a vector store / document index
 * containing each city's municipal solid-waste bylaws, and the
 * retriever would run a similarity search against it before handing
 * the matched clause to an LLM (e.g. IBM Granite) as grounding context.
 *
 * For this prototype, the same idea is implemented as a small,
 * transparent, keyword-matched lookup table so the demo runs entirely
 * client-side with no API key and no backend. Swapping this file for a
 * real vector-search call is the only change needed to move from
 * "rule-based prototype" to "LLM-grounded production system" — the
 * retrieval -> grounded-generation flow in app.js stays the same.
 * ---------------------------------------------------------------------
 */

const WASTE_RULES = [
  {
    keywords: ["pizza box", "pizza", "cardboard box"],
    category: "dry",
    title: "Cardboard pizza box",
    instruction:
      "Tear off any grease-stained sections and bin those as wet waste. The clean cardboard is recyclable — flatten it and put it out on your dry-waste collection day.",
    source: "Municipal Dry-Waste Guidelines, Sec. 4.2 (Soiled Paper & Cardboard)",
  },
  {
    keywords: ["milk carton", "tetra pak", "juice carton"],
    category: "dry",
    title: "Tetra Pak / milk carton",
    instruction:
      "Rinse it out and flatten it. Tetra Paks are multi-layer but accepted as dry/recyclable waste by most municipal collection centers.",
    source: "Municipal Dry-Waste Guidelines, Sec. 3.1 (Composite Packaging)",
  },
  {
    keywords: ["aluminium can", "aluminum can", "tin can", "soda can", "drink can", "beverage can"],
    category: "dry",
    title: "Aluminium / tin can",
    instruction:
      "Rinse out any leftover liquid and crush it flat if you can. Metal cans are 100% recyclable and accepted by all authorized dry-waste centers.",
    source: "Municipal Dry-Waste Guidelines, Sec. 2.4 (Metals)",
  },
  {
    keywords: ["banana peel", "vegetable peel", "fruit peel", "food scraps", "leftover food", "eggshell"],
    category: "wet",
    title: "Food scraps / peels",
    instruction:
      "This is wet/biodegradable waste. Put it in your wet-waste bin — it can be composted rather than sent to landfill.",
    source: "Municipal Wet-Waste Guidelines, Sec. 1.1 (Organic Kitchen Waste)",
  },
  {
    keywords: ["battery", "batteries"],
    category: "hazard",
    title: "Used battery",
    instruction:
      "Do not put this in household bins. Batteries are hazardous e-waste — drop them at a designated e-waste collection point or a battery take-back bin at electronics stores.",
    source: "Hazardous Waste (E-Waste) Handling Rules, Sec. 5.3",
  },
  {
    keywords: ["medicine", "expired medicine", "tablets", "pills"],
    category: "hazard",
    title: "Expired medicine",
    instruction:
      "Do not flush or bin with regular waste. Return expired medicines to a pharmacy take-back program or a designated hazardous-waste drop-off point.",
    source: "Hazardous Waste Handling Rules, Sec. 6.1 (Pharmaceutical Waste)",
  },
  {
    keywords: ["glass bottle", "glass jar"],
    category: "dry",
    title: "Glass bottle / jar",
    instruction:
      "Rinse it out. Glass is recyclable but should be bagged separately from other dry waste to prevent breakage injuries to waste workers.",
    source: "Municipal Dry-Waste Guidelines, Sec. 2.2 (Glass)",
  },
  {
    keywords: ["plastic bag", "polythene", "chip packet", "wrapper"],
    category: "dry",
    title: "Plastic wrapper / bag",
    instruction:
      "Most single-use plastic wrappers are low-value recyclables. Keep them clean and dry, and bundle them together rather than binning loose to help sorting at the recovery facility.",
    source: "Municipal Dry-Waste Guidelines, Sec. 3.4 (Flexible Plastics)",
  },
  {
    keywords: ["paint can", "paint tin", "thinner"],
    category: "hazard",
    title: "Paint can / solvent",
    instruction:
      "Never pour down the drain or bin with household waste. Seal the container and take it to a hazardous-waste collection drive or authorized facility.",
    source: "Hazardous Waste Handling Rules, Sec. 4.7 (Paints & Solvents)",
  },
];

/**
 * Very small "retriever": returns the best keyword match for a free-text
 * query, or null if nothing in the knowledge base matches closely enough.
 * A production retriever would use embedding similarity instead of
 * word-boundary matching.
 *
 * Matching uses \b word boundaries (not plain substring) so short,
 * common words like "can" don't false-match inside unrelated sentences
 * such as "Can I bin banana peels?". Among all matching rules, the
 * one with the longest matched keyword wins, so a more specific phrase
 * like "milk carton" is preferred over a shorter generic word.
 */
function retrieveRule(userInput) {
  const q = userInput.toLowerCase().trim();
  if (!q) return null;

  let best = null;
  let bestLen = 0;

  for (const rule of WASTE_RULES) {
    for (const keyword of rule.keywords) {
      const pattern = new RegExp("\\b" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "s?\\b", "i");
      if (pattern.test(q) && keyword.length > bestLen) {
        best = rule;
        bestLen = keyword.length;
      }
    }
  }
  return best;
}
