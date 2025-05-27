"use client";

import { GET_EXHIBITION_BUILDER_DATA } from "@/lib/queries";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BuilderClient() {

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [contentRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev: number | null) => (prev === index ? null : index));
    };

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_EXHIBITION_BUILDER_DATA, { variables: { locale }, });
    const mainExhibitionbuilder = data?.exhiBuildPage?.data?.attributes || {};
    const { BuildHead } = mainExhibitionbuilder;
    const accordion = mainExhibitionbuilder?.BuildFaq?.ConFaq || [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = BuildHead?.image?.data?.attributes?.url ? `${baseUrl}${BuildHead.image.data.attributes.url}` : "/images/Banner.jpg";
    const [, setHoveredIndex] = useState<number | null>(null);

    const portfolioImages = [
        {
            src: mainExhibitionbuilder?.BuildPort?.image1?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbuilder.BuildPort.image1.data.attributes.url}` : "/images/portfolio1.png",
        },
        {
            src: mainExhibitionbuilder?.BuildPort?.image2?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbuilder.BuildPort.image2.data.attributes.url}` : "/images/portfolio2.png",
        },
        {
            src: mainExhibitionbuilder?.BuildPort?.image3?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbuilder.BuildPort.image3.data.attributes.url}` : "/images/portfolio3.png",
        },
    ];


    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {BuildHead?.heading || "exhibition stand builders"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={mainExhibitionbuilder?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {BuildHead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={mainExhibitionbuilder?.breadcrumb?.link2 || "/exhibition-stand-builder"} className="px-4 uppercase">
                            {BuildHead?.breadcrumb?.SubHead2 || "exhibition stand builder"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#fefefe] px-8 lg:py-14 py-8">
                <div className="lg:mx-[10rem] mx-5 md:mx-20 3xl:mx-[15rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-8">
                            <div className="3xl:pt-10">
                                <h1 className="text-2xl font-normal text-black uppercase md:text-4xl lg:text-5xl"
                                    dangerouslySetInnerHTML={{
                                        __html: mainExhibitionbuilder?.BuildSec?.heading || "Exhibition stand  <span style='color: #EA2127;'>builders</span>",
                                    }}>
                                </h1>
                                <p className="pt-5 text-sm font-bold text-black uppercase lg:text-base">
                                    {mainExhibitionbuilder?.BuildSec?.subText || "Complete Exhibition Solutions Provided Globally"}
                                </p>
                                <div className="py-5 text-sm text-[#3E444A] 3xl:text-base"
                                    dangerouslySetInnerHTML={{
                                        __html: mainExhibitionbuilder?.BuildSec?.description,
                                    }}>
                                </div>
                            </div>

                            <div className="grid md:gap-4">
                                <div className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95" onMouseEnter={() => setHoveredIndex(0)} onMouseLeave={() => setHoveredIndex(null)} >
                                    <Image src={mainExhibitionbuilder?.BuildHead?.image?.data?.attributes?.url ? `${baseUrl}${mainExhibitionbuilder?.BuildHead.image.data.attributes.url}` : "/images/ESD1.png"}
                                        layout="fill" objectFit="cover" alt="Exhibition 3" className="transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-14 py-8">
                <div className="container px-6 mx-auto">
                    <h1 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20">
                        {mainExhibitionbuilder?.BuildDes?.title || "GET YOUR OWN"}
                    </h1>
                    <p className="text-xl text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        {mainExhibitionbuilder?.BuildDes?.subTitle || "CUSTOM 3D EXHIBITION STAND DESIGN"}
                    </p>
                    <div className=" lg:mx-44 md:mx-20 3xl:mx-[6rem] mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base"
                            dangerouslySetInnerHTML={{
                                __html: mainExhibitionbuilder?.BuildDes?.description,
                            }}>
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-10 bg-white lg:py-10">
                <div className="text-center">
                    <h1 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                        {mainExhibitionbuilder?.BuildPort?.title || "Take a look at some of our work"}
                    </h1>
                    <span className="text-[#E42D39] text-xs md:text-base">
                        {mainExhibitionbuilder?.BuildPort?.SubTitle || "Lorem Ipsum is simply dummy text of the printing"}
                    </span>
                </div>
                <div className="grid lg:grid-cols-3 gap-4 lg:pt-10 lg:pb-8 pb-10 pt-10 lg:mx-48 mx-8 md:mx-40 3xl:mx-[17rem]">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href={mainExhibitionbuilder?.BuildPort?.button?.link || "/portfolio"} className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        {mainExhibitionbuilder?.BuildPort?.button?.label || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <section className="bg-[#f6f6f6] py-10">
                <h1 className="max-w-[4.2rem] text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[19rem] md:mx-32 mx-14 bg-white rounded-full px-4 py-1">
                    FAQ
                </h1>
                <div className="grid lg:grid-cols-2 lg:mx-48 md:mx-32 3xl:mx-56">
                    <div className="pt-8 mx-14 md:mx-0 3xl:mx-20">
                        <h1 className="text-xl text-black md:text-3xl lg:text-5xl"
                            dangerouslySetInnerHTML={{
                                __html: mainExhibitionbuilder?.BuildFaq?.FaqTitle || "How Can you <span style='color: #EA2127;'>brand your stand</span>",
                            }}>
                        </h1>
                    </div>
                    <div className="w-full mt-5 space-y-2 lg:-mt-8 md:mt-10 md:mx-0 px-9 md:px-0">
                        {accordion.map((item: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;
                            const contentRef = contentRefs[index];

                            return (
                                <div key={index} className="border-[#00000056] text-black bg-white rounded-3xl">
                                    <button className="flex items-center justify-between w-full p-1 text-lg font-medium text-left md:p-2 lg:p-4" onClick={() => toggleAccordion(index)}>
                                        <div className="flex items-center gap-2 lg:gap-10 3xl:gap-16 md:text-lg text-xs lg:text-base ps-4 md:ps-7 font-bold lg:max-w-[30rem] max-w-[15rem] md:max-w-[28rem] 3xl:max-w-[40rem]">
                                            {item.question}
                                        </div>
                                        <motion.div animate={{ rotate: isOpen ? 360 : 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full" >
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
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden">
                                                <div ref={contentRef} className="p-4 bg-white border-t-2 rounded-b-3xl">
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

            <section className="relative w-full">
                <ContactForm />
            </section>

        </>
    );
}