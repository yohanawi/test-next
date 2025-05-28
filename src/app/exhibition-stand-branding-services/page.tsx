import { Metadata } from "next";
import Branding from "./Branding";
import client from "@/lib/apolloClient";
import { GET_EXHIBITION_BRANDING_DATA } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const { data } = await client.query({ query: GET_EXHIBITION_BRANDING_DATA, variables: { locale: "en" }, });
        const seo = data?.exhiBranPage?.data?.attributes?.meta_data || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";
        const structuredDataJson = seo.structuredData || null;


        return {
            title: seo.metaTitle || "exhibition-stand-Branding | XESS Events",
            description: seo.metaDescription || "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/exhibition-stand-branding-services",
                languages: {
                    "en": "https://xessevents.com/exhibition-stand-branding-services",
                },
            },
            keywords: seo.keywords || [],
            robots: seo.metaRobots || "index, follow",
            openGraph: {
                title: seo.metaTitle || "exhibition-stand-Branding | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/exhibition-stand-branding-services",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "exhibition-stand-Branding | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                images: [imageUrl],
            },
            viewport: seo.metaViewport || "width=device-width, initial-scale=1",
            other: {
                ...(structuredDataJson && { "application/ld+json": JSON.stringify(structuredDataJson), }),
                "author": "Xess Events Team",
                "publisher": "Xess Events",
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "exhibition-stand-Branding | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "exhibition-stand-Branding | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/exhibition-stand-branding-services",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "exhibition-stand-Branding | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function BrandingClient() {
    return <Branding />;
}
