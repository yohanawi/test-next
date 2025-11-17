import { Metadata } from "next";
import BuildersSharjah from "./BuildersSharjah";

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
            title: seo.metaTitle || "Exhibition Stand Builders in Sharjah | XESS Events",
            description: seo.metaDescription || "XESS Events plans, builds, and assembles premium exhibition stands in Sharjah . Creative booth designs that attract audiences and elevate your brand.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: "https://xessevents.com/exhibition-stand-builders-in-sharjah",
                languages: {
                    "en-US": "https://xessevents.com/exhibition-stand-builders-in-sharjah",
                },
            },
            openGraph: {
                title: seo.metaTitle || "Exhibition Stand Builders in Sharjah | XESS Events",
                description: seo.metaDescription || "XESS Events plans, builds, and assembles premium exhibition stands in Sharjah . Creative booth designs that attract audiences and elevate your brand.",
                url: "https://xessevents.com/exhibition-stand-builders-in-sharjah",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Exhibition Stand Builders in Sharjah | XESS Events",
                description: seo.metaDescription || "XESS Events plans, builds, and assembles premium exhibition stands in Sharjah . Creative booth designs that attract audiences and elevate your brand.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Stand Builders in Sharjah | XESS Events",
            description: "XESS Events plans, builds, and assembles premium exhibition stands in Sharjah . Creative booth designs that attract audiences and elevate your brand.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Stand Builders in Sharjah | XESS Events",
                description: "XESS Events plans, builds, and assembles premium exhibition stands in Sharjah . Creative booth designs that attract audiences and elevate your brand.",
                url: "https://xessevents.com/exhibition-stand-builders-in-sharjah",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Stand Builders in Sharjah | XESS Events",
                description: "XESS Events plans, builds, and assembles premium exhibition stands in Sharjah . Creative booth designs that attract audiences and elevate your brand.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default function BuildersInSharjah() {
    return <BuildersSharjah />;
}
