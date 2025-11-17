"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";

const SITE = "https://xessevents.com";

export default function CanonicalLink() {
  const pathname = usePathname() || "/";
  // Ensure no trailing slash except root
  const normalized = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const href = `${SITE}${normalized}`;
  return (
    <Head>
      <link rel="canonical" href={href} />
    </Head>
  );
}
