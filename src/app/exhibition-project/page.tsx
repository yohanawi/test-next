import { Metadata } from "next";
import { cache } from "react";
import client from "@/lib/apolloClient";
import {
    GET_PROJECT_PAGE,
    GET_PROJECT,
    GET_PROJECT_CATEGORY,
} from "@/lib/queries";
import ProjectClient from "./ProjectClient";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

// --------------------------------------------------
// Server-side Strapi Fetch (Cached)
// --------------------------------------------------
const fetchProjectPageData = cache(async () => {
    const { data } = await client.query({
        query: GET_PROJECT_PAGE,
        variables: { locale: "en" },
        fetchPolicy: "no-cache",
    });

    return data?.projectPages?.data?.[0]?.attributes || null;
});

const fetchProjects = cache(async () => {
    const { data } = await client.query({
        query: GET_PROJECT,
        variables: { locale: "en" },
        fetchPolicy: "no-cache",
    });

    return data?.projects?.data || [];
});

const fetchProjectCategories = cache(async () => {
    const { data } = await client.query({
        query: GET_PROJECT_CATEGORY,
        variables: { locale: "en" },
        fetchPolicy: "no-cache",
    });

    return data || null;
});

// --------------------------------------------------
// Safe JSON parsing for SEO Structured Data
// --------------------------------------------------
const safeParseStructuredData = (payload: unknown) => {
    if (!payload) return null;
    if (typeof payload === "string") {
        try {
            return JSON.parse(payload);
        } catch {
            return null;
        }
    }
    if (typeof payload === "object") return payload;
    return null;
};

// --------------------------------------------------
// SEO Metadata
// --------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await fetchProjectPageData();
        const seo = page?.meta_data;

        const defaultTitle = "Exhibition Project | XESS Events";
        const defaultDescription =
            "Explore professional exhibition stand projects from XESS Events.";

        const canonical = seo?.canonicalURL || `${SITE_URL}/exhibition-project`;

        const imageUrl = seo?.metaImage?.data?.attributes?.url
            ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
            : `${SITE_URL}/images/default-og.jpg`;

        const structuredDataJson = safeParseStructuredData(
            seo?.structuredData
        );

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
                ...(structuredDataJson && {
                    "application/ld+json": JSON.stringify(structuredDataJson),
                }),
                author: "Xess Events Team",
                publisher: "Xess Events",
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);

        return {
            title: "Exhibition Project | XESS Events",
            description:
                "Explore professional exhibition stand projects from XESS Events.",
            metadataBase: new URL(SITE_URL),

            openGraph: {
                title: "Exhibition Project | XESS Events",
                description:
                    "Explore professional exhibition stand projects from XESS Events.",
                url: `${SITE_URL}/exhibition-project`,
                type: "website",
                images: [`${SITE_URL}/images/default-og.jpg`],
            },

            twitter: {
                card: "summary_large_image",
                title: "Exhibition Project | XESS Events",
                description:
                    "Explore professional exhibition stand projects from XESS Events.",
                images: [`${SITE_URL}/images/default-og.jpg`],
            },
        };
    }
}

// --------------------------------------------------
// SSR PAGE COMPONENT
// --------------------------------------------------
export default async function ProjectPage() {
    const projectPage = await fetchProjectPageData();
    const projects = await fetchProjects();
    const categories = await fetchProjectCategories();

    return (
        <ProjectClient
            projectPage={projectPage}
            projects={projects}
            categories={categories}
        />
    );
}
