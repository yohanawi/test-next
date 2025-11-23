import { Metadata } from "next";
import TermsClient from "./TermsClient";
import client from "@/lib/apolloClient";
import { GET_TERMS_AND_CONDITIONS } from "@/lib/queries";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";

export async function generateMetadata(): Promise<Metadata> {
    const title = "Terms & Conditions | XESS Events";
    const description = "Read the Terms & Conditions of XESS Events to understand our policies, guidelines, and how we ensure a seamless experience for our users.";
    const imageUrl = `${SITE_URL}/uploads/Footer_logo_0d3a81376a.png`;
 
    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: `${SITE_URL}/terms`,
            languages: { en: `${SITE_URL}/terms` }
        },
        robots: "index, follow",
        openGraph: { title, description, url: `${SITE_URL}/terms`, type: "website", images: [imageUrl] },
        twitter: { card: "summary_large_image", site: "@xessevents", title, description, images: [imageUrl] },
        other: { author: "Xess Events Team", publisher: "Xess Events" },
    };
}

export default async function Terms() {
    const { data } = await client.query({ query: GET_TERMS_AND_CONDITIONS, variables: { locale: "en" } });
    const termsData = data?.termsAndCondition?.data?.attributes || {};
    return <TermsClient termsData={termsData} />;
}
