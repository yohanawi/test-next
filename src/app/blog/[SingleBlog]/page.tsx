import SingleBlogClient from "./SingleBlogClient";
import { Metadata } from "next";
import { GET_BLOG_DETAIL, GET_EXHIBITION_PAGE_DATA } from "@/lib/queries";
import client from "@/lib/apolloClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

function getSeoFromData(data: any, slug: string) {
  // Try multiple shapes used across your CMS (meta_data, metadata, etc.)
  const blog = data?.blogDetails?.data?.[0]?.attributes || null;
  const seo =
    blog?.meta_data ||
    blog?.metadata ||
    blog?.metaData ||
    data?.blogDetailsPage?.data?.[0]?.attributes?.meta_data ||
    {};
  return { seo, blog };
}

export async function generateMetadata(props: unknown): Promise<Metadata> {
  const params = (props as { params: { SingleBlog: string } }).params;
  const blogSlug = params.SingleBlog;

  if (!blogSlug || blogSlug === "undefined") {
    return {
      title: "Blog | XESS Events",
      description: "XESS Events blog",
      metadataBase: new URL("https://xessevents.com"),
    };
  }

  try {
    const { data } = await client.query({
      query: GET_BLOG_DETAIL,
      variables: { slug: blogSlug, locale: "en" },
      fetchPolicy: "no-cache",
    });

    const { seo } = getSeoFromData(data, blogSlug);
    const imageUrl = seo?.metaImage?.data?.attributes?.url
      ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
      : "https://xessevents.com/images/default-og.jpg";

    // Ensure metadataBase present
    return {
      title: seo.metaTitle || `XESS Events Blog`,
      description:
        seo.metaDescription ||
        "Explore insights, news and updates from XESS Events.",
      metadataBase: new URL("https://xessevents.com"),
      alternates: {
        canonical:
          seo.canonicalURL || `https://xessevents.com/blog/${encodeURIComponent(blogSlug)}`,
        languages: {
          en: seo.canonicalURL || `https://xessevents.com/blog/${encodeURIComponent(blogSlug)}`,
        },
      },
      keywords: seo.keywords || ["XESS", "events", "blog"],
      robots: seo.metaRobots || "index, follow",
      openGraph: {
        title: seo.metaTitle || `XESS Events Blog`,
        description:
          seo.metaDescription ||
          "Explore insights, news and updates from XESS Events.",
        url: `https://xessevents.com/blog/${encodeURIComponent(blogSlug)}`,
        type: "article",
        images: [imageUrl],
      },
      twitter: {
        card: "summary_large_image",
        site: "@xessevents",
        title: seo.metaTitle || `XESS Events Blog`,
        description:
          seo.metaDescription ||
          "Explore insights, news and updates from XESS Events.",
        images: [imageUrl],
      },
      other: seo?.structuredData ? { "x-structured-data": seo.structuredData } : {},
    };
  } catch (err) {
    console.error("generateMetadata error:", err);
    return {
      title: "Blog | XESS Events",
      description: "XESS Events blog",
      metadataBase: new URL("https://xessevents.com"),
    };
  }
}

export default async function SingleBlogPage(props: unknown) {
  const params = (props as { params: { SingleBlog: string } }).params;
  const blogSlug = params?.SingleBlog;

  if (!blogSlug || blogSlug === "undefined") {
    notFound();
  }

  // Fetch blog detail + recent posts (from same query), and exhibition data used by client
  try {
    const [blogRes, exhibitionRes] = await Promise.all([
      client.query({
        query: GET_BLOG_DETAIL,
        variables: { slug: blogSlug, locale: "en" },
        fetchPolicy: "no-cache",
      }),
      client.query({
        query: GET_EXHIBITION_PAGE_DATA,
        variables: { locale: "en" },
        fetchPolicy: "no-cache",
      }),
    ]);

    const blogData = blogRes?.data?.blogDetails?.data || [];
    const hasData = Array.isArray(blogData) && blogData.length > 0;
    if (!hasData) {
      notFound();
    }

    const blogDetail = blogData[0]?.attributes || {};
    // recentPosts may be returned in the same response (depending on your query)
    const recentPosts = blogRes?.data?.recentPosts?.data || [];

    const exhibitionData = exhibitionRes?.data || {};
    const mainExhibition = exhibitionData?.exhibitionPages?.data?.[0]?.attributes || {};

    // Prepare JSON-LD: BreadcrumbList + BlogPosting (server-injected)
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://xessevents.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://xessevents.com/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: blogDetail?.title || blogSlug,
          item: `https://xessevents.com/blog/${encodeURIComponent(blogSlug)}`,
        },
      ],
    };

    // BlogPosting schema
    const blogPosting: any = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blogDetail?.title || "",
      description: (blogDetail?.meta_description || blogDetail?.excerpt) || "",
      datePublished: blogDetail?.publishedAt || blogDetail?.createdAt || undefined,
      dateModified: blogDetail?.updatedAt || undefined,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://xessevents.com/blog/${encodeURIComponent(blogSlug)}`,
      },
      author: {
        "@type": "Person",
        name:
          blogDetail?.author?.data?.attributes?.name ||
          blogDetail?.authorName ||
          "Xess Events Team",
      },
      image:
        blogDetail?.HeroSec?.bgImage?.data?.attributes?.url
          ? `${STRAPI_URL}${blogDetail.HeroSec.bgImage.data.attributes.url}`
          : undefined,
    };

    return (
      <>
        {/* JSON-LD injections for crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
        />

        {/* If CMS provided structured data (page-level), inject that too */}
        {blogDetail?.meta_data?.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(blogDetail.meta_data.structuredData),
            }}
          />
        )}

        <SingleBlogClient
          blogDetail={blogDetail}
          recentPosts={recentPosts}
          exhibitionData={mainExhibition}
          baseUrl={STRAPI_URL}
        />
      </>
    );
  } catch (err) {
    console.error("SingleBlogPage fetch error:", err);
    notFound();
  }
}
