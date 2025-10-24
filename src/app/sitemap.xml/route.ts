// app/sitemap.xml/route.ts
// Dynamic XML sitemap generator that walks the filesystem (src/app) to list all static routes.
// It also allows augmenting with CMS powered dynamic content (e.g., blog posts) via helper functions.

import fs from "fs";
import path from "path";
import client from "@/lib/apolloClient";
import {
  GET_ALL_BLOGS,
  GET_ALL_CALENDAR,
  GET_ALL_STANDS,
  GET_ALL_PROJECTS,
} from "@/lib/queries";

// If you deploy on an Edge runtime, 'fs' is not available. Force Node.js.
export const runtime = "nodejs";
// Make the sitemap static (re-generated only on build) unless you need frequent updates.
export const dynamic = "force-static";
// Revalidate daily (ignored for force-static but kept here for easy switch to dynamic).
// Use a plain numeric literal so Next.js AST parser accepts it (avoid BinaryExpression parse issue)
export const revalidate = 86400; // 24h

const BASE_URL = "https://xessevents.com";

// Folders to skip while traversing.
const EXCLUDE_DIR_NAMES = new Set([
  "api",
  "sitemap", // HTML sitemap page
  "sitemap.xml",
  "robots.txt",
  "_components",
  "(marketing)", // example of optional segment pattern (adjust/remove as needed)
]);

// File / route names to skip (without extension) – e.g., special Next.js files.
const EXCLUDE_ROUTE_BASENAMES = new Set([
  "layout",
  "template",
  "error",
  "not-found",
  "loading",
  "route", // route handlers themselves
]);

interface DiscoveredRoute {
  path: string; // e.g. "/about-us"
  file: string; // absolute path of the page file
  mtime: Date; // last modified time
}

// Recursively walk the app directory to collect static (non-dynamic) routes.
function collectStaticRoutes(appDir: string): DiscoveredRoute[] {
  const results: DiscoveredRoute[] = [];

  function walk(currentDir: string, routePrefix: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    // If this directory itself has a page.tsx (or page.jsx/tsx) we treat it as a route.
    // Support page.tsx / page.jsx.
    const pageFile = entries.find(
      (e) => e.isFile() && /^page\.(t|j)sx?$/.test(e.name)
    );
    if (pageFile) {
      // Skip root (handled separately) if routePrefix is ''.
      const fullPath = path.join(currentDir, pageFile.name);
      const stat = fs.statSync(fullPath);
      const routePath = routePrefix || "/";
      if (routePath !== "/" && !shouldSkipSegment(routePath)) {
        results.push({ path: routePath, file: fullPath, mtime: stat.mtime });
      }
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const name = entry.name;

        // Skip excluded directory names.
        if (EXCLUDE_DIR_NAMES.has(name)) continue;
        // Skip dynamic / catch-all / optional segments (e.g., [slug], [...slug], [[slug]]).
        if (/^\[.*\]$/.test(name)) continue;
        // Skip private or underscore folders.
        if (name.startsWith("_")) continue;
        // Skip special next internal directories maybe starting with '(' optional group - we already added one example above.
        if (name.startsWith("(") && name.endsWith(")")) continue; // group segment

        const nextDir = path.join(currentDir, name);
        const newPrefix = routePrefix + "/" + name;
        walk(nextDir, newPrefix.replace(/\/\\/g, "/")); // ensure posix style
      }
    }
  }

  walk(appDir, "");
  // Add root route if page.tsx exists at the top level.
  const rootPage = path.join(appDir, "page.tsx");
  if (fs.existsSync(rootPage)) {
    const stat = fs.statSync(rootPage);
    results.unshift({ path: "/", file: rootPage, mtime: stat.mtime });
  }
  return results;
}

function shouldSkipSegment(routePath: string) {
  // routePath like "/about-us". We skip if basename is an excluded special file base (rare case) or not relevant.
  const base = routePath.split("/").filter(Boolean).pop();
  if (!base) return false;
  return EXCLUDE_ROUTE_BASENAMES.has(base);
}

// Placeholder: fetch dynamic blog slugs. Replace with real data source (CMS, DB, etc.).
type BlogEntry = { slug: string; createdAt?: string };
interface BlogDetailsResponse {
  attributes?: {
    slug?: string;
    createdAt?: string;
  };
}

type CalendarEntry = { slug: string; lastmod?: string };
interface CalendarDetailsResponse {
  attributes?: {
    slug?: string;
    CalenCrd?: {
      startDate?: string;
      endDate?: string;
    };
  };
}

type StandEntry = { slug: string };

type ProjectEntry = { slug: string; createdAt?: string };

async function getDynamicBlogSlugs(): Promise<BlogEntry[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_BLOGS,
      variables: { locale: "en" },
    });
    const blogs = (data?.blogDetails?.data as BlogDetailsResponse[]) || [];
    const interim: { slug?: string; createdAt?: string }[] = blogs.map((b) => ({
      slug: b?.attributes?.slug,
      createdAt: b?.attributes?.createdAt,
    }));
    const filtered: BlogEntry[] = interim
      .filter(
        (b): b is { slug: string; createdAt?: string } =>
          typeof b.slug === "string" && b.slug.length > 0
      )
      .map((b) => ({ slug: b.slug, createdAt: b.createdAt }));
    return filtered;
  } catch (e) {
    console.error("Sitemap blog fetch failed", e);
    return [];
  }
}

