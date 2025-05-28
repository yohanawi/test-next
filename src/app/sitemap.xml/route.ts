// app/sitemap.xml/route.ts

export async function GET() {
  const baseUrl = "https://test-next-ebon-gamma.vercel.app";

  const blogRoutes = await getBlogRoutesFromCMS();

  //   const staticRoutes = ["", "/about", "/contact"];

  const urls = [
    // ...staticRoutes.map((route) => `${baseUrl}${route}`),
    ...blogRoutes.map((slug) => `${baseUrl}/blogs/${slug}`),
  ];

  const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls
              .map(
                (url) => `
                    <url>
                        <loc>${url}</loc>
                        <changefreq>weekly</changefreq>
                        <priority>0.7</priority>
                    </url>`
              )
              .join("")}
        </urlset>`.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

async function getBlogRoutesFromCMS(): Promise<string[]> {
  return ["blog-post-1", "blog-post-2"];
}
