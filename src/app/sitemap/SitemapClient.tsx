// src/app/sitemap/SitemapClient.tsx
import Link from "next/link";

type UrlItem = {
    loc: string;
    path: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
};

interface SitemapProps {
    sitemap: UrlItem[];
}

// Function to render the sitemap content
const SitemapClient = ({ sitemap }: SitemapProps) => {
    return (
        <div className="min-h-screen p-8 py-20 bg-white md:py-36">
            <main className="max-w-5xl px-4 py-10 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-black">HTML Sitemap</h1>

                {!sitemap?.length && (
                    <p className="mb-8 text-gray-600">No sitemap data available at the moment.</p>
                )}

                {sitemap && (
                    <>
                        <section className="mb-10">
                            <h2 className="mb-2 text-xl font-semibold text-black">Main Pages</h2>
                            <ul className="grid gap-2 pl-5 list-disc sm:grid-cols-2">
                                {sitemap.map((item) => (
                                    <li key={item.loc}>
                                        <Link href={item.loc} className="text-blue-600 hover:underline">
                                            {decodeURIComponent(item.path.replace(/^\//, "")).replace(/-/g, " ").trim() || "Home"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Additional sections for blogs, legal pages, etc., can be added here */}
                    </>
                )}
            </main>
        </div>
    );
};

export default SitemapClient;
