import { cache } from "react";
import { Metadata } from "next";
import EventClient from "./EventClient";
import client from "@/lib/apolloClient";
import { notFound } from "next/navigation";
import { GET_EVENT_PRODUCTION_DATA } from "@/lib/queries";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

const fetchEventProductionData = cache(async (): Promise<any | null> => {
    const { data } = await client.query({
        query: GET_EVENT_PRODUCTION_DATA,
        variables: { locale: "en" },
    });

    return data?.eventProductionPages?.data?.[0]?.attributes || null;
});

const safeParseStructuredData = (payload: unknown) => {
    if (!payload) {
        return null;
    }

    if (typeof payload === "string") {
        try {
            return JSON.parse(payload);
        } catch (error) {
            console.warn("Unable to parse structured data for Event Production page", error);
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
        const eventProduction = await fetchEventProductionData();
        const seo = eventProduction?.meta_data;
        const defaultTitle = "Event Production | XESS Events";
        const defaultDescription = "Explore XESS Events' event production services in Dubai.";
        const canonical = seo?.canonicalURL || `${SITE_URL}/event-production`;
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
            title: "Event Production | XESS Events",
            description: "Explore XESS Events' event production services in Dubai.",
        };
    }
}

export default async function EventProduction() {
    const eventProduction = await fetchEventProductionData();

    if (!eventProduction) {
        notFound();
    }

    return <EventClient eventProduction={eventProduction} />;
}
