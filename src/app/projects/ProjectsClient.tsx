"use client";

import ContactForm from "@/components/Contactform";
import { GET_PROJECT } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

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

export default function ProjectsClient() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_PROJECT, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const projects: ProjectType[] = data?.projects?.data || [];
    const categories: string[] = ["All", ...Array.from(
        new Set(projects.map((project) => project.attributes?.project_category?.data?.attributes?.name).filter((name): name is string => Boolean(name)))
    )];

    const [activeCategory, setActiveCategory] = useState("All");
    const filteredProjects: ProjectType[] = activeCategory === "All" ? projects : projects.filter((project) => project.attributes?.project_category?.data?.attributes?.name === activeCategory);
    const [visibleProjects, setVisibleProjects] = useState(9);
    const loadMoreProjects = () => {
        setVisibleProjects((prev: number) => prev + 3);
    };

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src="/images/case_studies1.png" layout="fill" objectFit="cover" alt="case_studies" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">projects</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/projects" className="px-4 uppercase">projects</Link>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="grid mx-12 md:grid-cols-2 lg:mx-44 md:mx-24 lg:pt-10 3xl:px-28">
                    <div>
                        <h2 className="text-[26px] lg:text-[36px] text-[#17171B] font-sans font-normal uppercase">
                            projects
                        </h2>
                        <p className="text-[14px] lg:text-[18px] text-[#EA2127] font-sans tracking-wide uppercase">complete exhibition solutions </p>
                    </div>
                </div>
                <div className="flex justify-start pt-5 mx-12 overflow-x-auto lg:mx-44 md:mx-24 3xl:px-28">
                    <div className="bg-[#f4f4f5] p-1.5 rounded-lg">
                        {categories.map(category => (
                            <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-md transition-all duration-300 text-sm font-semibold border border-transparent ${activeCategory === category ? "bg-white text-red-600 border-red-600 shadow-sm" : "bg-[#f4f4f5] text-gray-500 hover:bg-gray-200 hover:text-[#D10003]"}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pb-12 mt-10 3xl:mx-40">
                    <div className="flex flex-wrap justify-center gap-4">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project: Project, index: number) => (
                                <div key={index} className="relative overflow-hidden 3xl:w-[430px] lg:w-[400px] w-[280px] group" >
                                    <Link href={`/projects/${project.attributes.slug}`}>
                                        <Image src={`${baseUrl}${project.attributes.featuredImg?.data?.attributes?.url}`} alt={`Project image for ${project.attributes.name}`} width={450} height={320} className="object-cover w-full h-[280px] rounded-lg transition-transform duration-300 group-hover:scale-105" />
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
                </div>
                {visibleProjects < projects.length && (
                    <div className="flex items-center justify-center pb-10">
                        <button onClick={loadMoreProjects} className="uppercase border border-[#E21F2C] text-[#E21F2C] text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all hover:bg-[#E21F2C] hover:text-white">
                            View More
                        </button>
                    </div>
                )}
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}