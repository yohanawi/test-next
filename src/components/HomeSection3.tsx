"use client";

import { GET_DESIGNRESULT_DATA, } from "@/lib/queries";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import Image from "next/legacy/image";

type DesignStep = {
    step: string;
    title: string;
    subTitle: string;
    description: string;
    image?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
};


export default function HomeSection3() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_DESIGNRESULT_DATA, { variables: { locale } });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const designResult = data?.designResult?.data?.attributes || {};
    const designSteps = designResult?.step || [];
    const [currentImage, setCurrentImage] = useState(designSteps.length > 0 ? `${baseUrl}${designSteps[0]?.designImg?.data?.attributes?.url}` : "/images/Design1.png");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollTop = scrollContainerRef.current.scrollTop;
            const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
            const index = Math.round((scrollTop / maxScroll) * (designSteps.length - 1));
            setCurrentImage(`${baseUrl}${designSteps[index].designImg.data.attributes.url}`);
        }
    };

    return (
        <section className="lg:h-screen bg-[url('/images/HomeSection3-bg.png')] bg-cover bg-center bg-no-repeat h-screen hidden lg:block relative" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            <div className="lg:mx-48 lg:py-20">
                <div className="grid lg:grid-cols-2">
                    <div className="flex flex-col">
                        <div className="lg:mx-20">
                            <p className="md:text-2xl text-[#B6B0B0]">{designResult.subTitle || "A few steps,"}</p>
                            <h2 className="text-6xl text-white text-center md:text-left uppercase font-extrabold max-w-[500px] leading-tight font-sans">
                                {designResult.mainTitle || "GREAT RESULTS"}
                            </h2>
                            <p className="text-white text-center md:text-left max-w-[300px]">
                                {designResult.description || "Experience excellence at every step of your exhibition journey"}
                            </p>
                        </div>
                        <div className="relative w-auto h-[350px] 3xl:h-[410px] text-start">
                            <Image src={currentImage} layout="fill" alt="Dynamic Step Image" />
                        </div>
                    </div>
                    <div ref={scrollContainerRef} onScroll={handleScroll} className="overflow-y-auto h-[550px] 3xl:h-[750px] space-y-14 scrollbar-hide scroll">
                        {designSteps.map((step: DesignStep, index: number) => {
                            const stepImageUrl = step.image?.data?.attributes?.url ? `${baseUrl}${step.image.data.attributes.url}` : "/images/placeholder.png";
                            return (
                                <div key={index} className="flex items-center justify-center">
                                    <div className="w-2 h-auto">
                                        <div className="relative w-auto h-96">
                                            <Image src="/images/line.png" layout="fill" alt="Timeline" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-start max-w-[22rem] mx-10 mb-8">
                                        <span className="text-xs font-bold tracking-wide text-gray-500 uppercase pb-7">
                                            {step.step}
                                        </span>
                                        <h2 className="text-3xl font-extrabold text-white max-w-80">
                                            {step.title}, <br /><span className="text-gray-400">{step.subTitle}</span>
                                        </h2>
                                        <p className="py-5 text-gray-300">{step.description}</p>
                                    </div>
                                    <div className="h-40 w-28">
                                        <div className="relative w-auto h-24">
                                            <Image src={stepImageUrl} layout="fill" alt="Step Image" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="absolute transform -translate-y-1/2 right-96 top-20">
                <div className="relative w-16 h-20 animate-bounce">
                    <Image src="/images/scroll-icon.png" layout="fill" objectFit="contain" alt="Scroll Indicator" className="invert" />
                </div>
            </div>
        </section>
    );
}
