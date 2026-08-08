import { useEffect } from "react";

const SITE_NAME = "Gnome";
const CORE_DESCRIPTION =
  "Gnome is a neighborhood marketplace that helps people grow, find, share, and sell local food and garden goods.";

interface SeoOptions {
  title: string;
  description?: string;
  /** Private/authenticated pages must never be indexed. */
  noIndex?: boolean;
  path?: string;
}

function setMeta(selector: string, attr: "name" | "property", value: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Sets per-page title, description, Open Graph tags, canonical URL and robots policy. */
export function useSeo({ title, description = CORE_DESCRIPTION, noIndex = false, path }: SeoOptions): void {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow",
    );

    const href = `${window.location.origin}${path ?? window.location.pathname}`;
    setMeta('meta[property="og:url"]', "property", "og:url", href);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = href;
  }, [title, description, noIndex, path]);
}

export { CORE_DESCRIPTION };
