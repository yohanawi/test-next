"use client";

import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { GET_BACKDROP_DATA } from "@/lib/queries";
import { Check, Minus, Plus } from "lucide-react";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StagesClient() {

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_BACKDROP_DATA, { variables: { locale }, });
    const mainBackdrop = data?.backdropPage?.data?.attributes || {};
    const { BackDropHead } = mainBackdrop;
    const accordion = mainBackdrop?.BackDDropFaq?.ConFaq || [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = BackDropHead?.image?.data?.attributes?.url ? `${baseUrl}${BackDropHead.image.data.attributes.url}` : "/images/Banner.jpg";

    const portfolioImages = [
        { src: mainBackdrop?.BackDropPort?.image1?.data?.attributes?.url ? `${baseUrl}${mainBackdrop.BackDropPort.image1.data.attributes.url}` : "/images/portfolio1.png" },
        { src: mainBackdrop?.BackDropPort?.image2?.data?.attributes?.url ? `${baseUrl}${mainBackdrop.BackDropPort.image2.data.attributes.url}` : "/images/portfolio2.png" },
        { src: mainBackdrop?.BackDropPort?.image3?.data?.attributes?.url ? `${baseUrl}${mainBackdrop.BackDropPort.image3.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainBackdrop?.BackDropPort?.image4?.data?.attributes?.url ? `${baseUrl}${mainBackdrop.BackDropPort.image4.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainBackdrop?.BackDropPort?.image5?.data?.attributes?.url ? `${baseUrl}${mainBackdrop.BackDropPort.image5.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainBackdrop?.BackDropPort?.image6?.data?.attributes?.url ? `${baseUrl}${mainBackdrop.BackDropPort.image6.data.attributes.url}` : "/images/portfolio3.png" },
    ];

    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">{BackDropHead?.heading || "Exhibition Stages and Backdrops"}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={mainBackdrop?.breadcrumb?.link1 || "/"} className="px-4 uppercase">{BackDropHead?.breadcrumb?.SubHead1 || "Home"}</Link>
                        /
                        <Link href={mainBackdrop?.breadcrumb?.link2 || "/stages-backdrops"} className="px-4 uppercase">{BackDropHead?.breadcrumb?.SubHead2 || "Exhibition Stages and Backdrops"}</Link>
                    </div>
                </div>
            </section>

            <section className="px-8 py-5 bg-white lg:py-12 md:py-10">
                <div className="lg:mx-[10rem] mx-5 md:mx-20 3xl:mx-[15rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-8">
                            <div className="3xl:pt-10">
                                <h1 className="text-xl font-normal text-black uppercase md:text-4xl lg:text-5xl 3xl:leading-normal" dangerouslySetInnerHTML={{
                                    __html: mainBackdrop?.BackDropSec?.heading || "Stages and backdrops <span style='color: #EA2127;'>for events</span>",
                                }}>
                                </h1>
                                <p className="pt-5 text-sm font-bold text-black uppercase lg:text-base">{mainBackdrop?.BackDropSec?.subText || "No.1 commercial interior design company in Dubai, UAE"}</p>
                                <div className="lg:py-8 py-5 text-sm text-[#3E444A] 3xl:text-base" dangerouslySetInnerHTML={{
                                    __html: mainBackdrop?.BackDropSec?.description
                                }}>
                                </div>
                            </div>

                            <div className="grid md:gap-4">
                                <div className="relative w-full lg:h-auto col-span-2 h-[14rem] md:h-[24rem]">
                                    <Image src={mainBackdrop?.BackDropSec?.image?.data?.attributes?.url ? `${baseUrl}${mainBackdrop?.BackDropSec.image.data.attributes.url}` : "/images/stages.png"} layout="fill" objectFit="cover" alt="Exhibition 3" className="rounded-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >

            <section className="bg-[#f6f6f6] text-center lg:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h1 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20">{mainBackdrop?.Heading || "GET YOUR OWN"}</h1>
                    <p className="text-lg text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        {mainBackdrop?.SubHeading || "CUSTOM EXHIBITION STAND Builders"}
                    </p>
                    <div className=" lg:mx-44 md:mx-20 3xl:mx-[6rem] mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base" dangerouslySetInnerHTML={{ __html: mainBackdrop?.description }}></p>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-white lg:pb-20 lg:pt-14">
                <div className="mx-20 text-center md:mx-0">
                    <h1 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">{mainBackdrop?.BackDropPort?.title || "Take a look at some of our work"}</h1>
                    <span className="text-[#E42D39] text-xs md:text-base">{mainBackdrop?.BackDropPort?.SubTitle || "Lorem Ipsum is simply dummy text of the printing"}</span>
                </div>
                <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 lg:pt-10 lg:pb-14 md:pb-16 pb-5 pt-5 lg:mx-60 mx-8 md:mx-40 3xl:mx-[18rem]">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full h-[8rem] md:h-[14rem] lg:h-[20rem] group overflow-hidden">
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href={mainBackdrop?.BackDropPort?.button?.link || "/portfolio"} className=" uppercase border border-[#E21F2C] text-[#E21F2C] text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        {mainBackdrop?.BackDropPort?.button?.label || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <section className="pt-5 pb-10 bg-white md:pb-10">
                <h1 className="lg:text-4xl md:text-2xl text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[17rem] md:mx-32 mx-16 lg:pb-8"
                    dangerouslySetInnerHTML={{ __html: mainBackdrop?.BackDDropFaq?.FaqTitle || "How Can you build <span style='color: #EA2127;'>your stand</span>" }}>
                </h1>
                <div className="flex items-center justify-center py-5 lg:py-0 lg:pb-10 md:py-8">
                    <div className="w-full lg:max-w-6xl md:max-w-xl 3xl:max-w-[85rem] max-w-xs space-y-2">
                        {accordion.map((item: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="border-b-2 border-[#00000056] text-black">
                                    <button className="flex items-center justify-between w-full p-4 text-lg font-medium text-left" onClick={() => toggleAccordion(index)} >
                                        <div className="flex items-center gap-2 text-base lg:gap-10 3xl:gap-16 lg:text-lg">
                                            <Check className="text-black" />
                                            {item.question}
                                        </div>
                                        {isOpen ? (
                                            <Minus className="text-gray-600" />
                                        ) : (
                                            <Plus className="text-gray-600" />
                                        )}
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="overflow-hidden">
                                                <div className="p-4 border-t bg-gray-50">
                                                    <div className="lg:ms-16 md:ms-8 ms-5">
                                                        {item.answers.split('\n').map((answer: string, i: number) => (
                                                            <p key={i} className="list-disc" dangerouslySetInnerHTML={{ __html: answer }} />
                                                        ))}
                                                    </div>
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