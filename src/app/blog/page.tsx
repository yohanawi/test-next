import BlogClient from "./BlogClient";
import { Metadata } from "next";
import { GET_ALL_BLOGS } from "@/lib/queries";
import client from "@/lib/apolloClient";

const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

export async function generateMetadata(): Promise<Metadata> {
    try {
        // fetch blog listing & page meta
        const { data } = await client.query({
            query: GET_ALL_BLOGS,
            variables: { locale: "en" },
            fetchPolicy: "no-cache",
        });

        // try multiple possible shapes: blogDetailsPage or blogDetails
        const seo =
            data?.blogDetailsPage?.data?.[0]?.attributes?.meta_data ||
            data?.blogDetails?.data?.[0]?.attributes?.meta_data ||
            {};

        const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/Footer_logo.png";
        const structuredDataJson = seo.structuredData || null;

        return {
            title: seo.metaTitle || "XESS Events Blog | Insights, News & Updates",
            description: seo.metaDescription || "Explore the latest insights, news, and updates from XESS Events. Stay informed with our expert articles and event highlights.",
            metadataBase: new URL("https://xessevents.com"),
            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/blog",
            },
            keywords: seo.keywords || [],
            robots: seo.metaRobots || "index, follow",
            openGraph: {
                title: seo.metaTitle || "XESS Events Blog | Insights, News & Updates",
                description: seo.metaDescription || "Explore the latest insights, news, and updates from XESS Events. Stay informed with our expert articles and event highlights.",
                url: "https://xessevents.com/blog",
                type: "website",
                images: [imageUrl],
            },
            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "XESS Events Blog | Insights, News & Updates",
                description:
                    seo.metaDescription ||
                    "Explore the latest insights, news, and updates from XESS Events. Stay informed with our expert articles and event highlights.",
                images: [imageUrl],
            },
            // store structured JSON for page render (we'll inject JSON-LD manually in page)
            other: structuredDataJson ? { "x-structured-data": structuredDataJson } : {},
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);
        return {
            title: "Blogs | XESS Events",
            description: "Learn more about XESS Events and our story.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Blogs | XESS Events",
                description: "Learn more about XESS Events and our story.",
                url: "https://xessevents.com/blog",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Blogs | XESS Events",
                description: "Learn more about XESS Events and our story.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default async function BlogsPage() {
    // server fetch of blog data (ensures initial HTML includes posts for SEO)
    const locale = "en";
    const { data } = await client.query({
        query: GET_ALL_BLOGS,
        variables: { locale },
        fetchPolicy: "no-cache",
    });

    // attempt to support both shapes (blogDetailsPage meta vs blogDetails list)
    const pageMeta = data?.blogDetailsPage?.data?.[0]?.attributes || data?.blogDetails?.data?.[0]?.attributes || {};

    // blog list
    const blogDetails = data?.blogDetails?.data || [];

    // Structured data: Breadcrumb + ItemList for the blog index
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://xessevents.com/",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://xessevents.com/blog",
            },
        ],
    };

    // ItemList for blog posts (good for indexing). Keep items limited to a reasonable number if many posts.
    const itemListElements = blogDetails.slice(0, 50).map((b: any, i: number) => {
        const attr = b.attributes || {};
        const slug = attr.slug || "";
        const url = `https://xessevents.com/blog/${slug}`;
        return {
            "@type": "ListItem",
            position: i + 1,
            url,
            name: attr.title || `Article ${i + 1}`,
        };
    });

    const itemListSchema =
        itemListElements.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: itemListElements,
            }
            : null;

    // pass everything to the client component
    return (
        <>
            {/* Inject JSON-LD into server HTML so search engines pick it up */}
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
            />
            {itemListSchema && (
                <script type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
                />
            )}

            {/* If the CMS provided page-level structured data, inject it too */}
            {pageMeta?.meta_data?.structuredData && (
                <script type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(pageMeta.meta_data.structuredData),
                    }}
                />
            )}

            <BlogClient blogList={blogDetails} pageMeta={pageMeta} baseUrl={STRAPI_URL} />
        </>
    );
}
