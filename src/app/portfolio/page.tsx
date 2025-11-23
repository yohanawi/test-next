import PortFolioClient from "./PortFolioClient";
import { Metadata } from "next";
import {
    GET_PORTFOLIO_PAGE,
    GET_PORTFOLIO_IMAGES,
    GET_PORTFOLIO_CATEGORY,
} from "@/lib/queries";
import client from "@/lib/apolloClient";

const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data } = await client.query({
            query: GET_PORTFOLIO_PAGE,
            variables: { locale: "en" },
            fetchPolicy: "no-cache",
        });

        const seo = data?.portfolioPages?.data?.[0]?.attributes?.meta_data || {};
        const imageUrl = seo?.metaImage?.data?.attributes?.url
            ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
            : "https://xessevents.com/images/Footer_logo.png";

        const structuredDataJson = seo.structuredData || null;

        return {
            title: seo.metaTitle || "Portfolio | XESS Events",
            description:
                seo.metaDescription ||
                "Explore our portfolio of high-quality exhibition stand projects.",
            metadataBase: new URL("https://xessevents.com"),

            alternates: {
                canonical: seo.canonicalURL || "https://xessevents.com/portfolio",
                languages: { en: "https://xessevents.com/portfolio" }, // multi-language untouched
            },

            keywords: seo.keywords || [],
            robots: seo.metaRobots || "index, follow",

            openGraph: {
                title: seo.metaTitle || "Portfolio | XESS Events",
                description:
                    seo.metaDescription ||
                    "Explore our portfolio of high-quality exhibition stand projects.",
                url: "https://xessevents.com/portfolio",
                type: "website",
                images: [imageUrl],
            },

            twitter: {
                card: "summary_large_image",
                site: "@xessevents",
                title: seo.metaTitle || "Portfolio | XESS Events",
                description:
                    seo.metaDescription ||
                    "Explore our portfolio of high-quality exhibition stand projects.",
                images: [imageUrl],
            },

            // This does NOT inject JSON-LD — only stored for later use in page component
            other: structuredDataJson
                ? { "x-structured-data": structuredDataJson }
                : {},
        };
    } catch (error) {
        console.error("SEO fetch failed:", error);

        return {
            title: "Portfolio | XESS Events",
            description:
                "Explore our portfolio of high-quality exhibition stand projects.",
            metadataBase: new URL("https://xessevents.com"),
            openGraph: {
                title: "Portfolio | XESS Events",
                description:
                    "Explore our portfolio of high-quality exhibition stand projects.",
                url: "https://xessevents.com/portfolio",
                type: "website",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
            twitter: {
                card: "summary_large_image",
                title: "Portfolio | XESS Events",
                description:
                    "Explore our portfolio of high-quality exhibition stand projects.",
                images: ["https://xessevents.com/images/Footer_logo.png"],
            },
        };
    }
}

export default async function PortfolioPage() {
    const locale = "en";

    const [pageRes, imagesRes, categoriesRes] = await Promise.all([
        client.query({
            query: GET_PORTFOLIO_PAGE,
            variables: { locale },
            fetchPolicy: "no-cache",
        }),
        client.query({
            query: GET_PORTFOLIO_IMAGES,
            variables: { locale },
            fetchPolicy: "no-cache",
        }),
        client.query({
            query: GET_PORTFOLIO_CATEGORY,
            variables: { locale },
            fetchPolicy: "no-cache",
        }),
    ]);

    const pageData = pageRes?.data || {};
    const imgData = imagesRes?.data || {};
    const categoryData = categoriesRes?.data || {};

    const portfolioPage =
        pageData?.portfolioPages?.data?.[0]?.attributes || {};

    const structuredDataJson =
        portfolioPage?.meta_data?.structuredData || null;

    // Breadcrumb JSON-LD
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
                name: "Portfolio",
                item: "https://xessevents.com/portfolio",
            },
        ],
    };

    return (
        <>
            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
            />

            {/* Structured data from CMS */}
            {structuredDataJson && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredDataJson),
                    }}
                />
            )}

            <PortFolioClient
                pageData={pageData}
                imgData={imgData}
                categoryData={categoryData}
                baseUrl={STRAPI_URL}
            />
        </>
    );
}
