
import { Metadata } from "next";
import { redirect } from "next/navigation";
import client from "@/lib/apolloClient";
import { GET_CALENDAR_DETAIL } from "@/lib/queries";
import CalendarDetails from "./CalendarDetails";

// Next.js 15 PageProps has params as a Promise in the App Router
type RouteParams = { params: Promise<{ SingleCalendar: string }> };

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";
    const { SingleCalendar: slugRaw } = await params;
    const slug = (slugRaw || "").toLowerCase();

    const fallbackTitle = "Exhibition Calendar";
    const fallbackDescription = "Explore detailed information about this exhibition including dates, location, highlights, and more with XESS Events.";
    const defaultOg = `${SITE_URL}/images/default-og.jpg`;

    try {
        // Fetch the calendar details for metadata (server-side)
        const { data } = await client.query({
            query: GET_CALENDAR_DETAIL,
            variables: { slug, locale: "en" }, // Assuming default 'en' locale for metadata
            fetchPolicy: "no-cache",
        });

        const canonical = `${SITE_URL}/exhibition-calendar/${slug}`;

        // If no data is found, fall back to generic SEO but keep the page indexable
        const noData = !data?.calenDetails?.data?.length;
        if (noData) {
            return {
                title: { absolute: fallbackTitle },
                description: fallbackDescription,
                metadataBase: new URL(SITE_URL),
                alternates: { canonical },
                robots: {
                    index: true,
                    follow: true,
                    googleBot: {
                        index: true,
                        follow: true,
                        "max-image-preview": "large",
                        "max-snippet": -1,
                    },
                },
                openGraph: {
                    title: fallbackTitle,
                    description: fallbackDescription,
                    url: canonical,
                    type: "article",
                    siteName: "XESS Events",
                    images: [{ url: defaultOg }],
                },
                twitter: {
                    card: "summary_large_image",
                    title: fallbackTitle,
                    description: fallbackDescription,
                    images: [defaultOg],
                },
            };
        }

        const details = data?.calenDetails?.data?.[0]?.attributes;
        const heroTitle: string | undefined = details?.HeroSec?.title || details?.CalenCrd?.title;
        const rawDescription: string | undefined = details?.description;
        const imagePath: string | undefined = details?.CalenCrd?.logo?.data?.attributes?.url;
        const ogImage = imagePath ? `${STRAPI_URL}${imagePath}` : defaultOg;

        // Strip HTML tags and trim description length
        const cleanDesc = rawDescription
            ? rawDescription.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
            : fallbackDescription;

        // Build keywords from available fields
        const keywordSet = new Set<string>();
        const category = details?.CalenCrd?.category;
        const location = details?.CalenCrd?.location;
        if (category) keywordSet.add(String(category));
        if (location) keywordSet.add(String(location));
        details?.Listed?.forEach((t: { name?: string }) => t?.name && keywordSet.add(t.name));
        details?.Highlight?.HighLable?.forEach((t: { name?: string }) => t?.name && keywordSet.add(t.name));
        const keywords = Array.from(keywordSet);

        const pageTitle = `${heroTitle || fallbackTitle} - ${slug}`;
        const description = `${pageTitle} — ${cleanDesc}`.slice(0, 160);

        return {
            title: { absolute: pageTitle },
            description,
            keywords,
            metadataBase: new URL(SITE_URL),
            alternates: { canonical },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
            openGraph: {
                title: pageTitle,
                description,
                url: canonical,
                type: "article",
                siteName: "XESS Events",
                images: [{ url: ogImage }],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: pageTitle,
                description,
                images: [ogImage],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        const canonical = `${SITE_URL}/exhibition-calendar/${(slugRaw || "").toLowerCase()}`;
        return {
            title: { absolute: fallbackTitle },
            description: fallbackDescription,
            metadataBase: new URL(SITE_URL),
            alternates: { canonical },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
            openGraph: {
                title: fallbackTitle,
                description: fallbackDescription,
                url: canonical,
                type: "article",
                siteName: "XESS Events",
                images: [{ url: defaultOg }],
            },
            twitter: {
                card: "summary_large_image",
                title: fallbackTitle,
                description: fallbackDescription,
                images: [defaultOg],
            },
        };
    }
}

export default async function Page({ params }: RouteParams) {
    const { SingleCalendar: slugRaw } = await params;
    const normalized = slugRaw.toLowerCase();
    if (slugRaw !== normalized) {
        redirect(`/exhibition-calendar/${normalized}`);
    }
    return <CalendarDetails />;
}
