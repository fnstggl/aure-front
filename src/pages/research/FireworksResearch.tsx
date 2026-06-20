import { CompanyResearch } from "@/components/research/CompanyResearch";
import { fireworksResearch } from "@/data/companies/fireworks";

/**
 * Private outbound research memo for Fireworks AI.
 *
 * Thin wrapper so the page + its data code-split into their own chunk. Routed
 * (in src/App.tsx) at both:
 *   • /company-template-FH37X  — template preview
 *   • /fireworks-ai-FH37X      — the per-company URL
 * Both are registered in PRIVATE_ROUTES (src/lib/seo.ts) → noindex,nofollow and
 * excluded from the sitemap.
 */
export default function FireworksResearch() {
  return <CompanyResearch data={fireworksResearch} />;
}
