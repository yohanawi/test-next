"use client";

import { Navigation, Pagination } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import "swiper/css";

export default function CommercialInteriorClient({ mainFitOut, isAccordion }: { mainFitOut: any; isAccordion?: boolean }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

    const sliderImages = mainFitOut?.FitOutSec2?.InterSlider?.map(
        (item: { image: { data: { attributes: { url: string } } } }) => ({
            src: item?.image?.data?.attributes?.url ? `${baseUrl}${item.image.data.attributes.url}` : "",
        })
    ) || [];

    const accordion = mainFitOut?.FitOutFaq?.ConFaq || [];
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (isAccordion) {
        return (
            <div className="flex items-center justify-center py-5 lg:py-0 lg:pb-10 md:py-8">
                <div className="w-full lg:max-w-6xl md:max-w-xl 3xl:max-w-[85rem] max-w-xs space-y-2">
                    {accordion.map((item: { question: string, answers: string }, index: number) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index} className="border-b-2 border-[#00000056] text-black" >
                                <button className="flex items-center justify-between w-full p-4 text-lg font-medium text-left" onClick={() => toggleAccordion(index)}>
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
                                        <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden" >
                                            <div className="p-4 border-t bg-gray-50">
                                                <div className="lg:ms-16 ms-6 md:ms-8">
                                                    {item.answers.split("\n").map((answer: string, i: number) => (
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
        );
    }

    return (
        <section className="px-8 py-10 bg-white lg:py-12">
            <div className="lg:mx-[10rem] mx-5 md:mx-20 3xl:mx-[15rem]">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="3xl:pt-10">
                            <h2 className="text-xl font-normal text-black uppercase md:text-4xl lg:text-5xl 3xl:leading-normal"
                                dangerouslySetInnerHTML={{
                                    __html: mainFitOut?.FitOutSec2?.Heading || "COMMERCIAL <span style='color: #EA2127;'>INTERIORS</span>",
                                }}>
                            </h2>
                            <p className="pt-5 text-sm font-bold text-black uppercase lg:text-base">
                                {mainFitOut?.FitOutSec2?.SubHeading || "No.1 commercial interior design company in Dubai, UAE"}
                            </p>
                            <div className="lg:py-8 py-5 text-sm text-[#3E444A] 3xl:text-base"
                                dangerouslySetInnerHTML={{
                                    __html: mainFitOut?.FitOutSec2?.Description,
                                }}>
                            </div>
                        </div>

                        <div className="lg:w-full">
                            <Swiper navigation={true} pagination={{ clickable: true }} modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1.1} className="w-full h-auto">
                                {sliderImages.length > 0 ? (
                                    sliderImages.map((item: { src: string }, index: number) => (
                                        <SwiperSlide key={index}>
                                            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                                                <Image src={item.src} alt={`Slide ${index + 1}`} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw" />
                                            </div>
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                                            <Image src="/images/05.jpg" alt="Placeholder" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw" />
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}