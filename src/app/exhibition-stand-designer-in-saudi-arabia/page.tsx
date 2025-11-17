import { Metadata } from "next";
import DesignerSaudiArabia from "./DesignerSaudiArabia";

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
            title: seo.metaTitle || "Exhibition Stand Builder & Design in Saudi Arabia | XESS Events",
            description: seo.metaDescription || "XESS Events creates innovative exhibition stand designs in Saudi Arabia. Custom-built booths crafted to engage audiences and elevate your brand presence.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: "https://xessevents.com/exhibition-stand-designer-in-saudi-arabia",
                languages: {
                    "en-US": "https://xessevents.com/exhibition-stand-designer-in-saudi-arabia",
                },
            },
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Builder & Design in Saudi Arabia | XESS Events",
                description: seo.metaDescription || "XESS Events creates innovative exhibition stand designs in Saudi Arabia. Custom-built booths crafted to engage audiences and elevate your brand presence.",
                url: "https://xessevents.com/exhibition-stand-designer-in-saudi-arabia",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Exhibition Stand Builder & Design in Saudi Arabia | XESS Events",
                description: seo.metaDescription || "XESS Events creates innovative exhibition stand designs in Saudi Arabia. Custom-built booths crafted to engage audiences and elevate your brand presence.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Stand Builder & Design in Saudi Arabia | XESS Events",
            description: "XESS Events creates innovative exhibition stand designs in Saudi Arabia. Custom-built booths crafted to engage audiences and elevate your brand presence.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Builder & Design in Saudi Arabia | XESS Events",
                description: "XESS Events creates innovative exhibition stand designs in Saudi Arabia. Custom-built booths crafted to engage audiences and elevate your brand presence.",
                url: "https://xessevents.com/exhibition-stand-designer-in-saudi-arabia",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Builder & Design in Saudi Arabia | XESS Events",
                description: "XESS Events creates innovative exhibition stand designs in Saudi Arabia. Custom-built booths crafted to engage audiences and elevate your brand presence.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default function DesignerInSaudiArabia() {
    return <DesignerSaudiArabia />;
}
