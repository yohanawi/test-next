import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App Router already enables SWC minification; explicit swcMinify is deprecated in Next 15.
  reactStrictMode: true,
  images: {
    domains: ["cms.xessevents.com"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  // Removed i18n config: single-locale App Router site. If you add more locales, migrate to the App Router i18n pattern.

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
      {
        source: "/audio-visual-and-furniture-rental-for-events-in-dubai",
        destination: "/event-production",
        permanent: true,
      },
      {
        source: "/request-free-design",
        destination: "/free-design",
        permanent: true,
      },
      {
        source: "/exhibition-stand-builders-in-abu-dubai",
        destination: "/exhibition-stand-builders-in-abu-dhabi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
