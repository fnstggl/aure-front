import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE, getRoute, routeUrl, ROBOTS_INDEX, ROBOTS_NOINDEX } from "@/lib/seo";

/**
 * Keeps document <head> metadata correct during client-side navigation.
 *
 * Each route is also prerendered with the right tags at build time (see the
 * seoPrerender plugin in vite.config.ts), which is what non-JS crawlers and
 * social scrapers read. This component covers the in-app SPA case: when a user
 * (or a JS-rendering crawler) navigates between routes without a full reload,
 * it updates the title, description, canonical, and social tags in place.
 *
 * It only ever UPDATES existing tags (or creates one if missing), so it never
 * duplicates the tags already present in the served HTML. No visible copy is
 * touched.
 */
function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = getRoute(pathname);
    const title = route?.title ?? SITE.defaultTitle;
    const description = route?.description ?? SITE.defaultDescription;
    const url = route ? routeUrl(route.path) : SITE.origin + pathname;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", route ? ROBOTS_INDEX : ROBOTS_NOINDEX);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertCanonical(url);
  }, [pathname]);

  return null;
}
