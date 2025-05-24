"use client";

import { ChevronLeft, ChevronRight, Check, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from 'swiper';
import ContactForm from "@/components/Contactform";
import { GET_WEDDING_DATA } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";

type AccordionItem = {
    question: string;
    answers: string;
};

export default function WeddingClient() {

    const swiperRef = useRef<SwiperType | null>(null);
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_WEDDING_DATA, { variables: { locale } });
    const mainWedding = data?.weddingPages?.data?.[0]?.attributes || {};
    const { Header } = mainWedding;
    const accordion = mainWedding?.WeddingFaq?.ConFaq || [];
    const WeddingSec3 = mainWedding?.WeddingSec3;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = Header?.image?.data?.attributes?.url ? `${baseUrl}${Header.image.data.attributes.url}` : "/images/Banner.jpg";
    const stats = mainWedding?.WeddingSec2?.NumberBox?.map(
        (item: { count: number; label: string }) => ({
            value: item.count,
            label: item.label,
        })
    ) || [];

    const portfolioImages = mainWedding?.WeddingPort?.InterGallery?.map(
        (item: { image: { data: { attributes: { url: string } } } }) => ({
            src: item?.image?.data?.attributes?.url ? `${baseUrl}${item.image.data.attributes.url}` : "",
        })
    ) || [];

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const Counter = ({ value }: { value: number }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let start = 0;
            const duration = 2000;
            const increment = value / (duration / 16);

            const interval = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCount(value);
                    clearInterval(interval);
                } else {
                    setCount(Math.ceil(start));
                }
            }, 16);

            return () => clearInterval(interval);
        }, [value]);

        return (
            <span className="text-2xl font-bold text-red-600 md:text-4xl">
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
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {Header?.heading || "Wedding Events"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={Header?.breadcrumb?.link1 || "/"} className="px-4 uppercase">Home</Link>
                        /
                        <Link href={Header?.breadcrumb?.link2 || "/wedding"} className="px-4 uppercase">
                            {Header?.breadcrumb?.SubHead2 || "wedding events"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-8 lg:py-10 pb-5 md:pb-8 lg:pb-0 bg-[url('/images/about.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="lg:ms-[10rem] ms-5 md:ms-20 3xl:mx-[15rem] ">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="3xl:pt-10">
                                <h1 className="lg:text-6xl md:text-[50px] text-[32px] font-bold text-black max-w-[800px] pt-12 lg:pt-0 leading-none"
                                    dangerouslySetInnerHTML={{
                                        __html: mainWedding?.WeddingSec2?.Heading || "Wedding Event <span style='color: #EA2127;'>Contractors</span>",
                                    }}>
                                </h1>
                                <p className="text-black font-light lg:text-[24px] md:text-[18px] max-w-[550px] pt-4 lg:pt-0">
                                    {mainWedding?.WeddingSec2?.SubHeading}
                                </p>
                                <div className="grid grid-cols-2 gap-8 py-5 text-left md:py-10" style={{ fontFamily: "Sora, sans-serif" }} >
                                    {stats.map((stat: { value: number; label: string }, index: number) => (
                                        <div key={index} className="flex flex-col items-left">
                                            <Counter value={stat.value} />
                                            <span className="text-xs font-medium tracking-wide text-black md:text-sm">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex lg:w-full lg:my-10">
                                <Swiper navigation={true} pagination={{ clickable: true }} modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1.1} className="w-full h-auto" >
                                    {mainWedding?.WeddingSec2?.WedSlider?.map(
                                        (
                                            item: {
                                                image: { data: { attributes: { url: string } } };
                                            },
                                            index: number
                                        ) => (
                                            <SwiperSlide key={index}>
                                                <div className="relative w-full h-full overflow-hidden rounded-lg">
                                                    <Image src={`${baseUrl}${item.image.data.attributes.url}`} alt={`Wedding ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                                                </div>
                                            </SwiperSlide>
                                        )
                                    )}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#d8dde0]">
                <div className="grid pt-12 mx-12 md:grid-cols-2 lg:mx-52 3xl:mx-64 lg:pt-10 md:pt-16 md:mx-28">
                    <div>
                        <h1 className="text-[24px] md:text-[36px] text-black font-sans font-bold uppercase">
                            {WeddingSec3?.Heading || "Our Services"}
                        </h1>
                        <p className="text-[14px] md:text-[20px] text-[#ea2127]">
                            {WeddingSec3?.SubHeading || "Complete Exhibition Solutions Provided Globally"}
                        </p>
                    </div>
                    <div className="hidden md:text-center md:justify-center md:items-end md:block">
                        <div className="relative flex space-x-2 md:items-center md:space-x-10 md:justify-center lg:justify-end">
                            <button className="custom-prev lg:w-14 lg:h-14 w-10 h-10 flex items-center justify-center bg-[#FB6F6F] hover:bg-[#FB6F6F] rounded-full transition z-10" onClick={() => swiperRef.current?.slidePrev()} >
                                <ChevronLeft size={24} className="text-gray-700" />
                            </button>
                            <button className="custom-next lg:w-14 lg:h-14 w-10 h-10 flex items-center justify-center bg-[#FB6F6F] hover:bg-[#FB6F6F] rounded-full transition z-10" onClick={() => swiperRef.current?.slideNext()} >
                                <ChevronRight size={24} className="text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:mt-1 lg:ms-44 md:ms-20 3xl:ms-56">
                    <Swiper modules={[Pagination]} spaceBetween={30} slidesPerView={1} pagination={{ clickable: true }} onSwiper={(swiper) => (swiperRef.current = swiper)} >
                        {WeddingSec3?.Slider?.map((
                            slide: {
                                title: string; Subtitle: string; description: string;
                                image?: {
                                    data?: { attributes?: { url: string; }; };
                                };
                            }, index: number) => (
                            <SwiperSlide key={index} className="p-8 text-black rounded-lg">
                                <div className="flex flex-col lg:flex-row">
                                    <Image src={`${baseUrl}${slide.image?.data?.attributes?.url}`} alt={slide.title || "Slide Image"} width={450} height={300} className="object-cover rounded-lg ps-2" />
                                    <div className="p-6 lg:px-20 md:px-5 lg:pr-32 3xl:pr-48">
                                        <h2 className="text-xl font-bold uppercase md:text-3xl">{slide.title}</h2>
                                        <p className="text-sm font-semibold mt-2 text-[#ea2127]">{slide.Subtitle}</p>
                                        <p className="text-xs text-justify md:text-base" dangerouslySetInnerHTML={{ __html: slide.description }}></p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <section className="py-10 bg-white lg:py-14">
                <div className="text-center">
                    <h1 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                        {mainWedding?.WeddingPort?.heading || "Take a look at some of our work"}
                    </h1>
                    <span className="text-[#E42D39] text-xs md:text-base">
                        {mainWedding?.WeddingPort?.SubHeading || "Lorem Ipsum is simply dummy text of the printing"}
                    </span>
                </div>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4 lg:pt-10 lg:pb-10 pb-10 pt-10 lg:mx-60 mx-8 md:mx-20 3xl:mx-[18rem]">
                    {portfolioImages.map((item: { src: string }, index: number) => (
                        <div key={index} className="relative w-full h-[10rem] md:h-[12rem] lg:h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/portfolio" className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all" >
                        {mainWedding?.WeddingPort?.BtnLabel || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <section className="bg-[#d8dde0] py-10">
                <h1 className="lg:text-4xl md:text-3xl text-xl text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[17rem] md:mx-24 mx-14 lg:pb-8"
                    dangerouslySetInnerHTML={{ __html: mainWedding?.WeddingFaq?.FaqTitle || "FAQ's", }}>
                </h1>
                <div className="flex items-center justify-center py-5 lg:py-0 lg:pb-10 md:py-8">
                    <div className="w-full lg:max-w-6xl md:max-w-xl 3xl:max-w-[85rem] max-w-xs space-y-2">
                        {accordion.map((item: AccordionItem, index: number) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="border-b-2 border-[#00000056] text-black" >
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
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden" >
                                                <div className="p-4 bg-[#d8dde0]">
                                                    <div className="lg:ms-10 ms-5">
                                                        {item.answers.split("\n").map((answer: string, i: number) => (
                                                            <p key={i} className="pl-5 list-disc" dangerouslySetInnerHTML={{ __html: answer }} />
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