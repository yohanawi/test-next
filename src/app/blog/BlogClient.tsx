"use client";

import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/Contactform";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type BlogAttr = {
    title: string;
    slug: string;
    createdAt: string;
    excerpt?: string | null;
    HeroSec?: {
        bgImage?: {
            data?: {
                attributes?: {
                    url?: string;
                    alternativeText?: string | null;
                };
            };
        };
    };
};

type BlogItem = {
    id?: string | number;
    attributes: BlogAttr;
};

export default function BlogClient({
    blogList = [],
    pageMeta = {},
    baseUrl = "https://cms.xessevents.com",
}: {
    blogList?: BlogItem[];
    pageMeta?: any;
    baseUrl?: string;
}) {
    // posts per page shown initially for SEO — initial HTML (server) contains these posts
    const initialPerPage = 6;
    const [perPage, setPerPage] = useState(initialPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    // derived list for display / pagination (client-side progressive loading)
    const normalizedList = useMemo(
        () =>
            Array.isArray(blogList)
                ? blogList.map((b: any) => ({ id: b.id || b.attributes?.slug, attributes: b.attributes })) : [],
        [blogList]
    );

    const totalItems = normalizedList.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    // displayed slice for the current page
    const displayed = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return normalizedList.slice(start, start + perPage);
    }, [normalizedList, currentPage, perPage]);

    // "Load more" increases perPage so more posts are present in the HTML upon first render (server passed the data).
    const loadMore = () => {
        setPerPage((p) => p + initialPerPage);
    };

    // sanitize simple HTML coming from CMS (keep only safe tags)
    const sanitizeHtml = (html: string | null | undefined) => {
        if (!html) return "";
        // strip script tags and inline font-family (keeps common tags like p, br, strong, em)
        let cleaned = String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
        cleaned = cleaned.replace(/font-family:[^;"']*;?/gi, "");
        return cleaned;
    };

    // Improve accessibility: focus to top on page change
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentPage]);

    // helper for formatted date
    const formatDate = (iso?: string) =>
        iso
            ? new Date(iso).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "";

    return (
        <>
            {/* HERO — use CMS if available, otherwise fallback */}
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center justify-center text-center">
                <Image src="/images/Banner.jpg" alt={pageMeta?.HeroSec?.title || "Blog banner"} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70" />
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="text-3xl font-semibold text-white uppercase md:text-4xl lg:text-5xl">
                        {pageMeta?.HeroSec?.title || pageMeta?.metaTitle || "Exhibition Blogs"}
                    </h1>
                    <div className="flex justify-center pt-2 text-xs text-white md:text-sm">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/blog" className="px-4 uppercase">{pageMeta?.metaTitle || "exhibition Blogs"}</Link>
                    </div>
                </div>
            </section>

            {/* LISTING */}
            <section className="py-10 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="lg:mx-44 lg:py-8">
                        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
                            {displayed.map((item, idx) => {
                                const attr = item.attributes || ({} as BlogAttr);
                                const title = attr.title || "Untitled";
                                const slug = attr.slug || "";
                                const createdAt = attr.createdAt || "";
                                const heroUrl = attr.HeroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${attr.HeroSec.bgImage.data.attributes.url}` : "/images/default-blog.jpg";
                                const alt = attr.HeroSec?.bgImage?.data?.attributes?.alternativeText || `${title} — XESS Events blog`;

                                return (
                                    <article key={item.id || idx} className="bg-gray-100 rounded-b-lg group" itemScope itemType="https://schema.org/BlogPosting">
                                        <header className="relative">
                                            <Link href={`/blog/${slug}`} aria-label={title}>
                                                <Image
                                                    src={heroUrl}
                                                    alt={alt}
                                                    width={720}
                                                    height={420}
                                                    className="object-cover w-full rounded-t-lg h-[250px] transition-transform duration-300 ease-in-out hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    priority={idx < 2} // prioritize top images
                                                />
                                            </Link>
                                        </header>

                                        <div className="px-4 md:w-[23rem] py-4">
                                            <p className="pt-1 mb-2 text-sm text-gray-600">
                                                <time dateTime={createdAt}>{formatDate(createdAt)}</time>
                                            </p>
                                            <h2 className="text-lg font-light text-[#17171B] group-hover:text-[#E21F2C] max-w-[18rem]">
                                                <Link href={`/blog/${slug}`} className="inline-block uppercase">
                                                    {title}
                                                </Link>
                                            </h2>

                                            {attr.excerpt && (
                                                <p className="mt-2 text-sm text-gray-700"
                                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(attr.excerpt) }}
                                                />
                                            )}

                                            <div className="mt-4">
                                                <Link href={`/blog/${slug}`} className="text-[#E21F2C] text-xs uppercase flex items-center hover:underline hover:text-black" aria-label={`Read more: ${title}`}>
                                                    Read more <ArrowRight className="inline w-4 h-4 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Pagination / Controls */}
                        <div className="flex items-center justify-between mt-16">
                            <p className="text-sm text-gray-600">
                                Showing {Math.min(totalItems, perPage * currentPage)} of {totalItems} articles
                            </p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:text-[#D10003] disabled:opacity-50">
                                    <ChevronLeft className="inline mr-2" />
                                    Previous
                                </button>

                                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:text-[#D10003] disabled:opacity-50">
                                    Next
                                    <ChevronRight className="inline ml-2" />
                                </button>

                                {/* Load more (progressive) */}
                                {perPage * currentPage < totalItems && (
                                    <button onClick={() => {
                                        // increase perPage to show more results (progressive)
                                        loadMore();
                                        // keep on the current page
                                    }} className="px-4 py-2 border border-[#E21F2C] text-[#E21F2C] rounded-md hover:bg-[#E21F2C] hover:text-white">
                                        View more
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}
