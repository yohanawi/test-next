import { Metadata } from "next";
import FitOutClient from "./FitOutClient";

export const metadata: Metadata = {
    title: "Commercial interior fit-out | XESS Events",
    description: "Transform your workspace with XESS Events' bespoke commercial fit-out: smart design, premium finishes, and turnkey delivery that elevates brand and productivity.",
    metadataBase: new URL("https://xessevents.com"),
    alternates: {
        canonical: "https://xessevents.com/fit-out",
        languages: {
            en: "https://xessevents.com/fit-out",
        },
    },
    keywords: [],
    robots: "index, follow",
    openGraph: {
        title: "Commercial interior fit-out | XESS Events",
        description: "Transform your workspace with XESS Events' bespoke commercial fit-out: smart design, premium finishes, and turnkey delivery that elevates brand and productivity.",
        url: "https://xessevents.com/fit-out",
        type: "website",
        images: ["/images/Footer_logo.png"],
    },
    twitter: {
        card: "summary_large_image",
        site: "@xessevents",
        title: "Commercial interior fit-out | XESS Events",
        description: "Transform your workspace with XESS Events' bespoke commercial fit-out: smart design, premium finishes, and turnkey delivery that elevates brand and productivity.",
        images: ["/images/Footer_logo.png"],
    },
    other: {
        author: "Xess Events Team",
        publisher: "Xess Events",
    },
};

export default function FitOut() {
    return <FitOutClient />;
}
