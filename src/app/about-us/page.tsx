import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import client from "@/lib/apolloClient";
import { GET_ABOUT_DATA } from "@/lib/queries";
import type { AboutData } from "@/types/about";
import AboutClient from "./AboutClient";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

const fetchAboutPageData = cache(async (): Promise<AboutData | null> => {
    const { data } = await client.query({
        query: GET_ABOUT_DATA,
        variables: { locale: "en" },
    });

    return data?.aboutPages?.data?.[0]?.attributes || null;
});

const safeParseStructuredData = (payload: unknown) => {
    if (!payload) {
        return null;
    }

    if (typeof payload === "string") {
        try {
            return JSON.parse(payload);
        } catch (error) {
            console.warn("Unable to parse structured data for About page", error);
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
        const aboutData = await fetchAboutPageData();
        const seo = aboutData?.meta_data;
        const defaultTitle = "About Us | XESS Events";
        const defaultDescription = "Learn more about XESS Events and our story.";
        const canonical = seo?.canonicalURL || `${SITE_URL}/about-us`;
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
            title: "About Us | XESS Events",
            description: "Learn more about XESS Events and our story.",
        };
    }
}

export default async function AboutUs() {
    const aboutData = await fetchAboutPageData();

    if (!aboutData) {
        notFound();
    }

    return <AboutClient aboutData={aboutData} />;
}
