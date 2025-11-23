import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";
import client from "@/lib/apolloClient";
import { GET_PRIVACY_POLICY } from "@/lib/queries";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xessevents.com";

export async function generateMetadata(): Promise<Metadata> {
    const title = "Privacy Policy | XESS Events";
    const description = "Discover how XESS Events handles your data responsibly. Read our privacy policy to learn about data collection, usage, protection, and your rights.";
    const imageUrl = `${SITE_URL}/images/Footer_logo.png`;

    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: `${SITE_URL}/privacy`,
            languages: { en: `${SITE_URL}/privacy` }
        },
        robots: "index, follow",
        openGraph: { title, description, url: `${SITE_URL}/privacy`, type: "website", images: [imageUrl] },
        twitter: { card: "summary_large_image", site: "@xessevents", title, description, images: [imageUrl] },
        other: { author: "Xess Events Team", publisher: "Xess Events" },
    };
}

export default async function Privacy() {
    const { data } = await client.query({ query: GET_PRIVACY_POLICY, variables: { locale: "en" } });
    const privacyData = data?.privacyPolicy?.data?.attributes || {};
    return <PrivacyClient privacyData={privacyData} />;
}
