import PortFolioClient from "./PortFolioClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const res = await fetch(`${STRAPI_URL}/api/about-page?populate=seo.metaImage`, {
            next: { revalidate: 60 },
            cache: "force-cache",
        });

        const json = await res.json();
        const seo = json?.data?.attributes?.seo || {};

        const imageUrl = seo?.metaImage?.data?.attributes?.url
            ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
            : "https://xessevents.com/images/default-og.jpg";

        return {
            title: seo.metaTitle || "Portfolio | XESS Events",
            description: seo.metaDescription || "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: seo.metaTitle || "Portfolio | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                title: seo.metaTitle || "Portfolio | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Portfolio | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Portfolio | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Portfolio | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function AboutUs() {
    return <PortFolioClient />;
}
