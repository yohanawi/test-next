import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import client from "@/lib/apolloClient";
import { GET_CONTACT_PAGE_DATA } from "@/lib/queries";
import ContactClient from "./ContactClient";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

const fetchContactPageData = cache(async (): Promise<any | null> => {
    const { data } = await client.query({
        query: GET_CONTACT_PAGE_DATA,
        variables: { locale: "en" },
    });

    return data?.contactPages?.data?.[0]?.attributes || null;
});

const safeParseStructuredData = (payload: unknown) => {
    if (!payload) {
        return null;
    }

    if (typeof payload === "string") {
        try {
            return JSON.parse(payload);
        } catch (error) {
            console.warn("Unable to parse structured data for Contact page", error);
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
        const contactPage = await fetchContactPageData();
        const seo = contactPage?.meta_data;
        const defaultTitle = "Contact Us | XESS Events";
        const defaultDescription = "Get in touch with XESS Events for your event needs.";
        const canonical = seo?.canonicalURL || `${SITE_URL}/contact-us`;
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
            title: "Contact Us | XESS Events",
            description: "Get in touch with XESS Events for your event needs.",
        };
    }
}

export default async function ContactUs() {
    const contactPage = await fetchContactPageData();

    if (!contactPage) {
        notFound();
    }

    return <ContactClient contactPage={contactPage} />;
}