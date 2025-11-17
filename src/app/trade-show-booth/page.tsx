import { Metadata } from "next";
import TradeShowClient from "./TradeShowClient";
import { GET_TRADESHOW_DATA } from "@/lib/queries";
import client from "@/lib/apolloClient";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const { data } = await client.query({ query: GET_TRADESHOW_DATA, variables: { locale: "en" }, });
        const seo = data?.tradeShows?.data?.[0]?.attributes?.meta_data || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";
        const structuredDataJson = seo.structuredData || null;


        return {
            title: seo.metaTitle || "Trade Show | XESS Events",
            description: seo.metaDescription || "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/trade-show-booth",
                languages: {
                    "en": "https://xessevents.com/trade-show-booth",
                },
            },
            keywords: seo.keywords || [],
            robots: seo.metaRobots || "index, follow",
            openGraph: {
                title: seo.metaTitle || "Trade Show | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/trade-show-booth",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Trade Show | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                images: [imageUrl],
            },
            other: {
                ...(structuredDataJson && { "application/ld+json": JSON.stringify(structuredDataJson), }),
                "author": "Xess Events Team",
                "publisher": "Xess Events",
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Trade Show | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Trade Show | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/trade-show-booth",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Trade Show | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function TradeShow() {
    return <TradeShowClient />;
}
