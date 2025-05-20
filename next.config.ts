import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cms.xessevents.com"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default nextConfig;
