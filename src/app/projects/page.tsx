import { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const res = await fetch(`${STRAPI_URL}/api/project-page?populate=seo.metaImage`, {
            next: { revalidate: 60 },
            cache: "force-cache",
        });

        const json = await res.json();
        const seo = json?.data?.attributes?.seo || {};

        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/Footer_logo.png";

        return {
            title: seo.metaTitle || "Projects | XESS Events",
            description: seo.metaDescription || "Discover our latest projects and achievements at XESS Events.",
            openGraph: {
                title: seo.metaTitle || "Projects | XESS Events",
                description: seo.metaDescription || "Discover our latest projects and achievements at XESS Events.",
                url: "https://xessevents.com/projects/",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                title: seo.metaTitle || "Projects | XESS Events",
                description: seo.metaDescription || "Discover our latest projects and achievements at XESS Events.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Projects | XESS Events",
            description: "Projects Learn more about XESS Events and our story.",
            openGraph: {
                title: "Projects | XESS Events",
                description: "Projects Learn more about XESS Events and our story.",
                url: "https://xessevents.com/projects/",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Projects | XESS Events",
                description: "Projects Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default function ProjectClient() {
    return <ProjectsClient />;
}
