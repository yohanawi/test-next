import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import client from "@/lib/apolloClient";
import { GET_FITOUT_DATA } from "@/lib/queries";
import CommercialInteriorServer from "./CommercialInteriorServer";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

const fetchCommercialInteriorData = cache(async (): Promise<any | null> => {
    const { data } = await client.query({
        query: GET_FITOUT_DATA,
        variables: { locale: "en" },
    });

    return data?.fitOutPages?.data?.[0]?.attributes || null;
});

const safeParseStructuredData = (payload: unknown) => {
    if (!payload) {
        return null;
    }

    if (typeof payload === "string") {
        try {
            return JSON.parse(payload);
        } catch (error) {
            console.warn("Unable to parse structured data for Commercial Interior page", error);
            return null;
        }
    }

    if (typeof payload === "object") {
        return payload;
    }

    return null;
};

export async function generateMetadata(): Promise<Metadata> {
    try {
        const mainFitOut = await fetchCommercialInteriorData();
        const seo = mainFitOut?.meta_data;
        const defaultTitle = "Commercial Interior Fit-Out in Dubai | XESS Events";
        const defaultDescription = "Discover XESS Events' commercial interior fit-out services in Dubai.";
        const canonical = seo?.canonicalURL || `${SITE_URL}/commercial-interior-fit-out-in-dubai`;
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";
        const structuredDataJson = safeParseStructuredData(seo?.structuredData);

        return {
            title: seo?.metaTitle || defaultTitle,
            description: seo?.metaDescription || defaultDescription,
            metadataBase: new URL(SITE_URL),
            alternates: {
                canonical,
                languages: {
                    en: canonical,
                },
            },
            keywords: seo?.keywords?.length ? seo.keywords : undefined,
            robots: seo?.metaRobots || "index, follow",
            openGraph: {
                title: seo?.metaTitle || defaultTitle,
                description: seo?.metaDescription || defaultDescription,
                url: canonical,
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo?.metaTitle || defaultTitle,
                description: seo?.metaDescription || defaultDescription,
                images: [imageUrl],
            },
            other: {
                ...(structuredDataJson && { "application/ld+json": JSON.stringify(structuredDataJson) }),
                author: "Xess Events Team",
                publisher: "Xess Events",
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Commercial Interior Fit-Out in Dubai | XESS Events",
            description: "Discover XESS Events' commercial interior fit-out services in Dubai.",
        };
    }
}

export default async function CommercialInteriorFitOut() {
    const mainFitOut = await fetchCommercialInteriorData();

    if (!mainFitOut) {
        notFound();
    }

    return <CommercialInteriorServer mainFitOut={mainFitOut} />;
}
