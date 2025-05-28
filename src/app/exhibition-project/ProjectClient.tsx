"use client";

import { GET_PROJECT, GET_PROJECT_CATEGORY, GET_PROJECT_PAGE } from "@/lib/queries";
import { useEffect, useState, useRef, useCallback } from "react";
import ContactForm from "@/components/Contactform";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

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

export default function ProjectClient() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_PROJECT_PAGE, { variables: { locale }, });
    const { data: ProjectData } = useQuery(GET_PROJECT, { variables: { locale }, });
    const { data: categoryData } = useQuery(GET_PROJECT_CATEGORY, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const projectPage = data?.projectPages?.data?.[0]?.attributes || {};
    const bannerImage = projectPage?.HeroSec?.image?.data?.attributes?.url ? `${baseUrl}${projectPage.HeroSec.image.data.attributes.url}` : "/images/Banner.jpg";
    const { featurePrjSec } = ProjectData?.projects?.data?.[0]?.attributes || {};
    const projects: ProjectType[] = ProjectData?.projects?.data || [];

    const categories: string[] = ["All", ...Array.from(
        new Set(
            projects.map((project) => project.attributes?.project_category?.data?.attributes?.name).filter((name): name is string => Boolean(name))
        )
    )];

    const [activeCategory, setActiveCategory] = useState("All");
    const filteredProjects = activeCategory === "All" ? projects : projects.filter((project) => project.attributes?.project_category?.data?.attributes?.name === activeCategory);

    useEffect(() => { }, [activeCategory, categoryData, ProjectData]);

    const [visibleProjects, setVisibleProjects] = useState(3);

    const loadMoreProjects = () => {
        setVisibleProjects((prev: number) => prev + 3);
    };

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    const [, setHoveredIndex] = useState<number | null>(null);

    const Counter = ({ value }: { value: number }) => {
        const [count, setCount] = useState(0);
        const [hasAnimated, setHasAnimated] = useState(false);
        const ref = useRef<HTMLSpanElement>(null);

        const startCounting = useCallback(() => {
            const duration = 5000;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = Math.ceil(progress * value);

                setCount(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }, [value]);

        useEffect(() => {
            const element = ref.current;
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        startCounting();
                        setHasAnimated(true);
                    }
                },
                { threshold: 0.5 }
            );

            observer.observe(element);

            return () => {
                observer.unobserve(element);
            };
        }, [hasAnimated, startCounting]);

        return (
            <span ref={ref} className="text-2xl font-bold text-red-600 md:text-4xl">
                {count}+
            </span>
        );
    };

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">{projectPage?.HeroSec?.title || "Exhibition Projects"}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/exhibition-project" className="px-4 uppercase">{projectPage?.HeroSec?.title || "Exhibition projects"}</Link>
                    </div>
                </div>
            </section>

            <section className="px-8 bg-white lg:py-28 py-14">
                <div className="mx-5 lg:mx-36 md:mx-20 3xl:mx-64">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-2xl font-normal text-black uppercase md:text-4xl lg:text-5xl">
                                    {projectPage?.SecondSec?.title}
                                </h2>
                                <p className="pt-5 text-sm text-black uppercase lg:text-base"> {projectPage?.SecondSec?.subTitle}</p>
                                <div className="lg:py-8 py-5 text-sm text-[#3E444A]">
                                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(projectPage?.SecondSec?.description) }}>

                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-8 text-left" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    {projectPage?.SecondSec?.number?.map((stat: { Number: number, label: string }, index: number) => (
                                        <div key={index} className="flex flex-col items-left">
                                            <span className="text-4xl font-bold text-red-600"><Counter value={stat.Number} /></span>
                                            <span className="text-sm font-medium tracking-wide text-black">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    projectPage?.SecondSec?.image1,
                                    projectPage?.SecondSec?.image2,
                                    projectPage?.SecondSec?.image3,
                                    projectPage?.SecondSec?.image4,
                                ]
                                    .filter(img => img?.data?.attributes?.url).map((img, index) => (
                                        <div key={index} className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95" onMouseEnter={() => setHoveredIndex(null)} onMouseLeave={() => setHoveredIndex(null)} >
                                            <Image src={`${baseUrl}${img.data.attributes.url}`} layout="fill" objectFit="cover" alt="Exhibition 1" className="object-cover w-full h-full transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-20 md:py-16 py-10  bg-no-repeat" style={{
                backgroundImage: `url(${baseUrl}${projectPage?.BannerSec?.bgImg?.data?.attributes?.url || "/images/default-banner.jpg"})`,
                backgroundSize: "cover", backgroundPosition: "center"
            }}>
                <div className="container px-10 mx-auto">
                    <h2 className="text-2xl text-center text-white uppercase md:text-3xl lg:text-4xl md:mx-20">{projectPage?.BannerSec?.title}</h2>
                    <div className="mx-10 lg:mx-32 md:mx-20 3xl:mx-24">
                        <p className="mt-8 text-xs text-white md:text-base" dangerouslySetInnerHTML={{ __html: sanitizeHtml(projectPage?.BannerSec?.description) }}></p>
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

            <section className="py-10 bg-white lg:pb-28">
                <div className="text-center">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">{projectPage?.GallarySec?.title}</h2>
                    <span className="text-[#E42D39] text-xs md:text-base">{projectPage?.GallarySec?.description}</span>
                </div>
                <div className="grid lg:grid-cols-3 gap-4 lg:pt-10 lg:pb-8 pb-10 pt-10 lg:mx-48 mx-8 md:mx-40 3xl:mx-[17rem]">
                    {projectPage?.GallarySec?.images?.map((img: { image: { data: { attributes: { url: string } } } }, index: number) => (
                        <div key={index} className="relative w-full h-[20rem] group overflow-hidden">
                            <Image src={`${baseUrl}${img.image.data.attributes.url}`} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/portfolio" className=" uppercase border border-[#E21F2C] text-[#E21F2C] text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        view our portfolio
                    </Link>
                </div>
            </section>

            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}
