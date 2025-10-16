"use client";

import HomeEventSection from "@/components/HomeEventSection";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { GET_TRADESHOW_DATA } from "@/lib/queries";
import { ArrowUp, ArrowDown } from "lucide-react";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface TradeCardItem {
    Image?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
    label?: string;
}

export default function TradeShowClient() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_TRADESHOW_DATA, { variables: { locale } });
    const mainTradeShow = data?.tradeShows?.data?.[0]?.attributes || {};
    const { TradeHead } = mainTradeShow;
    const { TradeShowSec2 } = mainTradeShow;
    const tradeProcess = mainTradeShow?.TradeProcess || {};
    const accordion = mainTradeShow?.TradeFaq?.ConFaq || [];
    const bannerCard = mainTradeShow?.BannerCard || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = TradeHead?.image?.data?.attributes?.url ? `${baseUrl}${TradeHead.image.data.attributes.url}` : "/images/Banner.jpg";
    const tradeImage = mainTradeShow?.Image?.data?.attributes?.url ? `${baseUrl}${mainTradeShow.Image.data.attributes.url}` : "/images/trade4.png";
    const banner2Image = mainTradeShow?.Banner?.data?.attributes?.url ? `${baseUrl}${mainTradeShow.Banner.data.attributes.url}` : "/images/Rectangle 7.png";

    const card = TradeShowSec2?.TradeCard?.map((item: TradeCardItem) => ({
        image: item?.Image?.data?.attributes?.url ? `${baseUrl}${item.Image.data.attributes.url}` : "",
        title: item?.label || "No Label",
    })) || [];

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [contentRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev: number | null) => (prev === index ? null : index));
    };

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {TradeHead?.heading || "trade show booth"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={TradeHead?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {TradeHead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={TradeHead?.breadcrumb?.link2 || "/trade-show"} className="px-4 uppercase">
                            {TradeHead?.breadcrumb?.SubHead2 || "trade show booth"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center md:py-14 py-8">
                <div className="container px-6 mx-auto">
                    <div className="lg:w-[500px] md:w-[450px] mx-auto">
                        <h2 className="text-xl font-semibold text-gray-900 lg:text-4xl md:text-3xl" style={{ fontFamily: "Work Sans, sans-serif" }}
                            dangerouslySetInnerHTML={{
                                __html: mainTradeShow?.TradeShowSec2?.Heading || "Trade Show Booth Designs to Boost<span style='color: #EA2127;'>Your Brand</span>",
                            }}>
                        </h2>
                    </div>
                    <div className="grid gap-8 mt-10 lg:grid-cols-3 lg:mx-52 md:mx-40">
                        {card.map((item: { title: string, image: string }, index: number) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-lg group" >
                                <Image src={item.image} alt={item.title} width={400} height={400} className="w-full transition-transform duration-300 ease-in-out group-hover:scale-105" />
                                <div className="bg-[#fafafa] text-black font-semibold text-sm md:text-base text-center font-sans px-4 py-3 group-hover:text-[#E21F2C]">
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center pt-10">
                        <Link href="/free-design">
                            <button className="uppercase bg-white text-center text-[#E21F2C] border border-[#E21F2C] text-xs font-sans font-semibold lg:px-6 px-4 py-2 rounded-md hover:bg-[#E21F2C] hover:text-white transition">
                                Get a Quote
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] font-sans">
                <div className="container px-6 py-6 mx-auto lg:py-20 md:py-10">
                    <div className="mx-6 lg:mx-52 md:mx-24">
                        <h2 className="text-xl font-normal text-center text-gray-900 lg:text-4xl md:text-3xl"
                            dangerouslySetInnerHTML={{
                                __html: mainTradeShow?.Heading || "Building Modern Trade Show Booths Across Dubai to Help<span style='color: #EA2127;'>Your Brand Grow</span>",
                            }}>
                        </h2>
                        <p className="mt-4 text-xs text-center text-gray-700 md:text-base" dangerouslySetInnerHTML={{ __html: mainTradeShow?.description1 }}></p>
                    </div>
                </div>
                <div className="3xl:-ms-32 bg-[#D8DDE0] lg:py-10 md:py-8 py-5">
                    <div className="grid items-stretch lg:grid-cols-2">
                        <div className="flex items-center justify-center lg:justify-end">
                            <div className="relative w-[300px] md:w-[500px] lg:h-full md:h-[450px] h-[250px]">
                                <Image src={tradeImage} layout="fill" objectFit="cover" alt="Event 1" />
                            </div>
                        </div>
                        <div className="lg:px-8 md:p-8 p-8 lg:p-0 lg:mr-52 lg:mx-0 mx-4 md:mx-24 3xl:max-w-[700px]">
                            <h2 className="text-lg font-normal text-black uppercase lg:text-2xl md:text-2xl"
                                dangerouslySetInnerHTML={{
                                    __html: mainTradeShow?.heading2 || "Ensuring Excellence with <span style='color: #EA2127;'>our Trade Show Booth Rentals</span>",
                                }}>
                            </h2>
                            <p className="mt-4 text-sm text-black"
                                dangerouslySetInnerHTML={{
                                    __html: mainTradeShow?.description2,
                                }}>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="relative w-full lg:h-[400px] h-[150px] md:h-[200px]">
                    <div className="relative w-full h-full">
                        <Image src={banner2Image} layout="fill" objectFit="cover" alt="Banner" objectPosition="bottom" />
                    </div>
                </div>
            </section>

            <section className="bg-[#41474D] text-white lg:py-20 md:py-12 py-10 px-6 md:px-32 lg:px-56 3xl:px-[25rem]">
                <div className="grid lg:grid-cols-2 lg:gap-20">
                    <div>
                        <h2 className="text-xl font-bold md:text-3xl lg:text-4xl">
                            {tradeProcess?.title || "Production Processes"}
                        </h2>
                        <h5 className="py-5 md:text-lg text-[#EA2127]">
                            {tradeProcess?.subtitle || "Lorem Ipsum is simply dummy text"}
                        </h5>
                        <p className="text-gray-300"
                            dangerouslySetInnerHTML={{
                                __html: tradeProcess?.description || "",
                            }}>
                        </p>
                    </div>
                    <div className="relative w-full lg:w-[40rem] md:h-[20rem] h-[12rem] lg:h-96">
                        <Image src="/images/XESS-Process-Road-map.png" layout="fill" alt="Event 1" />
                    </div>
                </div>
            </section>

            <HomeEventSection />

            <section className="bg-[#f6f6f6] md:py-10 py-4">
                <div className="relative h-[170px] md:h-[150px] lg:h-[140px] lg:px-56 md:px-32 lg:mx-8 px-10 3xl:px-[350px]">
                    <div className="relative w-full h-full">
                        <Image src="/images/Group 11.png" alt="Exhibition Stand" layout="fill" objectFit="cover" className="rounded-md" />
                        <div className="absolute inset-0 flex flex-col items-center px-6 py-2 my-4 lg:justify-between md:px-12 lg:px-20 lg:flex-row md:my-4">
                            <div className="text-center text-white lg:text-left">
                                <h2 className="text-sm font-semibold md:text-base lg:text-xl">
                                    {bannerCard?.lable1 || "Let's talk about your exhibition stand"}
                                </h2>
                                <p className="py-2 text-xs md:text-sm">
                                    {bannerCard?.lable2 || "We'll turn it into a 3D Design in 5 Days."}
                                </p>
                            </div>
                            {bannerCard?.button?.length > 0 && (
                                <Link href={bannerCard.button[0]?.link || "/free-design"}>
                                    <button className="bg-white text-black text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 hover:bg-[#EA2127] hover:text-white">
                                        {bannerCard.button[0]?.label || "GET A FREE 3D DESIGN"}
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#D8DDE0] py-10">
                <h2 className="max-w-[4.2rem] text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[19rem] md:mx-32 mx-14 bg-white rounded-full px-4 py-1"
                    dangerouslySetInnerHTML={{
                        __html: mainTradeShow?.TradeFaq?.FaqTitle || "FAQ",
                    }}
                ></h2>
                <div className="grid lg:grid-cols-2 lg:mx-48 md:mx-32 3xl:mx-56">
                    <div className="pt-8 mx-14 md:mx-0 3xl:mx-20">
                        <h2 className="text-xl text-black md:text-3xl lg:text-5xl">
                            Partner with the best exhibition stand contractors in Dubai
                        </h2>
                    </div>
                    <div className="w-full mt-5 space-y-2 lg:-mt-8 md:mt-10 md:mx-0 px-9 md:px-0">
                        {accordion.map((item: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;
                            const contentRef = contentRefs[index];

                            return (
                                <div key={index} className="border-[#00000056] text-black bg-white rounded-3xl" >
                                    <button className="flex items-center justify-between w-full p-1 text-lg font-medium text-left md:p-2 lg:p-4" onClick={() => toggleAccordion(index)} >
                                        <div className="flex items-center gap-2 lg:gap-10 3xl:gap-16 md:text-lg text-xs lg:text-base ps-4 md:ps-7 font-bold lg:max-w-[30rem]">
                                            {item.question}
                                        </div>
                                        <motion.div animate={{ rotate: isOpen ? 360 : 0 }} transition={{ duration: 0.5 }}
                                            className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full" >
                                            {isOpen ? (
                                                <ArrowUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ArrowDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: contentRef?.current?.scrollHeight || "auto", opacity: 1, }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className="overflow-hidden" >
                                                <div ref={contentRef} className="p-4 border-t-2 bg-gray-50 rounded-b-3xl" >
                                                    {item.answers?.split("\n").map((line: string, i: number) => (
                                                        <p key={i} className="text-xs list-disc md:text-lg ps-7" dangerouslySetInnerHTML={{ __html: line }} />
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