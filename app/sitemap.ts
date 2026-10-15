import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getSizeOptions } from "@/lib/tires";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const pages = ["", "/about", "/contact", "/terms", "/privacy", "/accessibility"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.5,
  }));
  // One entry per tire size that exists in the price list
  const sizes = getSizeOptions().map((s) => ({
    url: `${base}/tires?width=${s.width}&profile=${s.profile}&rim=${s.rim}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...pages, ...sizes];
}
