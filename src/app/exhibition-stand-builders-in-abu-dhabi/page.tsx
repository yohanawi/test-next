import { Metadata } from "next";
import BuildersAbuDhabi from "./BuildersAbuDhabi";

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
            title: seo.metaTitle || "exhibition-stand-builders-in-abu-dhabi | XESS Events",
            description: seo.metaDescription || "Discover top exhibition stand builders in Abu Dhabi with XESS Events. Innovative designs, quality construction, and turnkey solutions for your next event.",            
            openGraph: {
            title: seo.metaTitle || "exhibition-stand-builders-in-abu-dhabi | XESS Events",
            description: seo.metaDescription || "Discover top exhibition stand builders in Abu Dhabi with XESS Events. Innovative designs, quality construction, and turnkey solutions for your next event.",
            url: "https://xessevents.com/exhibition-stand-builders-in-abu-dhabi",
            type: "website",
            images: [imageUrl],
            },
            twitter: {
            card: "summary_large_image",
            title: seo.metaTitle || "exhibition-stand-builders-in-abu-dhabi | XESS Events",
            description: seo.metaDescription || "Discover top exhibition stand builders in Abu Dhabi with XESS Events. Innovative designs, quality construction, and turnkey solutions for your next event.",
            images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "exhibition-stand-branding-services-in-abu-dhabi | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "exhibition-stand-branding-services-in-abu-dhabi | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "exhibition-stand-branding-services-in-abu-dhabi | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function BuildersInAbuDhabi() {
    return <BuildersAbuDhabi />;
}
