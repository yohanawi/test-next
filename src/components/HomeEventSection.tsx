"use client";

import { GET_PROJECT, GET_PROJECT_CATEGORY } from "@/lib/queries";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";

type LabelType = { name: string };

interface ImageType {
  data?: {
    attributes?: {
      url: string;
      alternativeText?: string;
    };
  };
}
type ProjectType = {
  attributes: {
    name: ReactNode;
    slug?: string | null;
    featuredImg: ImageType;
    label?: LabelType[];
    project_category?: { data?: { attributes?: { name?: string } } };
  };
};

export default function HomeEventSection() {

  const { locale } = useSelector((state: RootState) => state.locale);
  const { data: ProjectData } = useQuery(GET_PROJECT, { variables: { locale }, });
  const { data: categoryData } = useQuery(GET_PROJECT_CATEGORY, { variables: { locale }, });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const { featurePrjSec } = ProjectData?.projects?.data?.[0]?.attributes || {};
  const projects: ProjectType[] = ProjectData?.projects?.data || [];
  const categories: string[] = ["All", ...Array.from(new Set(projects.map((project) => project.attributes?.project_category?.data?.attributes?.name).filter((name): name is string => Boolean(name)))),];
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredProjects = activeCategory === "All" ? projects : projects.filter((project) => project.attributes?.project_category?.data?.attributes?.name === activeCategory);
  useEffect(() => { }, [activeCategory, categoryData, ProjectData]);

  return (
    <>
      <section className="bg-[#e5e9eb]">
        <div className="grid pt-12 mx-12 md:grid-cols-2 lg:mx-44 md:mx-24 lg:pt-24 3xl:px-28">
          <div>
            <h2 className="text-[26px] lg:text-[36px] text-[#17171B] font-sans font-normal uppercase">
              {featurePrjSec?.title || "Featured Projects"}
            </h2>
            <p className="text-[14px] lg:text-[18px] text-[#EA2127] font-sans tracking-wide uppercase">
              {featurePrjSec?.subTitle || "We offer complete exhibition solutions"}
            </p>
          </div>
          <div className="flex items-center mt-4 md:justify-end">
            <Link href="/projects" className="text-black relative group flex items-center space-x-2 bg-white px-4 py-1.5 rounded-sm hover:text-[#D10003]" >
              <span className="flex gap-2">
                {" "}
                {featurePrjSec?.btnLabel || "All Projects"}
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
              <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-md transition-all duration-300 text-sm font-semibold border border-transparent ${activeCategory === category ? "bg-white text-red-600 border-red-600 shadow-sm" : "bg-[#f4f4f5] text-gray-500 hover:bg-gray-200 hover:text-[#D10003]"}`} >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-12 mt-10 3xl:mx-40">
          <div className="flex flex-wrap justify-center gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: ProjectType, index: number) => (
                <div key={index} className="relative overflow-hidden 3xl:w-[430px] lg:w-[400px] w-[280px] group" >
                  <Link href={`/projects/${project.attributes.slug}`}>
                    <Image src={`${baseUrl}${project.attributes.featuredImg?.data?.attributes?.url}`} alt={`Project image for ${project.attributes.name}`} width={450} height={320} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover w-full h-[200px] sm:h-[220px] md:h-[280px] lg:h-[300px] rounded-lg transition-transform duration-300 group-hover:scale-105" priority quality={60} />
                    <div className="absolute inset-x-0 bottom-0 p-4 mx-6 my-4 transition-all duration-300 translate-y-full bg-white bg-opacity-100 rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                      {project.attributes.label?.map(
                        (label: LabelType, index: number) => (
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
      </section>
    </>
  );
}
