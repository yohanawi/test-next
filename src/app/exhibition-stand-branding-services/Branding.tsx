"use client";

import { GET_EXHIBITION_BRANDING_DATA, GET_PROJECT, GET_PROJECT_CATEGORY } from "@/lib/queries";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

type AccordionItem = {
    question: string;
    answers: string;
};

type ProjectType = {
    attributes: {
        name: string;
        slug: string;
        featuredImg: {
            data: {
                attributes: {
                    url: string;
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
        label?: {
            name: string;
        }[];
    };
};

export default function Contractors() {

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [contentRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prevState: number | null) => (prevState === index ? null : index));
    };

    const loadMoreProjects = () => {
        setVisibleProjects((prev: number) => prev + 3);
    };

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_EXHIBITION_BRANDING_DATA, { variables: { locale }, });
    const { data: ProjectData, } = useQuery(GET_PROJECT, { variables: { locale }, });
    const { data: categoryData, } = useQuery(GET_PROJECT_CATEGORY, { variables: { locale }, });
    const { featurePrjSec } = ProjectData?.projects?.data?.[0]?.attributes || {};
    const projects: ProjectType[] = ProjectData?.projects?.data || [];

    const categories: string[] = ["All", ...Array.from(
        new Set(projects
            .map((project) =>
                project.attributes?.project_category?.data?.attributes?.name
            ).filter((name): name is string => Boolean(name))
        )
    ),];
    const [activeCategory, setActiveCategory] = useState("All");
    const filteredProjects = activeCategory === "All" ? projects : projects.filter((project) => project.attributes?.project_category?.data?.attributes?.name === activeCategory);

    useEffect(() => { }, [activeCategory, categoryData, ProjectData]);
    const [visibleProjects, setVisibleProjects] = useState(3);
    const mainExhibitionbranding = data?.exhiBranPage?.data?.attributes || {};
    const { BranHead } = mainExhibitionbranding;
    const accordion = mainExhibitionbranding?.BrandFaq?.ConFaq || [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = BranHead?.image?.data?.attributes?.url ? `${baseUrl}${BranHead.image.data.attributes.url}` : "/images/Banner.jpg";
    const images = [
        mainExhibitionbranding?.BrandSec2?.image1?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding?.BrandSec2.image1.data.attributes.url}` : "/images/exhibition1.png",
        mainExhibitionbranding?.BrandSec2?.image2?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding?.BrandSec2.image2.data.attributes.url}` : "/images/exhibition2.png",
        mainExhibitionbranding?.BrandSec2?.image3?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding?.BrandSec2.image3.data.attributes.url}` : "/images/exhibition3.png",
        mainExhibitionbranding?.BrandSec2?.image4?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding?.BrandSec2.image4.data.attributes.url}` : "/images/exhibition4.png",
    ];

    const portfolioImages = [
        {
            src: mainExhibitionbranding?.banner1?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding.banner1.data.attributes.url}` : "/images/portfolio1.png",
        },
        {
            src: mainExhibitionbranding?.banner2?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding.banner2.data.attributes.url}` : "/images/portfolio2.png",
        },
        {
            src: mainExhibitionbranding?.banner3?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbranding.banner3.data.attributes.url}` : "/images/portfolio3.png",
        },
    ];

    const [, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {BranHead?.heading || "exhibition stand Branding"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={BranHead?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {BranHead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={BranHead?.breadcrumb?.link2 || "/exhibition-stand-branding-services"} className="px-4 uppercase" >
                            {BranHead?.breadcrumb?.SubHead2 || "exhibition stand Branding"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-12 md:py-8 py-5">
                <div className="container px-6 mx-auto">
                    <h2 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20">
                        {mainExhibitionbranding?.BranDescribe?.title || "GET YOUR OWN BRAND"}
                    </h2>
                    <p className="mt-2 text-lg text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        {mainExhibitionbranding?.BranDescribe?.subTitle || "CUSTOM 3D EXHIBITION STAND DESIGN"}
                    </p>
                    <div className=" lg:mx-48 3xl:mx-[6rem] md:mx-20 mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base" dangerouslySetInnerHTML={{
                            __html: mainExhibitionbranding?.BranDescribe?.description,
                        }}></p>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] px-8 3xl:px-0 lg:py-10 md:py-8 py-3">
                <div className="lg:mx-48 mx-5 md:mx-20 3xl:mx-[17rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-lg font-normal text-black uppercase md:text-3xl lg:text-5xl"
                                    dangerouslySetInnerHTML={{
                                        __html: mainExhibitionbranding?.BrandSec2?.title || "Brand your<br /> <span style='color: #EA2127;'>EXHIBITION</span>",
                                    }}>
                                </h2>
                                <div className="lg:py-8 py-5 text-sm text-[#3E444A] 3xl:text-base">
                                    <p>{mainExhibitionbranding?.BrandSec2?.description}</p>
                                    <p className="mt-4">{mainExhibitionbranding?.BrandSec2?.description2}</p>
                                </div>
                                <div className="grid gap-4 text-xs text-black md:grid-cols-2 lg:mt-6 3xl:text-sm">
                                    {mainExhibitionbranding?.BrandSec2?.ExhiList?.map(
                                        (item: { lable: string }, index: number) => (
                                            <div key={index} className="flex items-center gap-6">
                                                <Image src="/images/correct-icon.png" alt="Correct Icon" width={17} height={17} layout="fixed" priority quality={30} />
                                                {item.lable}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {images.map((src, index) => (
                                    <div key={index} className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)} >
                                        <Image src={src} layout="fill" objectFit="cover" alt={`Exhibition ${index + 1}`} className="object-cover w-full h-full transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#d8dde0]">
                <div className="grid pt-12 mx-12 md:grid-cols-2 lg:mx-44 md:mx-24 lg:pt-12 3xl:px-28">
                    <div>
                        <h2 className="md:text-[26px] text-xl lg:text-[36px] text-[#17171B] font-sans font-normal uppercase">
                            {featurePrjSec?.title}
                        </h2>
                        <p className="text-[14px] lg:text-[18px] text-[#EA2127] font-sans tracking-wide uppercase mt-3">
                            {featurePrjSec?.subTitle}
                        </p>
                    </div>
                    <div className="flex items-center mt-4 md:justify-end">
                        <Link href="/projects" className="text-black relative group flex items-center space-x-2 bg-white px-4 py-1.5 rounded-sm hover:text-[#D10003]" >
                            <span className="flex gap-2">
                                {" "}
                                {featurePrjSec?.btnLabel}
                                <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                                    ➔
                                </button>
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-start pt-6 mx-12 overflow-x-auto lg:mx-44 md:mx-24 3xl:px-28">
                    <div className="bg-[#f4f4f5] p-1.5 rounded-lg">
                        {categories.map((category) => (
                            <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-md transition-all duration-300 text-sm font-semibold border border-transparent ${activeCategory === category
                                ? "bg-white text-red-600 border-red-600 shadow-sm" : "bg-[#f4f4f5] text-gray-500 hover:bg-gray-200 hover:text-[#D10003]"}`} >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pb-12 mt-8 3xl:mx-40">
                    <div className="flex flex-wrap justify-center gap-4">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project: ProjectType, index: number) => (
                                <div key={index} className="relative overflow-hidden 3xl:w-[430px] lg:w-[400px] w-[280px] group">
                                    <Link href={`/projects/${project.attributes.slug}`}>
                                        <Image src={`${baseUrl}${project.attributes.featuredImg?.data?.attributes?.url}`} alt={`Project image for ${project.attributes.name}`}
                                            width={450} height={320} className="object-cover w-full h-[280px] rounded-lg transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 mx-6 my-4 transition-all duration-300 translate-y-full bg-white bg-opacity-100 rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                                            {project.attributes.label?.map(
                                                (label, index) => (
                                                    <span key={index} className="px-3 py-1 mr-1 text-xs text-white bg-red-700 rounded-full" >
                                                        {label.name}
                                                    </span>
                                                )
                                            )}
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
                            <p className="text-center text-gray-500">
                                No projects found for &quot;{activeCategory}&quot;
                            </p>
                        )}
                    </div>
                </div>
                {visibleProjects < projects.length && (
                    <div className="flex items-center justify-center pb-10">
                        <button onClick={loadMoreProjects} className="uppercase border border-[#E21F2C] text-[#E21F2C] text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all hover:bg-[#E21F2C] hover:text-white" >
                            View More
                        </button>
                    </div>
                )}
            </section>

            <section className="bg-[#f6f6f6] py-10">
                <h2 className="max-w-[4.2rem] text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[19rem] md:mx-32 mx-14 bg-white rounded-full px-4 py-1">
                    FAQ
                </h2>
                <div className="grid lg:grid-cols-2 lg:mx-48 md:mx-32 3xl:mx-56">
                    <div className="pt-8 mx-14 md:mx-0 3xl:mx-20">
                        <h2 className="text-xl text-black md:text-3xl lg:text-5xl"
                            dangerouslySetInnerHTML={{
                                __html: mainExhibitionbranding?.BrandFaq?.FaqTitle || "How Can you <span style='color: #EA2127;'>brand your stand</span>",
                            }}>
                        </h2>
                    </div>
                    <div className="w-full mt-5 space-y-2 lg:-mt-8 md:mt-10 md:mx-0 px-9 md:px-0">
                        {accordion.map((item: AccordionItem, index: number) => {
                            const isOpen = openIndex === index;
                            const contentRef = contentRefs[index];

                            return (
                                <div key={index} className="border-[#00000056] text-black bg-white rounded-3xl" >
                                    <button className="flex items-center justify-between w-full p-1 text-lg font-medium text-left md:p-2 lg:p-4" onClick={() => toggleAccordion(index)} >
                                        <div className="flex items-center gap-2 lg:gap-10 3xl:gap-16 md:text-lg text-xs lg:text-base ps-4 md:ps-7 font-bold lg:max-w-[30rem] max-w-[15rem] md:max-w-[28rem] 3xl:max-w-[40rem]">
                                            {item.question}
                                        </div>
                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full" >
                                            {isOpen ? (
                                                <ArrowUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ArrowDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: contentRef?.current?.scrollHeight || "auto", opacity: 1, }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden" >
                                                <div ref={contentRef} className="p-4 bg-white border-t-2 rounded-b-3xl" >
                                                    {item.answers?.split("\n").map((line: string, i: number) => (
                                                        <p key={i} className="text-xs list-disc md:text-lg lg:text-base md:ps-7 ps-2" dangerouslySetInnerHTML={{ __html: line }} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#d4d4d4]">
                <div className="grid gap-4 pt-10 mx-4 lg:grid-cols-3 md:grid-cols-1 lg:py-4 lg:mx-6 md:mx-40">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full lg:h-[27rem] h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}