import { Metadata } from "next";
import client from "@/lib/apolloClient";
import WeddingClient from "./WeddingClient";
import { GET_WEDDING_DATA } from "@/lib/queries";
import { cache } from "react";
import StructuredData from "@/components/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

// Enable ISR for this route (revalidate every 5 minutes)
export const revalidate = 300;

// Static Data Fetching (SSR/ISR)
const fetchWeddingData = cache(async () => {
    const { data } = await client.query({
        query: GET_WEDDING_DATA,
        variables: { locale: "en" },
        fetchPolicy: "no-cache",
    });

    return data?.weddingPages?.data?.[0]?.attributes || null;
});

// SEO Metadata generation
export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await fetchWeddingData();
        const seo = page?.meta_data;
        const defaultTitle = "Wedding | XESS Events";
        const defaultDescription = "Premium wedding planning and production services in UAE.";
        const canonical = seo?.canonicalURL || `${SITE_URL}/wedding`;
        const ogImage = seo?.metaImage?.data?.attributes?.url
            ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
            : `${SITE_URL}/images/default-og.jpg`;

        return {
            title: seo?.metaTitle || defaultTitle,
            description: seo?.metaDescription || defaultDescription,
            metadataBase: new URL(SITE_URL),
            alternates: {
                canonical,
                languages: { en: canonical },
            },
            keywords: seo?.keywords?.length ? seo.keywords : undefined,
            robots: seo?.metaRobots || "index, follow",
            openGraph: {
                title: seo?.metaTitle || defaultTitle,
                description: seo?.metaDescription || defaultDescription,
                url: canonical,
                type: "website",
                images: [ogImage],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo?.metaTitle || defaultTitle,
                description: seo?.metaDescription || defaultDescription,
                images: [ogImage],
            },
            other: {
                author: "Xess Events Team",
                publisher: "Xess Events",
            },
        };
    } catch (err) {
        console.error("Wedding SEO Error:", err);

        return {
            title: "Wedding | XESS Events",
            description: "Premium wedding and event planning services in UAE.",
            metadataBase: new URL(SITE_URL),
            openGraph: {
                title: "Wedding | XESS Events",
                description: "Premium wedding and event planning services in UAE.",
                url: `${SITE_URL}/wedding`,
                type: "website",
                images: [`${SITE_URL}/images/default-og.jpg`],
            },
            twitter: {
                card: "summary_large_image",
                title: "Wedding | XESS Events",
                description: "Premium wedding and event planning services in UAE.",
                images: [`${SITE_URL}/images/default-og.jpg`],
            },
        };
    }
}

// Server Component: WeddingPage
export default async function WeddingPage() {
    const mainWedding = await fetchWeddingData();
    const seoJson = mainWedding?.meta_data?.structuredData;
    let parsedJson: Record<string, unknown> | null = null;
    if (seoJson) {
        try {
            parsedJson = JSON.parse(seoJson);
        } catch {
            parsedJson = null;
        }
    }

    return (
        <>
            {parsedJson && <StructuredData data={parsedJson} />}
            <WeddingClient mainWedding={mainWedding} />
        </>
    );
}
