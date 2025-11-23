"use client";

import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

interface SlideItem {
    title: string;
    Subtitle: string;
    description: string;
    image?: { data?: { attributes?: { url?: string } } };
}

export default function ServicesSlider({
    baseUrl,
    section,
}: {
    baseUrl: string;
    section?: { Heading?: string; SubHeading?: string; Slider?: SlideItem[] };
}) {
    const swiperRef = useRef<SwiperType | null>(null);
    const slides = section?.Slider || [];
    if (!slides.length) return null;

    return (
        <section className="bg-[#d8dde0] py-10">
            <div className="grid gap-6 mx-12 md:grid-cols-2 lg:mx-52 md:mx-28">
                <div>
                    <h2 className="text-[24px] md:text-[36px] text-black font-sans font-bold uppercase">
                        {section?.Heading || "Our Services"}
                    </h2>
                    <p className="text-[14px] md:text-[20px] text-[#ea2127]">
                        {section?.SubHeading || "Complete Exhibition Solutions Provided Globally"}
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
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className="p-8 text-black rounded-lg">
                            <div className="flex flex-col lg:flex-row">
                                <Image
                                    src={`${baseUrl}${slide.image?.data?.attributes?.url ?? ""}`}
                                    alt={slide.title || "Slide Image"}
                                    width={450}
                                    height={300}
                                    className="object-cover rounded-lg ps-2"
                                />
                                <div className="p-6 lg:px-20 md:px-5 lg:pr-32 3xl:pr-48">
                                    <h2 className="text-xl font-bold uppercase md:text-3xl">{slide.title}</h2>
                                    <p className="text-sm font-semibold mt-2 text-[#ea2127]">{slide.Subtitle}</p>
                                    <p
                                        className="text-xs text-justify md:text-base"
                                        dangerouslySetInnerHTML={{ __html: slide.description }}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
