import { Metadata } from "next";
import DesignerSharjah from "./DesignerSharjah";

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
            title: seo.metaTitle || "Exhibition Stand Builder & Design in Sharjah | XESS Events",
            description: seo.metaDescription || "XESS Events creates custom exhibition stand designs in Sharjah . Creative, high-quality booths built to impress and attract visitors at every event.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: "https://xessevents.com/exhibition-stand-designer-in-sharjah",
                languages: {
                    "en": "https://xessevents.com/exhibition-stand-designer-in-sharjah",
                },
            },
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Builder & Design in Sharjah | XESS Events",
                description: seo.metaDescription || "XESS Events creates custom exhibition stand designs in Sharjah . Creative, high-quality booths built to impress and attract visitors at every event.",
                url: "https://xessevents.com/exhibition-stand-designer-in-sharjah",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Exhibition Stand Builder & Design in Sharjah | XESS Events",
                description: seo.metaDescription || "XESS Events creates custom exhibition stand designs in Sharjah . Creative, high-quality booths built to impress and attract visitors at every event.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Stand Builder & Design in Sharjah | XESS Events",
            description: "XESS Events creates custom exhibition stand designs in Sharjah . Creative, high-quality booths built to impress and attract visitors at every event.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Builder & Design in Sharjah | XESS Events",
                description: "XESS Events creates custom exhibition stand designs in Sharjah . Creative, high-quality booths built to impress and attract visitors at every event.",
                url: "https://xessevents.com/exhibition-stand-designer-in-sharjah",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Builder & Design in Sharjah | XESS Events",
                description: "XESS Events creates custom exhibition stand designs in Sharjah . Creative, high-quality booths built to impress and attract visitors at every event.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default function DesignerInSharjah() {
    return <DesignerSharjah />;
}
