import { Metadata } from "next";
import { redirect } from "next/navigation";
import client from "@/lib/apolloClient"; // Make sure this is imported
import { GET_CALENDAR_DETAIL } from "@/lib/queries";
import CalendarDetails from "./CalendarDetails";
import { notFound } from "next/navigation";

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
        const { data } = await client.query({
            query: GET_CALENDAR_DETAIL,
            variables: { slug, locale: "en" },
            fetchPolicy: "no-cache",
        });

        const canonical = `${SITE_URL}/exhibition-calendar/${slug}`;
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
        const cleanDesc = rawDescription ? rawDescription.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : fallbackDescription;
        const pageTitle = `${heroTitle || fallbackTitle} - ${slug}`;
        const description = `${pageTitle} — ${cleanDesc}`.slice(0, 160);

        return {
            title: { absolute: pageTitle },
            description,
            keywords: [],
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
        return {
            title: { absolute: fallbackTitle },
            description: fallbackDescription,
            metadataBase: new URL(SITE_URL),
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: fallbackTitle,
                description: fallbackDescription,
                url: `${SITE_URL}/exhibition-calendar/${slug}`,
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
    try {
        const { data } = await client.query({
            query: GET_CALENDAR_DETAIL,
            variables: { slug: normalized, locale: "en" },
            fetchPolicy: "no-cache",
        });
        const hasData = Array.isArray(data?.calenDetails?.data) && data.calenDetails.data.length > 0;
        if (!hasData) {
            notFound();
        }
    } catch {
        notFound();
    }
    return <CalendarDetails slug={normalized} locale="en" />;
}
