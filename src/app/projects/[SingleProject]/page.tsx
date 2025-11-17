import { Metadata } from "next";
import client from "@/lib/apolloClient";
import SingleProject from "./SingleProjectClient";
import { GET_PROJECT } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: unknown): Promise<Metadata> {
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";
    const params = (props as { params: { SingleProject: string } }).params;
    const SingleProjectData = params.SingleProject;

    if (!SingleProjectData || SingleProjectData === "undefined") {
        notFound();
    }

    if (!SingleProjectData) {
        notFound();
    }

    try {
        const { data } = await client.query({ query: GET_PROJECT, variables: { slug: SingleProjectData, locale: "en" }, });
        const seo = data?.projects?.data?.[0]?.attributes?.metadata || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";

        return {
            title: seo.metaTitle || "Project Details | XESS Events",
            description: seo.metaDescription || "Discover detailed information about this project by XESS Events.",
            openGraph: {
                title: seo.metaTitle || "Project Details | XESS Events",
                description: seo.metaDescription || "Discover detailed information about this project by XESS Events.",
                url: `https://xessevents.com/projects/${SingleProjectData}`,
                type: "article",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                title: seo.metaTitle || "Project Details | XESS Events",
                description: seo.metaDescription || "Discover detailed information about this project by XESS Events.",
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Projects | XESS Events",
            description: "Projects Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Projects | XESS Events",
                description: "Projects Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Projects | XESS Events",
                description: "Projects Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default async function ProjectPage(props: unknown) {
    const params = (props as { params: { SingleProject: string } }).params;
    const slugRaw = params?.SingleProject;
    if (!slugRaw || slugRaw === "undefined") {
        notFound();
    }
    const normalized = slugRaw.toLowerCase();
    if (slugRaw !== normalized) {
        redirect(`/projects/${normalized}`);
    }
    try {
        const { data } = await client.query({ query: GET_PROJECT, variables: { slug: normalized, locale: "en" } });
        const hasData = Array.isArray(data?.projects?.data) && data.projects.data.length > 0;
        if (!hasData) {
            notFound();
        }
    } catch {
        notFound();
    }
    return <SingleProject />;
}
