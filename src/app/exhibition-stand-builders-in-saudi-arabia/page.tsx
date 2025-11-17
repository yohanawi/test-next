import { Metadata } from "next";
import BuildersSaudiArabia from "./BuildersSaudiArabia";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const res = await fetch(`${STRAPI_URL}/api/about-page?populate=seo.metaImage`, {
            next: { revalidate: 60 },
            cache: "force-cache",
        });

        const json = await res.json();
        const seo = json?.data?.attributes?.seo || {};

        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/Footer_logo.png";

        return {
            title: seo.metaTitle || "Exhibition Stand Builders in Saudi Arabia | XESS Events",
            description: seo.metaDescription || "XESS Events plans, builds, and assembles creative exhibition stands in Saudi Arabia. Expert solutions to showcase your brand and captivate your audience.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: "https://xessevents.com/exhibition-stand-builders-in-saudi-arabia",
                languages: {
                    "en": "https://xessevents.com/exhibition-stand-builders-in-saudi-arabia",
                },
            },
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Builders in Saudi Arabia | XESS Events",
                description: seo.metaDescription || "XESS Events plans, builds, and assembles creative exhibition stands in Saudi Arabia. Expert solutions to showcase your brand and captivate your audience.",
                url: "https://xessevents.com/exhibition-stand-builders-in-saudi-arabia",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Exhibition Stand Builders in Saudi Arabia | XESS Events",
                description: seo.metaDescription || "XESS Events plans, builds, and assembles creative exhibition stands in Saudi Arabia. Expert solutions to showcase your brand and captivate your audience.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Stand Builders in Saudi Arabia | XESS Events",
            description: "XESS Events plans, builds, and assembles creative exhibition stands in Saudi Arabia. Expert solutions to showcase your brand and captivate your audience.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Builders in Saudi Arabia | XESS Events",
                description: "XESS Events plans, builds, and assembles creative exhibition stands in Saudi Arabia. Expert solutions to showcase your brand and captivate your audience.",
                url: "https://xessevents.com/exhibition-stand-builders-in-saudi-arabia",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Builders in Saudi Arabia | XESS Events",
                description: "XESS Events plans, builds, and assembles creative exhibition stands in Saudi Arabia. Expert solutions to showcase your brand and captivate your audience.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default function BuildersInSaudiArabia() {
    return <BuildersSaudiArabia />;
}
