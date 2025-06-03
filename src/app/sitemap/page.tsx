import { Metadata } from "next";
import SitemapClient from "./SitemapClient";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: "Site Map | XESS Events",
        description: "Site Map Learn more about XESS Events and our story.",
        openGraph: {
            title: "Site Map | XESS Events",
            description: "Site Map Learn more about XESS Events and our story.",
            url: "https://xessevents.com/sitemap",
            type: "website",
            images: "https://xessevents.com/images/default-og.jpg",
        },
        twitter: {
            card: "summary_large_image",
            title: "Site Map | XESS Events",
            description: "Site Map Learn more about XESS Events and our story.",
            images: "https://xessevents.com/images/default-og.jpg",
        },
    };

}

export default function SiteMap() {
    return <SitemapClient />;
}
