import { Metadata } from "next";
import BuilderClient from "./BuilderClient";
import { GET_EXHIBITION_BUILDER_DATA } from "@/lib/queries";
import client from "@/lib/apolloClient";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const { data } = await client.query({ query: GET_EXHIBITION_BUILDER_DATA, variables: { locale: "en" }, });
        const seo = data?.exhiBuildPage?.data?.attributes?.meta_data || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";
        const structuredDataJson = seo.structuredData || null;

        return {
            title: seo.metaTitle || "Exhibition Stand Builders",
            description: seo.metaDescription || "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/exhibition-stand-builders",
                languages: {
                    "en": "https://xessevents.com/exhibition-stand-builders",
                },
            },
            keywords: seo.keywords || [],
            robots: seo.metaRobots || "index, follow",
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Builders | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/exhibition-stand-builders",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Exhibition Stand Builders | XESS Events",
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
            title: "Exhibition Stand Builders | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Builders | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Builders | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function BuildersClient() {
    return <BuilderClient />;
}
