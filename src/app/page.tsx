import dynamic from "next/dynamic";
import { Metadata } from 'next';

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
    const res = await fetch(`${STRAPI_URL}/api/homePages?populate=seo.metaImage`, {
      next: { revalidate: 60 },
      cache: "force-cache",
    });

    const json = await res.json();
    const seo = json?.data?.attributes?.seo || {};
    const imageUrl = seo?.metaImage?.data?.attributes?.url ? `${STRAPI_URL}${seo.metaImage.data.attributes.url}` : "https://xessevents.com/images/default-og.jpg";

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
        <h1></h1>
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
