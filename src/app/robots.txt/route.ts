// app/robots.txt/route.ts

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";

  const content = ` 
  User-agent: * ${isProduction ? "Disallow:" : "Disallow: /"}
  Sitemap: https://xessevents.com/sitemap.xml 
    `.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