// Helper to build priority heuristically (you can customize further).
function priorityFor(pathname: string): number {
  if (pathname === "/") return 1.0;
  if (/^\/blog(\/|$)/.test(pathname)) return 0.8;
  if (/^\/exhibition-calendar(\/|$)/.test(pathname)) return 0.8;
  if (/^\/projects(\/|$)/.test(pathname)) return 0.7;
  if (/^\/exhibition-sub(\/|$)/.test(pathname)) return 0.7;
  if (/contact|request-quotation|about/.test(pathname)) return 0.7;
  return 0.6;
}

function xmlEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildAbsoluteUrl(pathname: string): string {
  // Ensure each segment is encoded. Keep leading slash semantics.
  const parts = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg));
  const normalizedPath = parts.length ? "/" + parts.join("/") : "";
  const raw = `${BASE_URL}${normalizedPath}`;
  try {
    // Validate and normalize
    const u = new URL(raw);
    return u.toString().replace(/\/$/, "");
  } catch {
    return encodeURI(raw).replace(/\/$/, "");
  }
}

export async function GET() {
  const appDir = path.join(process.cwd(), "src", "app");
  const staticRoutes = collectStaticRoutes(appDir);

  // Dynamic blog routes (if you have a CMS, plug in here)
  const blogSlugs = await getDynamicBlogSlugs();
  const dynamicBlogRoutes: DiscoveredRoute[] = blogSlugs.map((b) => ({
    path: `/blog/${b.slug}`,
    file: "dynamic",
    mtime: b.createdAt ? new Date(b.createdAt) : new Date(),
  }));

  // Dynamic exhibition calendar detail routes
  const calendarEntries = await getDynamicCalendarSlugs();
  const dynamicCalendarRoutes: DiscoveredRoute[] = calendarEntries.map((c) => ({
    path: `/exhibition-calendar/${c.slug}`,
    file: "dynamic",
    mtime: c.lastmod ? new Date(c.lastmod) : new Date(),
  }));

  // Dynamic stand detail routes (/exhibition-sub/[stand])
  const standEntries = await getDynamicStandSlugs();
  const dynamicStandRoutes: DiscoveredRoute[] = standEntries.map((s) => ({
    path: `/exhibition-sub/${s.slug}`,
    file: "dynamic",
    mtime: new Date(),
  }));

  // Dynamic project detail routes (/projects/[slug])
  const projectEntries = await getDynamicProjectSlugs();
  const dynamicProjectRoutes: DiscoveredRoute[] = projectEntries.map((p) => ({
    path: `/projects/${p.slug}`,
    file: "dynamic",
    mtime: p.createdAt ? new Date(p.createdAt) : new Date(),
  }));

  const allRoutes = [
    ...staticRoutes,
    ...dynamicBlogRoutes,
    ...dynamicCalendarRoutes,
    ...dynamicStandRoutes,
    ...dynamicProjectRoutes,
  ];

  const urlEntries = allRoutes.map((r) => {
    const locRaw = r.path === "/" ? BASE_URL : buildAbsoluteUrl(r.path);
    const loc = xmlEscape(locRaw);
    const lastmod = r.mtime.toISOString();
    const priority = priorityFor(r.path).toFixed(1);
    return `<url>\n  <loc>${loc}</loc>\n  <lastmod>${lastmod}</lastmod>\n  <changefreq>weekly</changefreq>\n  <priority>${priority}</priority>\n</url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries.join(
    ""
  )}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

async function getDynamicCalendarSlugs(): Promise<CalendarEntry[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_CALENDAR,
      variables: { locale: "en" },
    });
    const items = (data?.calenDetails?.data as CalendarDetailsResponse[]) || [];
    const interim: { slug?: string; lastmod?: string }[] = items.map((i) => ({
      slug: i?.attributes?.slug,
      lastmod:
        i?.attributes?.CalenCrd?.endDate || i?.attributes?.CalenCrd?.startDate,
    }));
    const filtered: CalendarEntry[] = interim
      .filter(
        (c): c is { slug: string; lastmod?: string } =>
          typeof c.slug === "string" && c.slug.length > 0
      )
      .map((c) => ({ slug: c.slug, lastmod: c.lastmod }));
    return filtered;
  } catch (e) {
    console.error("Sitemap calendar fetch failed", e);
    return [];
  }
}

async function getDynamicStandSlugs(): Promise<StandEntry[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_STANDS,
      variables: { locale: "en" },
    });
    const items =
      (data?.standDetails?.data as { attributes?: { slug?: string } }[]) || [];
    const slugs: StandEntry[] = items
      .map((i) => i?.attributes?.slug)
      .filter((s): s is string => typeof s === "string" && s.length > 0)
      .map((slug) => ({ slug }));
    return slugs;
  } catch (e) {
    console.error("Sitemap stand fetch failed", e);
    return [];
  }
}

async function getDynamicProjectSlugs(): Promise<ProjectEntry[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_PROJECTS,
      variables: { locale: "en" },
    });
    const items =
      (data?.projects?.data as {
        attributes?: { slug?: string; createdAt?: string };
      }[]) || [];
    const interim: { slug?: string; createdAt?: string }[] = items.map((i) => ({
      slug: i?.attributes?.slug,
      createdAt: i?.attributes?.createdAt,
    }));
    const filtered: ProjectEntry[] = interim
      .filter(
        (p): p is { slug: string; createdAt?: string } =>
          typeof p.slug === "string" && p.slug.length > 0
      )
      .map((p) => ({ slug: p.slug, createdAt: p.createdAt }));
    return filtered;
  } catch (e) {
    console.error("Sitemap projects fetch failed", e);
    return [];
  }
}
