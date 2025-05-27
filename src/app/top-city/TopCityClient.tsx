"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ContactForm from "@/components/Contactform";
import { GET_TOPCITY_DATA } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useRef } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Link from "next/link";
import "swiper/css";

interface City {
    label: string;
    link?: string;
    image?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
}

export default function TopCityClient() {

    const swiperRef = useRef<SwiperType | null>(null);
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_TOPCITY_DATA, { variables: { locale }, });
    const mainTopCity = data?.topCityPage?.data?.attributes || {};
    const { CityHead } = mainTopCity;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = CityHead?.image?.data?.attributes?.url ? `${baseUrl}${CityHead.image.data.attributes.url}` : "/images/Banner.jpg";
    const cityList = mainTopCity?.cities?.citylist ?? [];

    const portfolioImages = [
        { src: mainTopCity?.CityPort?.image1?.data?.attributes?.url ? `${baseUrl}${mainTopCity.CityPort.image1.data.attributes.url}` : "/images/portfolio1.png" },
        { src: mainTopCity?.CityPort?.image2?.data?.attributes?.url ? `${baseUrl}${mainTopCity.CityPort.image2.data.attributes.url}` : "/images/portfolio2.png" },
        { src: mainTopCity?.CityPort?.image3?.data?.attributes?.url ? `${baseUrl}${mainTopCity.CityPort.image3.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainTopCity?.CityPort?.image4?.data?.attributes?.url ? `${baseUrl}${mainTopCity.CityPort.image4.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainTopCity?.CityPort?.image5?.data?.attributes?.url ? `${baseUrl}${mainTopCity.CityPort.image5.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainTopCity?.CityPort?.image6?.data?.attributes?.url ? `${baseUrl}${mainTopCity.CityPort.image6.data.attributes.url}` : "/images/portfolio3.png" },
    ];

    return (
        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-2xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">{CityHead?.heading || "Top cites"}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={CityHead?.breadcrumb?.link1 || "/"} className="px-4 uppercase">{CityHead?.breadcrumb?.SubHead1 || "Home"}</Link>
                        /
                        <Link href={CityHead?.breadcrumb?.link2 || "/top-city"} className="px-4 uppercase">{CityHead?.breadcrumb?.SubHead2 || "top cities"}</Link>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="grid pt-5 md:grid-cols-2 lg:mx-52 3xl:mx-80 md:mx-20 mx-14 md:pt-8 lg:pt-12">
                    <div>
                        <h1 className="text-[24px] md:text-[28px] lg:text-[36px] text-[#17171B] font-sans font-normal uppercase">
                            {mainTopCity?.cities?.Topic || "our top cities"}
                        </h1>
                        <p className="text-[18px] lg:text-[18px] text-[#E21F2C] font-sans tracking-wide">{mainTopCity?.cities?.SubTopic || "Complete Exhibition Solutions"}</p>
                    </div>
                    <div className="items-end justify-center hidden md:text-center lg:mt-5 md:mt-2 md:block">
                        <div className="relative flex justify-end space-x-2 md:items-center lg:space-x-10">
                            <button className="custom-prev1 w-12 h-12 flex items-center justify-center bg-[#FF8D8D] rounded-full transition z-10" onClick={() => swiperRef.current?.slidePrev()}>
                                <ChevronLeft size={24} className="text-gray-500 hover:text-black" />
                            </button>
                            <button className="custom-next1 w-12 h-12 flex items-center justify-center bg-[#FF8D8D] rounded-full transition z-10" onClick={() => swiperRef.current?.slideNext()}>
                                <ChevronRight size={24} className="text-gray-500 hover:text-black" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 lg:pb-14 pb-14 md:pb-20 md:px-20 px-14 lg:ps-52 3xl:px-60 3xl:ps-80">
                    <Swiper modules={[Navigation, Pagination]} spaceBetween={0} slidesPerView={1} onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)} pagination={{ clickable: true }}
                        navigation={{ nextEl: '.custom-next1', prevEl: '.custom-prev1' }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2.1,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}>
                        {cityList.map((city: City, index: number) => (
                            <SwiperSlide key={index} className="flex justify-center">
                                <div className="relative bg-[#fafafa] overflow-hidden lg:w-[400px] w-[270px] rounded-lg shadow-lg group ">
                                    <Image src={city.image?.data?.attributes?.url ? `${baseUrl}${city.image.data.attributes.url}` : "/images/default.png"} alt={city.label} width={450} height={300} className="object-cover w-full h-[300px] transition-transform duration-300 ease-in-out hover:scale-105" />
                                    <div className="flex items-center justify-between px-10 pt-2 pb-2 ps-6">
                                        <p className="text-black lg:text-[18px] text-[12px] mr-16 group-hover:text-[#E21F2C]">
                                            {city.label}
                                        </p>
                                        <Link href={city.link || "#"} className="text-black inline-block uppercase text-xs group-hover:text-[#E21F2C]">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full group-hover:bg-[#f55152]">
                                                <ArrowRight className="w-5 h-5 text-black group-hover:text-white" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div >
            </section>

            <section className="py-5 bg-white lg:pb-14">
                <div className="text-center">
                    <h1 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">{mainTopCity?.CityPort?.title || "Take a look at some of our work"}</h1>
                    <span className="text-[#E42D39] text-xs md:text-base">{mainTopCity?.CityPort?.SubTitle || "Lorem Ipsum is simply dummy text of the printing"}</span>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-10 lg:mx-60 mx-8 md:mx-40 3xl:mx-[18rem]">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full h-[18rem] md:h-[14rem] lg:h-[20rem] group overflow-hidden">
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href={mainTopCity?.CityPort?.button?.link || "/portfolio"} className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        {mainTopCity?.CityPort?.button?.label || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}