import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";
import { ROUTES, injectSeoIntoHtml, buildSitemapXml } from "./src/lib/seo";

/**
 * Build-time SEO prerendering for this client-rendered SPA.
 *
 * Vite emits a single index.html shell, and Netlify serves it for every deep
 * link — so without this, every URL would advertise the homepage's title,
 * description, canonical and Open Graph tags to crawlers and social scrapers
 * that don't run JavaScript. This plugin takes the built shell and writes a
 * dedicated, correctly-tagged document for each route (dist/<route>/index.html,
 * which Netlify serves natively before the SPA fallback), plus a sitemap.xml.
 * It only rewrites <head> metadata + injects JSON-LD — no page copy changes.
 */
function seoPrerender(): Plugin {
  let outDir = "dist";
  let root = process.cwd();
  return {
    name: "aurelius-seo-prerender",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
    },
    closeBundle() {
      const distDir = path.resolve(root, outDir);
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      // Pristine shell is the base for every route so each document carries
      // exactly one JSON-LD block and one set of meta tags.
      const baseHtml = fs.readFileSync(indexPath, "utf8");
      const lastmod = new Date().toISOString().slice(0, 10);

      for (const route of ROUTES) {
        const html = injectSeoIntoHtml(baseHtml, route);
        if (route.path === "/") {
          fs.writeFileSync(indexPath, html);
        } else {
          const dir = path.join(distDir, route.path);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html);
        }
      }

      fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemapXml(lastmod));

      console.log(
        `\n[seo] prerendered ${ROUTES.length} routes + sitemap.xml (lastmod ${lastmod})`,
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    seoPrerender(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
