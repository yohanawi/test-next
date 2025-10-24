"use client";

import ContactForm from "@/components/Contactform";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useParams } from 'next/navigation';
import { useQuery } from "@apollo/client";
import { GET_PROJECT, GET_PROJECT_CATEGORY, GET_FEATURED_PROJECT_SEC } from "@/lib/queries";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ProjectType = {
    attributes: {
        name: string;
        slug: string;
        featuredImg?: {
            data?: {
                attributes?: {
                    url?: string;
                    alternativeText?: string;
                };
            };
        };
        project_category?: {
            data?: {
                attributes?: {
                    name?: string;
                };
            };
        };
    };
};

interface GalleryImageAttributes {
    url: string;
    alternativeText?: string;
}

interface GalleryImageData {
    attributes?: GalleryImageAttributes;
}

interface GalleryImageWrapper {
    data?: GalleryImageData;
}

interface GalleryItem {
    image?: GalleryImageWrapper;
}

interface Label {
    name: string;
}

interface ProjectAttributes {
    name: string;
    slug: string;
    featuredImg?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
    label?: Label[];
}

interface Project {
    attributes: ProjectAttributes;
}


export default function SingleProject() {

    const { SingleProject } = useParams();
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data: ProjectData } = useQuery(GET_PROJECT, { variables: { slug: SingleProject, locale }, skip: !SingleProject || SingleProject === "", });
    const { data } = useQuery(GET_PROJECT, { variables: { locale }, });
    const { data: categoryData } = useQuery(GET_PROJECT_CATEGORY, { variables: { locale }, });
    const { data: featuredData } = useQuery(GET_FEATURED_PROJECT_SEC, { variables: { locale }, });
    const projectCards: ProjectType[] = data?.projects?.data || [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const { name,
        description,
        projOverview,
        gallerySec,
        bannerSec,
    } = ProjectData?.projects?.data?.[0]?.attributes || {};

    const FeaturedProject = featuredData?.projectSec?.data?.attributes || {};
    const categories: string[] = ["All", ...Array.from(
        new Set(projectCards.map((project) => project.attributes?.project_category?.data?.attributes?.name).filter((name): name is string => Boolean(name)))
    )];
    const [activeCategory, setActiveCategory] = useState("All");
    const filteredProjects = activeCategory === "All" ? projectCards : projectCards.filter((project) => project.attributes?.project_category?.data?.attributes?.name === activeCategory);

    useEffect(() => { }, [activeCategory, categoryData, ProjectData]);
    const [visibleProjects, setVisibleProjects] = useState(3);

    const loadMoreProjects = () => {
        setVisibleProjects((prev: number) => prev + 3);
    };

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    const bgImageUrl = bannerSec?.bgImg?.data?.attributes?.url && bannerSec.bgImg.data.attributes.url.trim() !== "" ? `${baseUrl}${bannerSec.bgImg.data.attributes.url}` : "/images/contact-hero.png";

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src="/images/case_studies1.png" layout="fill" objectFit="cover" alt="case_studies" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">
                        {name}
                    </h1>
                </div>
            </section>

            <section className="py-8 bg-white md:py-14">
                <div className="flex justify-end px-48">
                    <Link href="/projects" className="text-black relative group flex items-center space-x-2 bg-[#cacaca] px-4 py-1.5 rounded-xl hover:text-[#D10003]">
                        <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="flex gap-2 text-sm font-semibold uppercase"> Back </span>
                    </Link>
                </div>
                <div className="mx-10 lg:mx-44 md:mx-24 3xl:mx-72">
                    <div className="text-left">
                        <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                            {projOverview?.title || "Project Overview"}
                        </h2>
                        <span className="text-[#E42D39] text-xs md:text-base">
                            {projOverview?.description}
                        </span>
                    </div>
                    <div className="grid lg:grid-cols-3">
                        <div className="col-span-1 py-8 space-y-2 md:text-lg">
                            {projOverview?.details.map((detail: { label: string, answer: string }) => (
                                <p key={detail.label} className="text-[#E42D39]">{detail.label} : <span className="text-black">{detail.answer}</span></p>
                            ))}

                        </div>
                        <div className="col-span-2 text-black" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white lg:py-12">
                <div className="text-center">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">{gallerySec?.title}</h2>
                    <span className="text-[#E42D39] text-xs md:text-base">{gallerySec?.description}</span>
                </div>
                <div className="grid gap-4 mx-8 lg:grid-cols-3 md:grid-cols-2 md:py-10 lg:mx-44 md:mx-24 3xl:mx-72">
                    {gallerySec?.images?.map((img: GalleryItem, index: number) => (
                        <div key={index} className="relative w-full lg:h-[20rem] md:h-[15rem] h-[15rem] group overflow-hidden">
                            {img.image?.data?.attributes?.url && (
                                <Image src={`${baseUrl}${img.image.data.attributes.url}`} alt={img.image.data.attributes.alternativeText || `Gallery Image ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/portfolio" className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        view our portfolio
                    </Link>
                </div>
            </section>

            {bannerSec && (bannerSec.bgImg?.data?.attributes?.url || bannerSec?.title || bannerSec?.description) ? (
                <section className="bg-[#f6f6f6] text-center lg:py-20 md:py-16 py-10 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('${bgImageUrl}')` }}>
                    <div className="container relative z-50 px-10 mx-auto">
                        <h2 className="text-2xl text-center text-white uppercase md:text-3xl lg:text-4xl md:mx-20">{bannerSec?.title}</h2>
                        <div className="mx-10 lg:mx-32 md:mx-20 3xl:mx-24">
                            <p className="mt-8 text-xs text-white md:text-base" dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(bannerSec?.description || ""),
                            }}>
                            </p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </section >
            ) : null}

            <section className="bg-[#e5e9eb]">
                <div className="grid pt-12 mx-12 md:grid-cols-2 lg:mx-44 md:mx-24 lg:pt-24 3xl:px-28">
                    <div>
                        <h2 className="text-[26px] lg:text-[36px] text-[#17171B] font-sans font-normal uppercase">
                            {FeaturedProject?.title || "Featured Projects"}
                        </h2>
                        <p className="text-[14px] lg:text-[18px] text-[#EA2127] font-sans tracking-wide uppercase">
                            {FeaturedProject?.subTitle || "We offer complete exhibition solutions"}
                        </p>
                    </div>
                    <div className="flex items-center mt-4 md:justify-end">
                        <Link href={`${FeaturedProject?.btnLink}`} className="text-black relative group flex items-center space-x-2 bg-white px-4 py-1.5 rounded-xl hover:text-[#D10003]">
                            <span className="flex gap-2"> {FeaturedProject?.btnLabel || "All Projects"}
                                <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                                    ➔
                                </button>
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-start pt-12 mx-12 space-x-4 overflow-x-auto lg:mx-44 md:mx-24 3xl:px-28">
                    <div className="bg-[#f4f4f5] p-1.5 rounded-lg">
                        {categories.map((category) => (
                            <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-md transition-all duration-300 text-sm font-semibold border border-transparent ${activeCategory === category ? "bg-white text-red-600 border-red-600 shadow-sm" : "bg-[#f4f4f5] text-gray-500 hover:bg-gray-200 hover:text-[#D10003]"}`}>
                                {category}
                            </button >
                        ))}
                    </div >
                </div >

                <div className="pb-12 mt-10 3xl:mx-40">
                    <div className="flex flex-wrap justify-center gap-4">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project: Project, index: number) => (
                                <div key={index} className="relative overflow-hidden 3xl:w-[430px] lg:w-[400px] w-[280px] group">
                                    <Link href={`/projects/${project.attributes.slug}`}>
                                        <Image src={`${baseUrl}${project.attributes.featuredImg?.data?.attributes?.url}`} alt={project.attributes.name} width={450} height={300} className="object-cover w-full h-[280px] rounded-lg transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 mx-6 my-4 transition-all duration-300 translate-y-full bg-white bg-opacity-100 rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                                            {project.attributes.label?.map((label: { name: string }, index: number) => (
                                                <span key={index} className="px-3 py-1 mr-1 text-xs text-white bg-red-700 rounded-full" >
                                                    {label.name}
                                                </span>
                                            ))}
                                            <div className="flex justify-between">
                                                <p className="mt-2 text-base font-bold text-black">
                                                    {project.attributes.name}
                                                </p>
                                                <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                                                    ➔
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No projects found for &quot;{activeCategory}&quot;</p>
                        )}
                    </div>
                </div >
                {
                    visibleProjects < projectCards.length && (
                        <div className="flex items-center justify-center pb-10">
                            <button onClick={loadMoreProjects} className="uppercase border border-[#E21F2C] text-[#E21F2C] text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all hover:bg-[#E21F2C] hover:text-white">
                                View More
                            </button>
                        </div>
                    )
                }
            </section >

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}