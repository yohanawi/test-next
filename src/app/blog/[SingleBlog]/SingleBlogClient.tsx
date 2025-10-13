"use client";

import { GET_BLOG_DETAIL, GET_EXHIBITION_PAGE_DATA } from "@/lib/queries";
import ContactForm from "@/components/Contactform";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

type Post = {
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

export default function SingleBlog() {

    const { SingleBlog } = useParams();
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_BLOG_DETAIL, { variables: { slug: SingleBlog, locale }, skip: !SingleBlog, });
    const blogDetail = data?.blogDetails?.data?.[0]?.attributes || {};
    const recentPosts = data?.recentPosts?.data || [];
    const { data: exhibitionData } = useQuery(GET_EXHIBITION_PAGE_DATA, { variables: { locale }, });
    const mainExhibition = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const { services } = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    const serviceCards = [
        {
            image: services?.image01?.data?.attributes?.url ? `${baseUrl}${services.image01.data.attributes.url}` : "/images/exhibition-ser1.png",
            title: services?.label01 || "Exhibition Stand Contractor",
            link: services?.link1 || "/exhibition-stand-contractors",
        },
        {
            image: services?.image02?.data?.attributes?.url ? `${baseUrl}${services.image02.data.attributes.url}` : "/images/exhibition-ser2.png",
            title: services?.label02 || "Exhibition Stand Design",
            link: services?.link2 || "/exhibition-stand-designer",
        },
        {
            image: services?.image03?.data?.attributes?.url ? `${baseUrl}${services.image03.data.attributes.url}` : "/images/exhibition-ser3.png",
            title: services?.label03 || "Exhibition Stand Builders",
            link: services?.link3 || "/exhibition-stand-builders",
        },
    ];

    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={blogDetail?.HeroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${blogDetail.HeroSec.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt={blogDetail?.HeroSec?.title || "Blog Banner"} />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-3xl">{blogDetail?.title}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href={`/blog/${blogDetail.slug}`} className="px-4 uppercase">{blogDetail?.title}</Link>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="grid py-10 lg:grid-cols-3 lg:px-48 3xl:px-72 md:px-28 px-14 md:py-12 lg:py-20 lg:gap-10 md:gap-14">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold text-gray-900 uppercase md:text-3xl">
                            {blogDetail?.title}
                        </h2>
                        <div className="mt-4 space-y-4 text-gray-600 lg:max-w-3xl 3xl:max-w-5xl 3xl:text-lg">
                            <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(blogDetail?.description) || "<p>No content available.</p>" }}>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-black">
                        <h2 className="pb-2 text-2xl border-b-2">Recent Post</h2>
                        <div className="w-full pt-5 space-y-3">
                            {recentPosts.map((post: Post, index: number) => {
                                const postTitle = post.attributes.title;
                                const postSlug = post.attributes.slug;
                                const postDate = new Date(post.attributes.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });
                                const postImage = post.attributes.HeroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${post.attributes.HeroSec.bgImage.data.attributes.url}` : "/images/default-blog.jpg";
                                return (
                                    <div key={index} className="flex p-4 border-2 rounded-md">
                                        <Link href={`/blog/${postSlug}`} className="flex">
                                            <div className="w-24 h-16 overflow-hidden rounded-lg">
                                                <Image src={postImage} alt={postTitle} width={80} height={80} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="ps-5">
                                                <p className="text-sm md:text-xl lg:text-sm 3xl:text-lg">{postTitle}</p>
                                                <p className="text-sm text-gray-600 lg:pt-5 md:pt-10">{postDate}</p>
                                            </div>
                                        </Link>
                                    </div>

                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-20 md:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 lg:text-4xl md:text-3xl" dangerouslySetInnerHTML={{
                        __html: mainExhibition?.services?.title || "EXHIBITION <span style='color: #EA2127;'>SERVICES</span>",
                    }}>
                    </h2>
                    <p className="mx-auto mt-4 text-gray-600 md:max-w-lg lg:max-w-3xl 3xl:text-lg">
                        {mainExhibition?.services?.description}
                    </p>
                    <div className="grid lg:grid-cols-3 gap-8 mt-10 lg:mx-40 md:mx-40 3xl:mx-[7rem]">
                        {serviceCards.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
                                <Link href={item.link}>
                                    <Image src={item.image} alt={item.title} width={400} height={300} className="w-full transition-transform duration-300 ease-in-out hover:scale-105" />
                                    <div className="p-4 bg-white text-black font-semibold text-lg text-center group-hover:text-[#D10003]">
                                        {item.title}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}