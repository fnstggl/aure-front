/**
 * Single source of truth for the site's SEO metadata.
 *
 * This module is intentionally dependency-free and isomorphic (no React, no
 * browser- or Node-only APIs at module scope) so it can be imported from BOTH:
 *   - the client bundle (src/components/RouteMeta.tsx), to keep <title> and
 *     friends in sync during client-side navigation, and
 *   - the Vite build plugin (vite.config.ts), to bake correct per-route meta,
 *     JSON-LD, and a sitemap into the static output at build time.
 *
 * Why per-route static meta matters here: this is a client-rendered SPA. The
 * raw HTML Netlify serves for every deep link is the same shell, so without
 * build-time injection every URL would advertise the homepage's title,
 * description and canonical to crawlers and social scrapers that don't execute
 * JavaScript. The build plugin rewrites those tags per route; RouteMeta covers
 * the JS-rendered/SPA-navigation case. No on-page copy is affected.
 */

export interface RouteMeta {
  /** URL path as registered in the router. */
  path: string;
  /** <title> + og/twitter title. */
  title: string;
  /** Meta description + og/twitter description. ~150-165 chars ideal. */
  description: string;
  /** Human label used in breadcrumbs / WebPage name. */
  name: string;
  /** sitemap <priority> (0.0 - 1.0). */
  priority: number;
  /** sitemap <changefreq>. */
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

export const SITE = {
  origin: "https://runaurelius.com",
  name: "Aurelius",
  /** og:image / twitter:image used across pages. */
  image: "https://runaurelius.com/opengraph.png",
  imageAlt: "Aurelius · the control layer for economically efficient GPU fleets",
  twitterCard: "summary_large_image",
  locale: "en_US",
  themeColor: "#0a0a0a",
  /** Falls back to these when a path isn't in ROUTES (e.g. 404). */
  defaultTitle: "Aurelius · The control layer for economically efficient GPU fleets",
  defaultDescription:
    "Aurelius evaluates when workloads should run, where they should run, and when optimization is safe, before execution. Shadow-mode first. Constraint-aware by default. Built for schedulers, platform teams, and GPU fleet operators.",
  /**
   * Official Organization profile URLs for JSON-LD `sameAs`. Intentionally
   * empty: no LinkedIn/GitHub/X/Crunchbase URLs exist in the repo or on the
   * site yet. Populate ONLY with real, verified URLs — see TODO in
   * organizationNode(). Never invent these.
   */
  sameAs: [] as readonly string[],
} as const;

/**
 * Every indexable route. Titles/descriptions are SEO metadata (not visible
 * page copy) derived faithfully from each page's existing on-page intro.
 */
export const ROUTES: RouteMeta[] = [
  {
    path: "/",
    title: "Aurelius · Constraint-aware orchestration for AI infrastructure",
    description:
      "Aurelius increases SLA-safe goodput per dollar by optimizing scheduling, placement, admission, routing, capacity, and energy decisions. Backtested on public production traces. Shadow-mode first, read-only by default.",
    name: "Platform",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/technical-report",
    title: "Technical Report · Aurelius: Predictive World Models for AI Infrastructure",
    description:
      "Aurelius forecasts future cluster state and simulates coupled candidate decisions before execution. In an uncapped high-load public-trace replay across PJM/ERCOT/CAISO price windows it averages +724% SLA-safe goodput per dollar vs a production-class scheduler baseline, Pareto-safe at ~84% fewer GPU-hours.",
    name: "Technical Report",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/how-it-works",
    title: "How it works · Aurelius advisory control layer for GPU scheduling",
    description:
      "How Aurelius works: an advisory layer that reads scheduler metadata, forecasts energy conditions with explicit uncertainty, and filters risky decisions before execution, so your scheduler stays in control.",
    name: "How it works",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/safety",
    title: "Safety: evaluation-first, read-only architecture | Aurelius",
    description:
      "Aurelius begins as an analysis tool, not a control system. Every evaluation starts offline. It reads scheduler metadata such as queue state, capacity, and job history, never prompts or payloads, replays your own recorded traces, validates against your configured hard constraints, and compares against your baseline. Shadow recommendations and any production integration are operator-approved and optional.",
    name: "Safety",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/shadow-audit",
    title: "Shadow audit · prove GPU savings with zero execution risk | Aurelius",
    description:
      "Run Aurelius in dry-run shadow mode against your real workloads. See approved and skipped decisions, simulated energy, cost, and carbon savings, and proof that SLAs hold, with no execution impact.",
    name: "Shadow audit",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/replay",
    title: "Aurelius Replay · rerun your own scheduler logs, locally | Aurelius",
    description:
      "A read-only local tool that replays your historical scheduler or serving logs through Aurelius's decision layer and reports the counterfactual — same workloads, same arrivals, scored on SLA-safe goodput per dollar. Runs on your machine; no logs leave it.",
    name: "Replay",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/docs",
    title: "Documentation · Aurelius technical reference",
    description:
      "Technical reference for infrastructure engineers integrating the Aurelius control layer: architecture, configuration, execution modes, and security. Full documentation for pilot participants.",
    name: "Docs",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Get access · Aurelius shadow-mode evaluation",
    description:
      "Request a read-only, shadow-mode evaluation of Aurelius using scheduler metadata. Historical replay and live shadow deployments supported. No payload access, no execution impact.",
    name: "Get access",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy policy · Aurelius",
    description:
      "How Aurelius collects, uses, and protects information. Metadata-only by design, shadow-mode first; the same restraint that governs the product governs your data.",
    name: "Privacy policy",
    priority: 0.3,
    changefreq: "yearly",
  },
];

/** Absolute URL for a route. Home resolves to the bare origin (no trailing slash). */
export function routeUrl(path: string): string {
  return path === "/" ? SITE.origin : SITE.origin + path;
}

/** Look up a route's metadata by path (exact match). */
export function getRoute(path: string): RouteMeta | undefined {
  return ROUTES.find((r) => r.path === path);
}

/** Robots directive that permits indexing and rich snippet previews. */
export const ROBOTS_INDEX =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const ROBOTS_NOINDEX = "noindex, follow";

/* ------------------------------------------------------------------ */
/* JSON-LD structured data                                             */
/* ------------------------------------------------------------------ */

const ORG_ID = `${SITE.origin}/#organization`;
const WEBSITE_ID = `${SITE.origin}/#website`;
const SOFTWARE_ID = `${SITE.origin}/#software`;
const TECH_REPORT_PATH = "/technical-report";

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.origin,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.origin}/aure_logo.png`,
    },
    description: SITE.defaultDescription,
    // Real contact surface on the site (the /contact request-access route).
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: `${SITE.origin}/contact`,
    },
    // TODO(business): populate `sameAs` (SITE.sameAs) with official profile
    // URLs once they exist — see note on SITE.sameAs. Omitted, not invented.
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.origin,
    name: SITE.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

function softwareApplicationNode() {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "GPU fleet optimization",
    operatingSystem: "Linux, Kubernetes, Cloud",
    url: SITE.origin,
    description: SITE.defaultDescription,
    publisher: { "@id": ORG_ID },
  };
}

function breadcrumbNode(route: RouteMeta) {
  const items: { name: string; url: string }[] = [{ name: "Home", url: SITE.origin }];
  if (route.path !== "/") items.push({ name: route.name, url: routeUrl(route.path) });
  return {
    "@type": "BreadcrumbList",
    "@id": `${routeUrl(route.path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * TechArticle for the technical report — a long-form, citable engineering
 * document. No author/date are invented: authorship is attributed to the
 * organization (the only verifiable entity), and `datePublished` is left out
 * until a real date is available rather than guessed.
 */
function techArticleNode(route: RouteMeta) {
  return {
    "@type": "TechArticle",
    "@id": `${routeUrl(route.path)}#techarticle`,
    headline: route.title,
    description: route.description,
    inLanguage: "en",
    image: SITE.image,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@id": `${routeUrl(route.path)}#webpage` },
    // TODO(business): add `datePublished` / `dateModified` when a canonical
    // publish date is available — omitted rather than fabricated.
  };
}

function webPageNode(route: RouteMeta) {
  return {
    "@type": "WebPage",
    "@id": `${routeUrl(route.path)}#webpage`,
    url: routeUrl(route.path),
    name: route.title,
    description: route.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": route.path === "/" ? SOFTWARE_ID : ORG_ID },
    breadcrumb: { "@id": `${routeUrl(route.path)}#breadcrumb` },
    inLanguage: "en",
    primaryImageOfPage: { "@type": "ImageObject", url: SITE.image },
  };
}

/** Build the JSON-LD @graph for a given route. */
export function buildJsonLd(route: RouteMeta): string {
  const graph: unknown[] = [organizationNode(), websiteNode()];
  if (route.path === "/") graph.push(softwareApplicationNode());
  if (route.path === TECH_REPORT_PATH) graph.push(techArticleNode(route));
  graph.push(breadcrumbNode(route), webPageNode(route));
  const doc = { "@context": "https://schema.org", "@graph": graph };
  // Escape "<" to keep the payload from prematurely closing the <script> tag.
  return JSON.stringify(doc).replace(/</g, "\\u003c");
}

/* ------------------------------------------------------------------ */
/* Build-time HTML injection helpers (used by the Vite plugin)         */
/* ------------------------------------------------------------------ */

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Replace the `content` of a `<meta name="..."|property="...">` tag. */
function setMetaContent(html: string, key: "name" | "property", id: string, value: string): string {
  const re = new RegExp(`(<meta ${key}="${id}" content=")[^"]*(")`);
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

/**
 * Rewrite the shared HTML shell with a route's title, description, canonical,
 * Open Graph / Twitter tags, robots directive, and JSON-LD. Returns the
 * route-specific HTML document.
 */
export function injectSeoIntoHtml(baseHtml: string, route: RouteMeta): string {
  const url = routeUrl(route.path);
  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  html = setMetaContent(html, "name", "description", route.description);
  html = setMetaContent(html, "property", "og:title", route.title);
  html = setMetaContent(html, "property", "og:description", route.description);
  html = setMetaContent(html, "property", "og:url", url);
  html = setMetaContent(html, "name", "twitter:title", route.title);
  html = setMetaContent(html, "name", "twitter:description", route.description);

  // Canonical: rewrite if present, otherwise inject before </head>.
  if (/<link rel="canonical" href="[^"]*"\s*\/?>/.test(html)) {
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeAttr(url)}$2`);
  } else {
    html = html.replace("</head>", `    <link rel="canonical" href="${escapeAttr(url)}" />\n  </head>`);
  }

  // Robots directive: rewrite if present, otherwise inject.
  if (/<meta name="robots" content="[^"]*"\s*\/?>/.test(html)) {
    html = setMetaContent(html, "name", "robots", ROBOTS_INDEX);
  } else {
    html = html.replace("</head>", `    <meta name="robots" content="${ROBOTS_INDEX}" />\n  </head>`);
  }

  // Structured data, injected immediately before </head>.
  const ld = `    <script type="application/ld+json">${buildJsonLd(route)}</script>\n  </head>`;
  html = html.replace("</head>", ld);

  return html;
}

/** Build sitemap.xml for all indexable routes. `lastmod` is an ISO date (YYYY-MM-DD). */
export function buildSitemapXml(lastmod: string): string {
  const urls = ROUTES.map((r) => {
    return [
      "  <url>",
      `    <loc>${routeUrl(r.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n");
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}
