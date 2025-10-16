import { Metadata } from "next";
import SitemapClient from "./SitemapClient";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Sitemap | XESS Events",
        description:
            "Browse the complete list of pages on XESS Events. Use our sitemap to quickly navigate the website.",
        metadataBase: new URL("https://xessevents.com"),
        alternates: {
            canonical: "https://xessevents.com/sitemap",
            languages: {
                en: "https://xessevents.com/sitemap",
            },
        },
        keywords: ["sitemap", "site map", "XESS Events pages", "website index"],
        robots: "noindex, follow",
        openGraph: {
            title: "Sitemap | XESS Events",
            description:
                "Browse the complete list of pages on XESS Events. Use our sitemap to quickly navigate the website.",
            url: "https://xessevents.com/sitemap",
            type: "website",
            images: ["/images/Footer_logo.png"],
        },
        twitter: {
            card: "summary_large_image",
            site: "@xessevents",
            title: "Sitemap | XESS Events",
            description:
                "Browse the complete list of pages on XESS Events. Use our sitemap to quickly navigate the website.",
            images: ["/images/Footer_logo.png"],
        },
        other: {
            author: "Xess Events Team",
            publisher: "Xess Events",
        },
    };
}

export default function SiteMap() {
    return <SitemapClient />;
}
