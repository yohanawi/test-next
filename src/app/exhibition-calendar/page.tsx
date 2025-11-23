// File: src/app/exhibition-calendar/page.tsx

import { Metadata } from "next";
import CalendarClient from "./CalendarClient";
import { GET_CALENDER, GET_ALL_CALENDAR } from "@/lib/queries";
import client from "@/lib/apolloClient";

// Revalidate interval for ISR (seconds). Set to false if you want pure SSR every request.
export const revalidate = 60; // change as required

export async function generateMetadata(): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const { data } = await client.query({ query: GET_CALENDER, variables: { locale: "en" }, fetchPolicy: 'no-cache' });
        const seo = data?.calenders?.data?.[0]?.attributes?.meta_data || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";
        const structuredDataJson = seo.structuredData || null;

        return {
            title: seo.metaTitle || "Exhibition Calendar | XESS Events",
            description: seo.metaDescription || "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/exhibition-calendar",
                languages: { en: "https://xessevents.com/exhibition-calendar" },
            },
            keywords: seo.keywords || [],
            robots: seo.metaRobots || "index, follow",
            openGraph: {
                title: seo.metaTitle || "Exhibition Calendar | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/exhibition-calendar",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Exhibition Calendar | XESS Events",
                description: seo.metaDescription || "Learn more about XESS Events and our story.",
                images: [imageUrl],
            },
            other: {
                ...(structuredDataJson && { "application/ld+json": JSON.stringify(structuredDataJson) }),
                author: "Xess Events Team",
                publisher: "Xess Events",
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Exhibition Calendar | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Exhibition Calendar | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/exhibition-calendar",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Exhibition Calendar | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

// Server component: fetches required data and passes to client component as props.
export default async function ExhibitionCalendarPage() {
    // Static route: no dynamic params available here
    const locale = "en";
    try {
        // Fetch calendar SEO / page data
        const calRes = await client.query({ query: GET_CALENDER, variables: { locale }, fetchPolicy: 'no-cache' });

        // Fetch all calendar items
        const allCalRes = await client.query({ query: GET_ALL_CALENDAR, variables: { locale }, fetchPolicy: 'no-cache' });

        const calendarData = calRes?.data?.calenders?.data?.[0]?.attributes || {};
        const heroSection = calendarData?.HeroSec || {};
        const allCalendar = allCalRes?.data?.calenDetails?.data || [];

        // Pre-compute any server-side transforms (optional)
        // For example, normalize image URLs
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

        const normalizeLogo = (item: any) => {
            const logoUrl = item?.attributes?.CalenCrd?.logo?.data?.attributes?.url;
            return logoUrl ? `${baseUrl}${logoUrl}` : null;
        };

        const preppedAllCalendar = allCalendar.map((item: any) => ({
            ...item,
            __logoUrl: normalizeLogo(item),
        }));

        const props = {
            calendarData,
            heroSection,
            allCalendar: preppedAllCalendar,
            locale,
            baseUrl,
        };

        return <CalendarClient {...props} />;
    } catch (err) {
        console.error("Server fetch error in exhibition-calendar page:", err);
        // Return client with empty data so UI can render error state client-side
        return <CalendarClient calendarData={{}} heroSection={{}} allCalendar={[]} locale="en" baseUrl={process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com"} />;
    }
}

