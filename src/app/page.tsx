import dynamic from "next/dynamic";
import { Metadata } from 'next';
import Head from "next/head";

const HeroSection = dynamic(() => import("@/components/HeroSection"), { loading: () => <p>Loading...</p>, ssr: true, });

export async function generateMetadata(): Promise<Metadata> {
  const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

  try {
    const res = await fetch(`${STRAPI_URL}/api/homePages?populate=seo.metaImage`, {
      next: { revalidate: 60 }, // Optional: Incremental Static Regeneration
      cache: "force-cache",     // Ensures caching (you can use 'no-store' to disable)
    });




    const json = await res.json();
    const seo = json?.data?.attributes?.seo || {};

    const imageUrl = seo?.metaImage?.data?.attributes?.url
      ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}`
      : "https://xessevents.com/images/default-og.jpg";

    return {
      title: seo.metaTitle || "Exhibition Stand Contractors in Dubai | XESS Events",
      description: seo.metaDescription || "Top-rated exhibition stand contractors in Dubai",
      metadataBase: new URL("https://xessevents.com"),
      openGraph: {
        title: seo.metaTitle || "Exhibition Stand Contractors in Dubai | XESS Events",
        description: seo.metaDescription || "Top-rated exhibition stand contractors in Dubai",
        url: "https://xessevents.com",
        type: "website",
        images: [imageUrl],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.metaTitle || "Exhibition Stand Contractors in Dubai | XESS Events",
        description: seo.metaDescription || "Top-rated exhibition stand contractors in Dubai",
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Exhibition Stand Contractors in Dubai | XESS Events",
      description: "Top-rated exhibition stand contractors in Dubai",
      metadataBase: new URL("https://xessevents.com"),
      openGraph: {
        title: "Exhibition Stand Contractors in Dubai | XESS Events",
        description: "Top-rated exhibition stand contractors in Dubai",
        url: "https://xessevents.com",
        type: "website",
        images: ["https://xessevents.com/images/default-og.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        title: "Exhibition Stand Contractors in Dubai | XESS Events",
        description: "Top-rated exhibition stand contractors in Dubai",
        images: ["https://xessevents.com/images/default-og.jpg"],
      },
    };
  }
}

export default function Home() {
  return (
    <>
      <main>
        <section className="relative flex items-center justify-center text-white bg-gray-900">
          <HeroSection />
        </section>
      </main>
    </>
  );
}
