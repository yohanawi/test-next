import { Metadata } from "next";
import client from "@/lib/apolloClient";
import { GET_TRADESHOW_DATA } from "@/lib/queries";
import TradeShowServer from "./TradeShowServer";
import { cache } from "react";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

// Cached SSR GraphQL fetch
const fetchTradeShowData = cache(async () => {
    const { data } = await client.query({
        query: GET_TRADESHOW_DATA,
        variables: { locale: "en" },
    });
    return data?.tradeShows?.data?.[0]?.attributes || null;
});

const safeJSON = (value: unknown) => {
    if (!value) return null;
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }
    return value;
};

export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await fetchTradeShowData();
        const seo = page?.meta_data || {};

        const title = seo.metaTitle || "Trade Show Booth | XESS Events";
        const description = seo.metaDescription || "Trade show booth design and production in Dubai.";
        const canonical = seo.canonicalURL || `${SITE_URL}/trade-show-booth`;

        const ogImage =
            seo?.metaImage?.data?.attributes?.url
                ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
                : `${SITE_URL}/images/default-og.jpg`;

        const structured = safeJSON(seo.structuredData);

        return {
            title,
            description,
            metadataBase: new URL(SITE_URL),
            alternates: { canonical },
            openGraph: {
                title,
                description,
                url: canonical,
                type: "website",
                images: [ogImage],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [ogImage],
            },
            robots: seo.metaRobots || "index, follow",
            keywords: seo.keywords || [],
            other: {
                ...(structured && {
                    "application/ld+json": JSON.stringify(structured),
                }),
                author: "XESS Events Team",
                publisher: "XESS Events",
            },
        };
    } catch (e) {
        return {
            title: "Trade Show Booth | XESS Events",
            description: "Trade show booth design and production in Dubai.",
        };
    }
}

export default async function TradeShowPage() {
    const pageData = await fetchTradeShowData();
    return <TradeShowServer data={pageData} />;
}
