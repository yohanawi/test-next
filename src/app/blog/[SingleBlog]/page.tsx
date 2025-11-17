import { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";
import { GET_BLOG_DETAIL } from "@/lib/queries";
import client from "@/lib/apolloClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: unknown): Promise<Metadata> {
    const params = (props as { params: { SingleBlog: string } }).params;
    const blogSlug = params.SingleBlog;
    const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

    try {
        const { data } = await client.query({ query: GET_BLOG_DETAIL, variables: { slug: blogSlug, locale: "en" }, });
        const seo = data?.blogDetails?.data?.[0]?.attributes?.metadata || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/Footer_logo.png";
        const structuredDataJson = seo.structuredData || null;

        return {
            title: seo.metaTitle || "XESS Events Blog | Insights, News & Updates",
            description: seo.metaDescription || "Explore the latest insights, news, and updates from XESS Events. Stay informed with our expert articles and event highlights.",
            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/blog/" + blogSlug,
                languages: {
                    "en": "https://xessevents.com/blog/" + blogSlug,
                },
            },
            keywords: seo.keywords || ["events", "blog", "XESS", "news", "updates"],
            robots: seo.metaRobots || "index, follow",
            openGraph: {
                title: seo.metaTitle || "XESS Events Blog | Insights, News & Updates",
                description: seo.metaDescription || "Explore the latest insights, news, and updates from XESS Events. Stay informed with our expert articles and event highlights.",
                url: "https://xessevents.com/blog/" + blogSlug,
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "XESS Events Blog | Insights, News & Updates",
                description: seo.metaDescription || "Explore the latest insights, news, and updates from XESS Events. Stay informed with our expert articles and event highlights.",
                images: [imageUrl],
            },
            other: {
                ...(structuredDataJson && { "application/ld+json": JSON.stringify(structuredDataJson) }),
                "author": "Xess Events Team",
                "publisher": "Xess Events",
            },
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Blogs | XESS Events",
            description: "Learn more about XESS Events and our story.",
            openGraph: {
                title: "Blogs | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/about-us",
                type: "website",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Blogs | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/default-og.jpg"],
            },
        };
    }
}

export default async function SingleBlogPage(props: unknown) {
    const params = (props as { params: { SingleBlog: string } }).params;
    const blogSlug = params?.SingleBlog;
    if (!blogSlug || blogSlug === "undefined") {
        notFound();
    }
    try {
        const { data } = await client.query({ query: GET_BLOG_DETAIL, variables: { slug: blogSlug, locale: "en" } });
        const hasData = Array.isArray(data?.blogDetails?.data) && data.blogDetails.data.length > 0;
        if (!hasData) {
            notFound();
        }
    } catch {
        notFound();
    }
    return <SingleBlogClient />;
}
