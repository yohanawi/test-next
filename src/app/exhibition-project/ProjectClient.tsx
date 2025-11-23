"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ContactForm from "@/components/Contactform";
import Image from "next/image";
import Link from "next/link";

type CategoryResponse = {
    projectCategories?: {
        data?: {
            attributes?: {
                name?: string;
            };
        }[];
    };
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

export default function ProjectClient({
    projectPage,
    projects,
    categories,
}: {
    projectPage: any;
    projects: ProjectType[];
    categories: CategoryResponse;
}) {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

    // -----------------------------------------------------
    // CATEGORY SETUP
    // -----------------------------------------------------
    const dynamicCategories = Array.from(
        new Set(
            projects
                .map(
                    (p) =>
                        p.attributes?.project_category?.data?.attributes?.name
                )
                .filter(Boolean)
        )
    );

    const categoryList = ["All", ...dynamicCategories];

    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProjects =
        activeCategory === "All"
            ? projects
            : projects.filter(
                (p) =>
                    p.attributes?.project_category?.data?.attributes?.name ===
                    activeCategory
            );

    // -----------------------------------------------------
    // LOAD MORE LOGIC
    // -----------------------------------------------------
    const [visibleProjects, setVisibleProjects] = useState(6);

    const visibleList = filteredProjects.slice(0, visibleProjects);

    const loadMoreProjects = () => {
        setVisibleProjects((prev) => prev + 6);
    };

    // -----------------------------------------------------
    // HTML Sanitizer
    // -----------------------------------------------------
    const sanitizeHtml = (html: string) =>
        html?.replace(/font-family:[^;"]*;?/gi, "");

    // -----------------------------------------------------
    // Animated Counter
    // -----------------------------------------------------
    const Counter = ({ value }: { value: number }) => {
        const [count, setCount] = useState(0);
        const ref = useRef<HTMLSpanElement>(null);
        const [hasAnimated, setHasAnimated] = useState(false);

        const animateValue = useCallback(() => {
            const duration = 2000;
            const startTime = performance.now();

            const tick = (now: number) => {
                const progress = Math.min((now - startTime) / duration, 1);
                setCount(Math.ceil(progress * value));
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        }, [value]);

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        animateValue();
                        setHasAnimated(true);
                    }
                },
                { threshold: 0.6 }
            );

            observer.observe(el);

            return () => observer.disconnect();
        }, [animateValue, hasAnimated]);

        return (
            <span
                ref={ref}
                className="text-3xl font-bold text-red-600 md:text-4xl"
            >
                {count}+
            </span>
        );
    };

    // -----------------------------------------------------
    // Banner Image
    // -----------------------------------------------------
    const bannerImage =
        projectPage?.HeroSec?.image?.data?.attributes?.url
            ? `${baseUrl}${projectPage.HeroSec.image.data.attributes.url}`
            : "/images/Banner.jpg";

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image
                    src={bannerImage}
                    fill
                    className="object-cover"
                    alt="Banner"
                />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">
                        {projectPage?.HeroSec?.title || "Exhibition Projects"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">
                            Home
                        </Link>
                        /
                        <Link
                            href="/exhibition-project"
                            className="px-4 uppercase"
                        >
                            {projectPage?.HeroSec?.title ||
                                "Exhibition projects"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECOND SECTION */}
            <section className="px-8 bg-white lg:py-28 py-14">
                <div className="mx-5 lg:mx-36 md:mx-20 3xl:mx-64">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        {/* LEFT */}
                        <div>
                            <h2 className="text-2xl font-normal text-black uppercase md:text-4xl lg:text-5xl">
                                {projectPage?.SecondSec?.title}
                            </h2>

                            <p className="pt-5 text-sm text-black uppercase lg:text-base">
                                {projectPage?.SecondSec?.subTitle}
                            </p>

                            <div className="lg:py-8 py-5 text-sm text-[#3E444A]">
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            projectPage?.SecondSec?.description
                                        ),
                                    }}
                                />
                            </div>

                            {/* COUNTERS */}
                            <div
                                className="grid grid-cols-2 gap-8 text-left"
                                style={{ fontFamily: "Sora, sans-serif" }}
                            >
                                {projectPage?.SecondSec?.number?.map(
                                    (
                                        stat: { Number: number; label: string },
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <Counter value={stat.Number} />
                                            <span className="text-sm font-medium tracking-wide text-black">
                                                {stat.label}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* RIGHT IMAGES */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                projectPage?.SecondSec?.image1,
                                projectPage?.SecondSec?.image2,
                                projectPage?.SecondSec?.image3,
                                projectPage?.SecondSec?.image4,
                            ]
                                .filter((img) => img?.data?.attributes?.url)
                                .map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative w-full overflow-hidden aspect-square rounded-xl group"
                                    >
                                        <Image
                                            src={`${baseUrl}${img.data.attributes.url}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            alt="Project Image"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY FILTER */}
            <section className="bg-[#d8dde0]">
                <div className="flex justify-start pt-6 mx-12 overflow-x-auto lg:mx-44 md:mx-24 3xl:px-28">
                    <div className="bg-[#f4f4f5] p-1.5 rounded-lg">
                        {categoryList.map((category: any) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setVisibleProjects(6);
                                    setActiveCategory(category);
                                }}
                                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${activeCategory === category
                                    ? "bg-white text-red-600 border border-red-600 shadow-sm"
                                    : "bg-[#f4f4f5] text-gray-500 hover:bg-gray-200 hover:text-[#D10003]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PROJECT GRID */}
                <div className="pb-12 mt-8 3xl:mx-40">
                    <div className="flex flex-wrap justify-center gap-4">
                        {visibleList.length > 0 ? (
                            visibleList.map((project, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden 3xl:w-[430px] lg:w-[400px] w-[280px] group"
                                >
                                    <Link
                                        href={`/projects/${project.attributes.slug}`}
                                    >
                                        <Image
                                            src={`${baseUrl}${project.attributes.featuredImg.data.attributes.url}`}
                                            width={450}
                                            height={320}
                                            alt={project.attributes.name}
                                            className="object-cover w-full h-[280px] rounded-lg transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* HOVER PANEL */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 mx-6 my-4 transition-all duration-300 translate-y-full bg-white rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                                            {project.attributes.label?.map(
                                                (tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 mr-1 text-xs text-white bg-red-700 rounded-full"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                )
                                            )}

                                            <div className="flex justify-between">
                                                <p className="mt-2 text-base font-bold text-black">
                                                    {project.attributes.name}
                                                </p>

                                                <button className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center group-hover:bg-[#f55152] group-hover:text-white">
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

                {/* LOAD MORE BUTTON */}
                {visibleProjects < filteredProjects.length && (
                    <div className="flex items-center justify-center pb-10">
                        <button
                            onClick={loadMoreProjects}
                            className="uppercase border border-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-[#E21F2C] text-xs px-4 py-2 rounded-md shadow-lg font-bold transition-all"
                        >
                            View More
                        </button>
                    </div>
                )}
            </section>

            {/* CONTACT SECTION */}
            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}
