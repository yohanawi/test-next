"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ContactForm from "@/components/Contactform";
import { GET_ALL_BLOGS } from "@/lib/queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Article = {
    attributes: {
        title: string;
        slug: string;
        createdAt: string;
        HeroSec?: {
            bgImage?: {
                data?: {
                    attributes?: {
                        url?: string;
                    };
                };
            };
        };
    };
};

export default function BlogsClient() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_ALL_BLOGS, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const blogDetails = data?.blogDetails?.data || [];
    const articlesPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(blogDetails.length / articlesPerPage);
    const displayedArticles = blogDetails.slice(
        (currentPage - 1) * articlesPerPage, currentPage * articlesPerPage
    );

    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src="/images/Banner.jpg" layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">exhibition blogs</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/blog" className="px-4 uppercase">exhibition blogs</Link>
                    </div>
                </div>
            </section>

            <section className="py-10 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="lg:mx-44 lg:py-8">
                        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
                            {displayedArticles.map((article: Article, index: number) => {
                                const { title, slug, createdAt, HeroSec } = article.attributes;
                                const imageUrl = HeroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${HeroSec.bgImage.data.attributes.url}` : "/images/default-blog.jpg";

                                return (
                                    <div key={index} className="bg-gray-100 rounded-b-lg cursor-pointer group">
                                        <div className="relative">
                                            <Image src={imageUrl} alt={title} width={450} height={300} className="object-cover w-full rounded-t-lg h-[250px] transition-transform duration-300 ease-in-out hover:scale-105" />
                                        </div>
                                        <div className="px-2 md:w-[23rem] ">
                                            <p className="pt-1 mb-3 text-sm text-gray-600">
                                                {new Date(createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <Link href={`/blog/${slug}`} className="text-black inline-block uppercase text-xs group-hover:text-[#E21F2C]">
                                                <h2 className="text-lg font-light text-[#17171B] group-hover:text-[#E21F2C] max-w-[18rem]">{title}</h2>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between mt-16">
                            <p className="text-sm text-gray-600">
                                Showing {displayedArticles.length} out of {blogDetails.length} articles
                            </p>
                            <div className="flex">
                                <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-4 hover:text-[#D10003]" disabled={currentPage === 1} >
                                    <ChevronLeft className="hidden w-5 h-5 mr-2 md:inline" />Previous
                                </button>
                                <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:text-[#D10003]" disabled={currentPage === totalPages} >
                                    Next <ChevronRight className="hidden w-5 h-5 ml-2 md:inline" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}