// src/app/sitemap/page.tsx
import { Metadata } from "next";
import SitemapClient from "./SitemapClient";
import { parseStringPromise } from "xml2js";

// This is the SEO metadata for the sitemap page
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Site Map | XESS Events",
        description: "Explore the full sitemap of XESS Events to navigate all our pages easily.",
        openGraph: {
            title: "Site Map | XESS Events",
            description: "Explore the full sitemap of XESS Events to navigate all our pages easily.",
            url: "https://xessevents.com/sitemap",
            type: "website",
            images: ["https://xessevents.com/images/default-og.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title: "Site Map | XESS Events",
            description: "Explore the full sitemap of XESS Events to navigate all our pages easily.",
            images: ["https://xessevents.com/images/default-og.jpg"],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Server Component for SSR/Static Rendering
export default async function SiteMap() {
    const sitemap = await fetchSitemapData();
    return <SitemapClient sitemap={sitemap} />;
}

// Fetch and parse sitemap.xml server-side
async function fetchSitemapData() {
    const response = await fetch("https://xessevents.com/sitemap.xml", { cache: "force-cache" });
    const xmlText = await response.text();
    const sitemapData = await parseSitemapXml(xmlText);
    return sitemapData;
}

// Parse XML using xml2js (Node compatible)
async function parseSitemapXml(xmlText: string) {
    const result = await parseStringPromise(xmlText);
    const urls = result.urlset?.url || [];
    return urls.map((item: any) => {
        const loc = item.loc?.[0] || "";
        // Extract path from loc (relative path for display)
        const path = loc.replace("https://xessevents.com", "");
        return {
            loc,
            path,
            lastmod: item.lastmod?.[0] || "",
            changefreq: item.changefreq?.[0] || "monthly",
            priority: item.priority?.[0] || "0.5",
        };
    });
}

 