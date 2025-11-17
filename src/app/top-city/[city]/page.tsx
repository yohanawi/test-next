import { Metadata } from "next";
import client from "@/lib/apolloClient";
import CitiesClient from "./CitiesClient";
import { GET_CITY_DETAIL } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: unknown): Promise<Metadata> {
    const params = (props as { params: { city: string } }).params;
    const citySlug = params.city;
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";
    try {
        const { data } = await client.query({ query: GET_CITY_DETAIL, variables: { slug: citySlug, locale: "en" }, });
        const seo = data?.cityDetails?.data?.[0]?.attributes?.metadata || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";

        return {
            title: seo.metaTitle || `${data?.cityDetails?.data?.[0]?.attributes?.name || citySlug} | Exhibition Stand | XESS Events`,
            description: seo.metaDescription || `Discover exhibition stands and details for ${data?.cityDetails?.data?.[0]?.attributes?.name || citySlug} at XESS Events.`,
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: seo.metaTitle || `${data?.cityDetails?.data?.[0]?.attributes?.name || citySlug} | Exhibition Stand | XESS Events`,
                description: seo.metaDescription || `Discover exhibition stands and details for ${data?.cityDetails?.data?.[0]?.attributes?.name || citySlug} at XESS Events.`,
                url: `https://xessevents.com/top-city/${citySlug}`,
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                title: seo.metaTitle || `${data?.cityDetails?.data?.[0]?.attributes?.name || citySlug} | Exhibition Stand | XESS Events`,
                description: seo.metaDescription || `Discover exhibition stands and details for ${data?.cityDetails?.data?.[0]?.attributes?.name || citySlug} at XESS Events.`,
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition City | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition City | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition City | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default function CitysClient() {
    return <CitiesClient />;
}
