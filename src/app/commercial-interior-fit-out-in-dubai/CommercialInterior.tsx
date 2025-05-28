"use client";

import { Navigation, Pagination } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { Swiper, SwiperSlide } from "swiper/react";
import { Check, Minus, Plus } from "lucide-react";
import { GET_FITOUT_DATA } from "@/lib/queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";

export default function CommercialInterior() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_FITOUT_DATA, { variables: { locale } });
    const mainFitOut = data?.fitOutPages?.data?.[0]?.attributes || {};
    const { FitOutHead } = mainFitOut;
    const accordion = mainFitOut?.FitOutFaq?.ConFaq || [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = FitOutHead?.image?.data?.attributes?.url ? `${baseUrl}${FitOutHead.image.data.attributes.url}` : "/images/Banner.jpg";

    const sliderImages = mainFitOut?.FitOutSec2?.InterSlider?.map(
        (item: { image: { data: { attributes: { url: string } } } }) => ({
            src: item?.image?.data?.attributes?.url ? `${baseUrl}${item.image.data.attributes.url}` : "",
        })
    ) || [];

    const portfolioImages = mainFitOut?.FitOutPort?.InterGallery?.map(
        (item: { image: { data: { attributes: { url: string } } } }) => ({
            src: item?.image?.data?.attributes?.url ? `${baseUrl}${item.image.data.attributes.url}` : "",
        })
    ) || [];

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {FitOutHead?.heading || "Commercial interior fit-out"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={FitOutHead?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {FitOutHead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={FitOutHead?.breadcrumb?.link2 || "/commercial-interior-fit-out-in-dubai"} className="px-4 uppercase" >
                            {FitOutHead?.breadcrumb?.SubHead2 || "Commercial interior fit-out"}
                        </Link>
                    </div>
                </div>
            </section>

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

            <section className="bg-[#f6f6f6] text-center lg:py-16 md:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20">
                        {mainFitOut?.topic || "GET YOUR OWN"}
                    </h2>
                    <p className="text-xl text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        {mainFitOut?.SubTopic || "CUSTOM EXHIBITION STAND Builders"}
                    </p>
                    <div className=" lg:mx-44 md:mx-20 3xl:mx-[6rem] mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base" dangerouslySetInnerHTML={{ __html: mainFitOut?.description }}></p>
                    </div>
                </div>
            </section>

            <section className="py-10 bg-white lg:pb-10 lg:pt-10">
                <div className="mx-20 text-center md:mx-0">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                        {mainFitOut?.FitOutPort?.heading || "Take a look at some of our work"}
                    </h2>
                    <span className="text-[#E42D39] text-xs md:text-base">
                        {mainFitOut?.FitOutPort?.SubHeading || "Lorem Ipsum is simply dummy text of the printing"}
                    </span>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 lg:pt-10 lg:pb-5 md:pb-16 pb-10 pt-10 lg:mx-60 mx-8 md:mx-40 3xl:mx-[18rem]">
                    {portfolioImages.map((item: { src: string }, index: number) => (
                        <div key={index} className="relative w-full h-[18rem] md:h-[14rem] lg:h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/portfolio" className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all" >
                        {mainFitOut?.FitOutPort?.BtnLabel || "view more portfolio"}
                    </Link>
                </div>
            </section>

            <section className="pt-5 pb-10 bg-white md:pb-20">
                <h2 className="lg:text-4xl md:text-3xl text-xl text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[17rem] md:mx-24 mx-14 lg:pb-8"
                    dangerouslySetInnerHTML={{
                        __html: mainFitOut?.FitOutFaq?.FaqTitle || "How Can you build <span style='color: #EA2127;'>your stand</span>",
                    }}>
                </h2>
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
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}