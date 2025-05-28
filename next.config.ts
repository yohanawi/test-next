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

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots_Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
