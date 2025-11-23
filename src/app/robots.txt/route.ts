// src/app/robots.txt/route.ts

export function GET() {
  const isProduction = process.env.NODE_ENV === "production";

  // In production → allow Google to crawl everything
  // In development  → block crawling
  const content = ` 
                    User-agent: * 
                    ${isProduction ? "Allow: /" : "Disallow: /"}

                    Sitemap: https://xessevents.com/sitemap.xml
                    Host: https://xessevents.com
  `.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
