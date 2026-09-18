import type { Opportunity } from "@/data/opportunities";

export type FitVerdict = "chase" | "consider" | "pass";

export interface FitResult {
  verdict: FitVerdict;
  score: number;
  reasons: string[];
  effortHours: number;
}

/**
 * Explainable triage. Every rule reads a field that is on the public posting, and every
 * reason is printed next to the verdict. Capacity, cash and bonding are unknown until
 * Discovery, so they are never scored: the result is a recommendation, not an oracle.
 */
export function scoreOpportunity(opp: Opportunity): FitResult {
  let score = 0;
  const reasons: string[] = [];
  const has = (signal: string) => opp.signals.includes(signal);

  if (has("non-grid-tied") || has("solar") || has("battery")) {
    score += 40;
    reasons.push("Asks for non-grid-tied or solar charging, which is the product.");
  }
  if (has("remote-site") || has("park-site") || has("wildlife-office")) {
    score += 25;
    reasons.push("Remote or park site, where a charger without a grid hookup wins.");
  }
  if (has("repeat-buyer")) {
    score += 10;
    reasons.push("Buyer has posted more than once. Winning one opens the next.");
  }
  if (opp.responseLoad === "rfq") {
    score += 10;
    reasons.push("Short RFQ format. Days of work, not weeks.");
  }
  if (opp.categories && (opp.categories.includes(1) || opp.categories.includes(4))) {
    score += 5;
    reasons.push("Explicitly open to categories 1 and 4, which Suryatech holds.");
  }

  if (has("agency-owned-hardware")) {
    score -= 40;
    reasons.push("Installing somebody else's chargers. Not the product.");
  }
  if (has("civil-work")) {
    score -= 15;
    reasons.push("Concrete islands and bollards: heavy civil scope for a small team.");
  }
  if (has("large") || (opp.ceilingUsd !== null && opp.ceilingUsd >= 1000000)) {
    score -= 15;
    reasons.push("Scale above anything on the public record for the company.");
  }
  if (has("carshare-operator-required")) {
    score -= 20;
    reasons.push("Requires a joint venture with an EV carshare operator and a carshare reference.");
  }
  if (has("bonds-likely")) {
    score -= 10;
    reasons.push("Payment bonds likely above $25,000 in services.");
  }
  if (opp.responseLoad === "rfp-heavy") {
    score -= 5;
    reasons.push("Seven-tab response with thirteen signed forms. Weeks of assembly.");
  }

  const effortHours = opp.responseLoad === "rfq" ? 12 : opp.responseLoad === "rfp" ? 40 : 80;

  let verdict: FitVerdict = "consider";
  if (score >= 45) verdict = "chase";
  if (score < 0) verdict = "pass";

  return { verdict, score, reasons, effortHours };
}

export const verdictLabel: Record<FitVerdict, string> = {
  chase: "Chase",
  consider: "Consider",
  pass: "Pass",
};
