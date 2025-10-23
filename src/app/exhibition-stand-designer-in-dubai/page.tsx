import { Metadata } from "next";
import DesignerDubai from "./DesignerDubai";

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const res = await fetch(`${STRAPI_URL}/api/about-page?populate=seo.metaImage`, {
            next: { revalidate: 60 },
            cache: "force-cache",
        });

        const json = await res.json();
        const seo = json?.data?.attributes?.seo || {};

        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";

        return {
            title: seo.metaTitle || "Exhibition Stand Design & Builder in Dubai | XESS Events",
            description: seo.metaDescription || "XESS Events creates custom exhibition stand designs in Dubai. Unique, engaging booths crafted to captivate audiences and boost your brand presence.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Design & Builder in Dubai | XESS Events",
                description: seo.metaDescription || "XESS Events creates custom exhibition stand designs in Dubai. Unique, engaging booths crafted to captivate audiences and boost your brand presence.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                title: seo.metaTitle || "Exhibition Stand Design & Builder in Dubai | XESS Events",
                description: seo.metaDescription || "XESS Events creates custom exhibition stand designs in Dubai. Unique, engaging booths crafted to captivate audiences and boost your brand presence.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Stand Design & Builder in Dubai | XESS Events",
            description: "XESS Events creates custom exhibition stand designs in Dubai. Unique, engaging booths crafted to captivate audiences and boost your brand presence.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Design & Builder in Dubai | XESS Events",
                description: "XESS Events creates custom exhibition stand designs in Dubai. Unique, engaging booths crafted to captivate audiences and boost your brand presence.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Design & Builder in Dubai | XESS Events",
                description: "XESS Events creates custom exhibition stand designs in Dubai. Unique, engaging booths crafted to captivate audiences and boost your brand presence.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function DesignerInDubai() {
    return <DesignerDubai />;
}
