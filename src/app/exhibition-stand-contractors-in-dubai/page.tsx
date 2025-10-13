import { Metadata } from "next";
import ContractorsDubai from "./ContractorsDubai";

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
            title: seo.metaTitle || "Exhibition Stand Contractors in Dubai | XESS Events",
            description: seo.metaDescription || "Discover top exhibition stand contractors in Dubai. XESS Events delivers innovative stand design, fabrication, and installation for exhibitions and trade shows.",
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Contractors in Dubai | XESS Events",
                description: seo.metaDescription || "Discover top exhibition stand contractors in Dubai. XESS Events delivers innovative stand design, fabrication, and installation for exhibitions and trade shows.",
                url: "https://xessevents.com/exhibition-stand-contractors-in-dubai",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                title: seo.metaTitle || "Exhibition Stand Contractors in Dubai | XESS Events",
                description: seo.metaDescription || "Discover top exhibition stand contractors in Dubai. XESS Events delivers innovative stand design, fabrication, and installation for exhibitions and trade shows.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Stand Contractors in Dubai | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Contractors in Dubai | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Contractors in Dubai | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function ContractorsInDubai() {
    return <ContractorsDubai />;
}
