import { NextRequest, NextResponse } from "next/server";

// Paths to ignore (static assets, api routes, files)
const IGNORE_PREFIXES = [
  "/_next",
  "/api",
  "/images",
  "/videos",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
];

// Known tracking/marketing params to strip
const STRIP_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "trk", // LinkedIn tracker seen in GSC
]);

// If a path contains a literal bracket placeholder, redirect to a safe parent
function redirectPlaceholder(pathname: string): string | null {
  if (!pathname.includes("[")) return null;
  // Map common dynamic parents
  if (pathname.startsWith("/blog/")) return "/blog";
  if (pathname.startsWith("/projects/")) return "/projects";
  if (pathname.startsWith("/exhibition-calendar/"))
    return "/exhibition-calendar";
  return "/";
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const host = req.headers.get("host") || "xessevents.com";
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const origin = `${protocol}://${host}`;

  // Skip ignored paths
  if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 0) Enforce apex domain (non-www)
  if (host.startsWith("www.")) {
    const apex = host.replace(/^www\./, "");
    const url = new URL(`${protocol}://${apex}${pathname}`);
    // preserve non-tracking params
    for (const [k, v] of searchParams.entries()) {
      if (!STRIP_PARAMS.has(k)) url.searchParams.append(k, v);
    }
    return NextResponse.redirect(url, 308);
  }

  // 1) Strip tracking params
  const clean = new URL(origin + pathname);
  let changed = false;
  // Retain only non-tracking params
  for (const [key, value] of searchParams.entries()) {
    if (STRIP_PARAMS.has(key)) {
      changed = true;
      continue; // skip adding
    }
    clean.searchParams.append(key, value);
  }

  // 2) Normalize: collapse duplicate slashes (except root), keep no trailing slash except root
  let normalizedPath = pathname.replace(/\/{2,}/g, "/");
  if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
    changed = true;
  }

  // 3) Placeholder segments like /projects/[SingleProject]
  const placeholderRedirect = redirectPlaceholder(normalizedPath);
  if (placeholderRedirect) {
    clean.pathname = placeholderRedirect;
    clean.search = "";
    return NextResponse.redirect(clean, 308);
  }

  if (normalizedPath !== pathname) {
    clean.pathname = normalizedPath;
  }

  // If anything changed, redirect to clean URL
  if (changed || clean.pathname !== pathname) {
    return NextResponse.redirect(clean, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
