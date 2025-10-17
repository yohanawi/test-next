"use client";

import { GET_CITY_DETAIL, GET_EXHIBITION_PAGE_DATA } from "@/lib/queries";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import ContactForm from "@/components/Contactform";
import { Check, Minus, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { Pagination } from "swiper/modules";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import "swiper/css";

interface CardData {
    title: string;
    link?: string;
    image?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
}

interface ImgItem {
    image?: {
        data?: {
            attributes?: {
                url?: string;
                alternativeText?: string;
            };
        };
    };
}

export default function CitiesClient() {

    const { city } = useParams();
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_CITY_DETAIL, { variables: { slug: city, locale }, skip: !city, });
    const { data: exhibitionData } = useQuery(GET_EXHIBITION_PAGE_DATA, { variables: { locale }, });
    const mainExhibition = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const { services } = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const cityDetail = data?.cityDetails?.data?.[0]?.attributes || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [, setHoveredIndex] = useState<number | null>(null);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const serviceCards = [
        {
            image: services?.image01?.data?.attributes?.url ? `${baseUrl}${services.image01.data.attributes.url}` : "/images/exhibition-ser1.png",
            title: services?.label01 || "Exhibition Stand Contractor",
            link: services?.link1 || "/exhibition-stand-contractors-in-abu-dubai",
        },
        {
            image: services?.image02?.data?.attributes?.url ? `${baseUrl}${services.image02.data.attributes.url}` : "/images/exhibition-ser2.png",
            title: services?.label02 || "Exhibition Stand Designs",
            link: services?.link2 || "/exhibition-stand-designer-in-abu-dubai",
        },
        {
            image: services?.image03?.data?.attributes?.url ? `${baseUrl}${services.image03.data.attributes.url}` : "/images/exhibition-ser3.png",
            title: services?.label03 || "Exhibition Stand Builders",
            link: services?.link3 || "/exhibition-stand-builders-in-abu-dubai",
        },
    ];

    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={cityDetail?.HeroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${cityDetail.HeroSec.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt={cityDetail?.HeroSec?.title || "Exhibition Stand"} />
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-2xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {cityDetail?.HeroSec?.title}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/top-city" className="px-4 uppercase">Top Sites</Link>
                        /
                        <Link href={`/top-city/${cityDetail?.slug}`} className="px-4 uppercase">
                            Exhibition Stand in {cityDetail?.HeroSec?.title}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-8 bg-white 3xl:px-0 lg:py-14 py-14">
                <div className="lg:mx-36 mx-5 md:mx-20 3xl:mx-[17rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-2xl font-normal text-black uppercase md:text-4xl lg:text-5xl"
                                    dangerouslySetInnerHTML={{
                                        __html: cityDetail?.SecondSec?.title || "Exhibition Stand",
                                    }}>
                                </h2>
                                <div className="lg:py-8 py-5 text-sm text-[#3E444A] 3xl:text-base">
                                    <p>{cityDetail?.SecondSec?.description}</p>
                                    <p className="mt-4">{cityDetail?.SecondSec?.description2}</p>
                                </div>
                                <div className="grid gap-4 mt-6 text-xs text-black md:grid-cols-2 3xl:text-sm">
                                    {cityDetail?.SecondSec?.ExhiList?.map(
                                        (item: { lable: string }, index: number) => (
                                            <div key={index} className="flex items-center gap-6">
                                                <Image src="/images/correct-icon.png" alt="Correct Icon" width={17} height={17} layout="fixed" priority quality={30} />
                                                {item.lable}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    cityDetail?.SecondSec?.image1,
                                    cityDetail?.SecondSec?.image2,
                                    cityDetail?.SecondSec?.image3,
                                    cityDetail?.SecondSec?.image4,
                                ]
                                    .filter((img) => img?.data?.attributes?.url).map((img, index) => (
                                        <div key={index} className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95"
                                            onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} >
                                            <Image src={`${baseUrl}${img.data.attributes.url}`} layout="fill" objectFit="cover" alt={img.data.attributes.alternativeText || `Exhibition ${index + 1}`}
                                                className="object-cover w-full h-full transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#d8dde0] py-5 md:py-[70px] lg:py-10">
                <div className="grid lg:grid-cols-2 lg:mx-44 mx-14 md:mx-32 lg:gap-8 3xl:mx-[17rem]">
                    <h2 className="text-[20px] md:text-[30px] lg:text-[36px] font-sans font-semibold text-black">
                        {cityDetail?.ThirdSec?.mainTitle}
                    </h2>
                    <div className="text-black lg:text-right">
                        <p className="text-[18px] lg:text-[18px] hidden lg:block font-sans font-normal">
                            {cityDetail?.ThirdSec?.subTitle}
                        </p>
                        <br />
                        <Link href={cityDetail?.ThirdSec?.link || "/"} className="group underline underline-offset-8 inline-flex items-center text-sm md:text-lg lg:text-base lg:pt-0 md:pt-6 font-sans font-normal hover:text-[#EA2127]" >
                            {cityDetail?.ThirdSec?.linkLabel}
                            <span className=" transition-transform duration-300 group-hover:translate-x-2 hover:text-[#EA2127]">
                                ➔
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mx-6 md:mx-12 lg:mx-44 md:mt-5 lg:mt-8 3xl:mx-[17rem]">
                    {cityDetail?.ThirdSec?.card?.map((card: CardData, index: number) => (
                        <div key={index} className="relative overflow-hidden transition-transform h-[330px] hidden lg:block group" >
                            <div className="absolute inset-x-0 bottom-[-100%] h-60 bg-gradient-to-t from-gray-800 via-transparent to-transparent group-hover:opacity-100 transition-all duration-300 group-hover:bottom-0 z-10"></div>
                            <div className="absolute inset-0 transition-all duration-300 bg-center bg-cover group-hover:scale-110"
                                style={{ backgroundImage: `url(${baseUrl}${card?.image?.data?.attributes?.url})`, }}>
                            </div>
                            <Link href={`${card?.link || "/#"}`}>
                                <div className="absolute z-50 flex items-center justify-between bottom-4 left-4 right-4">
                                    <h2 className="text-white text-[14px] font-semibold uppercase" style={{ fontFamily: "Work Sans, sans-serif" }} >
                                        {card.title}
                                    </h2>
                                    <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                                        ➔
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))}
                    <div className="relative block mx-4 mt-10 lg:hidden md:mx-20">
                        <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={10} centeredSlides={false} slidesPerView={1.1} className="w-full"
                            navigation={{ nextEl: ".swiper-next1", prevEl: ".swiper-prev1", }} >
                            {cityDetail?.ThirdSec?.card?.map((card: CardData, index: number) => (
                                <SwiperSlide key={index}>
                                    <div className="relative overflow-hidden transition-transform lg:h-[400px] h-[300px] ">
                                        <div className="absolute inset-x-0 bottom-[-100%] h-60 bg-gradient-to-t from-gray-800 via-transparent to-transparent group-hover:opacity-100 transition-all duration-300 group-hover:bottom-0 z-10"></div>
                                        <div className="absolute inset-0 transition-all duration-300 bg-center bg-cover group-hover:scale-110"
                                            style={{ backgroundImage: `url(${baseUrl}${card?.image?.data?.attributes?.url})`, }}>
                                        </div>
                                        <Link href={card?.link || "#"}>
                                            <div className="absolute flex items-center justify-between bottom-4 left-4 right-4 group">
                                                <h2 className="text-white text-[14px] font-semibold uppercase">
                                                    {card.title}
                                                </h2>
                                                <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                                                    ➔
                                                </button>
                                            </div>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-14 md:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 lg:text-4xl md:text-3xl"
                        dangerouslySetInnerHTML={{
                            __html: mainExhibition?.services?.title || "EXHIBITION <span style='color: #EA2127;'>SERVICES</span>",
                        }}>
                    </h2>
                    <p className="mx-auto mt-4 text-gray-600 md:max-w-lg lg:max-w-3xl 3xl:text-lg">
                        {mainExhibition?.services?.description}
                    </p>
                    <div className="grid lg:grid-cols-3 gap-8 mt-10 lg:mx-40 md:mx-40 3xl:mx-[7rem]">
                        {serviceCards.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-lg group" >
                                <Link href={item.link}>
                                    <Image src={item.image} alt={item.title} width={400} height={300} className="w-full transition-transform duration-300 ease-in-out hover:scale-105" />
                                    <div className="p-4 bg-white text-black font-semibold text-lg text-center group-hover:text-[#f55152]">
                                        {item.title}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-10 bg-white lg:py-14">
                <div className="flex items-center justify-center">
                    <div className="w-full lg:max-w-[74rem] md:max-w-xl 3xl:max-w-[84rem] max-w-xs space-y-2">
                        {cityDetail?.FAQSec?.faqList?.map((faq: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="border-b-2 border-[#00000056] text-black" >
                                    <button className="flex items-center justify-between w-full p-4 text-lg font-medium text-left" onClick={() => toggleAccordion(index)}>
                                        <div className="flex items-center gap-2 text-base 3xl:gap-16 lg:text-lg">
                                            <Check className="text-black" />
                                            {faq.question}
                                        </div>
                                        {isOpen ? (
                                            <Minus className="text-gray-600" />
                                        ) : (
                                            <Plus className="text-gray-600" />
                                        )}
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1, }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden">
                                                <div className="p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: faq.answers }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="grid gap-4 py-5 mx-4 lg:grid-cols-3 md:grid-cols-1 lg:pt-4 lg:mx-6 md:mx-40">
                    {cityDetail?.ImgSec?.img?.map((img: ImgItem, index: number) => (
                        <div key={index} className="relative w-full lg:h-[27rem] 3xl:h-[32rem] h-[20rem] group overflow-hidden" >
                            {img.image?.data?.attributes?.url && (
                                <Image src={`${baseUrl}${img.image.data.attributes.url}`} alt={img.image.data.attributes.alternativeText || `Portfolio ${index + 1}`}
                                    layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}