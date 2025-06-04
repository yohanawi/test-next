import { GET_HOME_PAGE_DATA } from "@/lib/queries";
import client from "@/lib/apolloClient";
import dynamic from "next/dynamic";
import { Metadata } from 'next';
import StructuredData from "@/components/StructuredData";

const HeroSection = dynamic(() => import("@/components/HeroSection"), { loading: () => <p>Loading...</p>, ssr: true, });
const HomeSection4 = dynamic(() => import("@/components/HomeSection4"), { loading: () => <p>Loading...</p>, ssr: true, });
const HomeSection5 = dynamic(() => import("@/components/HomeSection5"), { loading: () => <p>Loading...</p>, ssr: true, });
const Resources = dynamic(() => import("@/components/Resources"), { loading: () => <p>Loading...</p>, ssr: true, });
const HomeSection2 = dynamic(() => import("@/components/HomeSection2"), { loading: () => <p>Loading...</p>, ssr: true, });
const Testimonial = dynamic(() => import("@/components/Testimonial"), { loading: () => <p>Loading...</p>, ssr: true, });
const HomeEventSection = dynamic(() => import("@/components/HomeEventSection"), { loading: () => <p>Loading...</p>, ssr: true, });
const HomeTrusted = dynamic(() => import("@/components/HomeTrusted"), { loading: () => <p>Loading...</p>, ssr: true, });
const TeamSection = dynamic(() => import("@/components/TeamSection"), { loading: () => <p>Loading...</p>, ssr: true, });
const ContactForm = dynamic(() => import("@/components/Contactform"), { loading: () => <p>Loading...</p>, ssr: true, });

export async function generateMetadata(): Promise<Metadata> {
  const STRAPI_URL = process.env.STRAPI_URL || "https://cms.xessevents.com";

  try {

    const { data } = await client.query({ query: GET_HOME_PAGE_DATA, variables: { locale: "en" }, });
    const seo = data?.homePages?.data?.[0]?.attributes?.meta_data || {};
    const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";
    const structuredDataJson = seo.structuredData || null;

    return {
      title: seo.metaTitle || "Xess Events | Premier Event Planning & Management | Home",
      description: seo.metaDescription || "Top-rated exhibition stand contractors in Dubai",
      metadataBase: new URL("https://xessevents.com"),
      alternates: {
        canonical: seo.canonicalURL || "https://xessevents.com",
        languages: {
          "en": "https://xessevents.com",
        },
      },
      keywords: seo.keywords || [],
      robots: seo.metaRobots || "index, follow",
      openGraph: {
        title: seo.metaTitle || "Xess Events | Premier Event Planning & Management | Home",
        description: seo.metaDescription || "Top-rated exhibition stand contractors in Dubai",
        url: "https://xessevents.com",
        type: "website",
        images: [imageUrl],
      },
      twitter: {
        card: "summary_large_image",
        site: "@xessevents",
        title: seo.metaTitle || "Xess Events | Premier Event Planning & Management | Home",
        description: seo.metaDescription || "Top-rated exhibition stand contractors in Dubai",
        images: [imageUrl],
      },
      other: {
        ...(structuredDataJson && { "application/ld+json": JSON.stringify(structuredDataJson), }),
        "author": "Xess Events Team",
        "publisher": "Xess Events",
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Xess Events | Premier Event Planning & Management | Home",
      description: "Top-rated exhibition stand contractors in Dubai",
      metadataBase: new URL("https://xessevents.com"),
      alternates: {
        canonical: "https://xessevents.com",
      },
      keywords: ["exhibition", "events", "dubai", "xess"],
      robots: "index, follow",
      openGraph: {
        title: "Xess Events | Premier Event Planning & Management | Home",
        description: "Top-rated exhibition stand contractors in Dubai",
        url: "https://xessevents.com",
        type: "website",
        images: ["https://xessevents.com/images/default-og.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        site: "@xessevents",
        title: "Xess Events | Premier Event Planning & Management | Home",
        description: "Top-rated exhibition stand contractors in Dubai",
        images: ["https://xessevents.com/images/default-og.jpg"],
      },
    };
  }
}


export default async function Home() {
  const { data } = await client.query({ query: GET_HOME_PAGE_DATA, variables: { locale: "en" }, });
  const structuredData = data?.homePages?.data?.[0]?.attributes?.meta_data?.structuredData || null;
  return (
    <>
      <main>
        <h1 className="absolute text-transparent">Xess Events</h1>
        {structuredData && <StructuredData data={structuredData} />}
        <section className="relative flex items-center justify-center text-white bg-gray-900">
          <HeroSection />
        </section>
        <HomeSection4 />
        <HomeSection5 />
        <Resources />
        <HomeSection2 />
        <Testimonial />
        <HomeEventSection />
        <HomeTrusted />
        <TeamSection />

        <section className="relative w-full">
          <ContactForm />
        </section>
      </main>
    </>
  );
}
