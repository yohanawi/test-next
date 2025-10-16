"use client";

import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { GET_HOME_PAGE_DATA } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { RootState } from "@/redux/store";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";

interface HeroSlide {
  image?: {
    data?: {
      attributes?: {
        url?: string;
      };
    };
  };
  mobileImg?: {
    data?: {
      attributes?: {
        url?: string;
      };
    };
  };
  title?: string;
  subTitle?: string;
  btnLabel?: string;
  btnLink?: string;
  listNum1?: string;
  listLabel1?: string;
  listNum2?: string;
  listLabel2?: string;
  listNum3?: string;
  listLabel3?: string;
}


export default function HeroSection() {

  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_HOME_PAGE_DATA, { variables: { locale }, });
  const mainHeroSection = data?.homePages?.data?.[0]?.attributes?.herosec?.hereSlide ?? [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

  //Hero Section
  const [activeIndex, setActiveIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = Array.isArray(mainHeroSection)
    ? mainHeroSection.map((slide: HeroSlide) => ({
      image: slide.image?.data?.attributes?.url ? `${baseUrl}${slide.image.data.attributes.url}` : "/images/hero-image.png",
      mobileImage: slide.mobileImg?.data?.attributes?.url ? `${baseUrl}${slide.mobileImg.data.attributes.url}` : "/images/hero-banner-mobile.png",
      title: slide.title ? slide.title.split(" ") : [],
      description: slide.subTitle || "Award-winning services across UAE and worldwide",
      buttonText: slide.btnLabel || "Request Quote",
      buttonLink: slide.btnLink || "#",
      numbers: [
        { value: slide.listNum1 || "0", label: slide.listLabel1 || "" },
        { value: slide.listNum2 || "0", label: slide.listLabel2 || "" },
        { value: slide.listNum3 || "0", label: slide.listLabel3 || "" },
      ],
    }))
    : [];


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
      <p className="text-3xl font-extrabold text-white lg:text-4xl" style={{ fontFamily: "Work Sans, sans-serif" }} >
        {count}
      </p>
    );
  };

  return (
    <>
      <Swiper modules={[Navigation, Autoplay]} navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }} onSlideChange={(swiper) => setActiveIndex(swiper.realIndex + 1)} loop={true} className="w-full" autoplay={{ delay: 8000, disableOnInteraction: false }} speed={800} >
        {(slides && slides.length > 0
          ? slides : [
            {
              mobileImage: "https://cms.xessevents.com/uploads/02_c53330785b.jpg",
              image: "https://cms.xessevents.com/uploads/hero_1_29339eb388.jpg",
              title: [
                "Your",
                "Exhibition",
                "Stand",
                "Design",
                "Builder",
                "Since 2010",
              ],
              description: "Award- Winning Exhibition Stand Design Services and Event Production across UAE ",
              numbers: [
                { value: 120, label: "Projects" },
                { value: 14, label: "Countries" },
                { value: 300, label: "Clients" },
              ],
              buttonText: " Let’s Work Together",
              buttonLink: "/request-quotation",
            },
          ]
        ).map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full md:h-[800px] lg:h-[570px] 3xl:h-[700px] h-[500px] mt-20 md:mt-28 lg:mt-28">
              {index === 0 ? (
                <Image src={isMobile ? slide.mobileImage || slide.image : slide.image} alt={`Slide ${index + 1}`} width={1200} height={675} quality={100} loading={index === 0 ? "eager" : "lazy"} priority={index === 0} style={{ objectFit: "cover", width: "100%", height: "auto" }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 1000px" />
              ) : (
                <Image src={isMobile ? slide.mobileImage || slide.image : slide.image} alt={`Slide ${index + 1}`} fill style={{ objectFit: "cover" }} quality={30} loading="lazy" priority={false} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 1000px" />
              )}

              <div className="absolute inset-0 flex justify-start mt-16 lg:items-center md:mt-28 lg:mt-0">
                <div className="max-w-lg mx-auto text-center text-white lg:text-left md:text-center lg:max-w-2xl 3xl:max-w-4xl md:max-w-2xl md:mx-auto lg:mx-32">
                  <h2 className="text-[20px] md:text-[40px] lg:text-[40px] font-bold 3xl:text-[52px]" style={{ fontFamily: "Work Sans, sans-serif" }} >
                    {slide.title.map((word: string, i: number) => (
                      <span key={i} className={i === 2 ? "text-[#D10003] inline-block" : "text-white"}>
                        {word}&nbsp;
                      </span>
                    ))}

                  </h2>
                  <p className="mt-4 text-[12px] mx-5 lg:mx-0 md:text-[20px] lg:text-[20px] lg:max-w-lg 3xl:max-w-xl" style={{ fontFamily: "Work Sans, sans-serif" }} >
                    {slide.description}
                  </p>
                  <div className="items-center hidden my-4 space-x-8 lg:flex lg:my-5 lg:max-w-lg 3xl:max-w-xl">
                    {slide.numbers.map((num, i) => (
                      <div key={i} className="flex items-center h-10 space-x-2 lg:space-x-2 w-60" >
                        <div className="text-right">
                          {" "}
                          <Counter value={typeof num.value === "string" ? parseInt(num.value, 10) : num.value} />
                        </div>
                        <p className="font-sans text-sm text-white lg:text-md whitespace-nowrap">
                          {num.label}
                        </p>
                        {i < slide.numbers.length - 1 && (
                          <span className="h-8 w-1 bg-[#D10003]"></span>
                        )}
                      </div>
                    ))}
                  </div>

                  <Link href={slide.buttonLink}>
                    <div className="3xl:max-w-xl lg:max-w-lg block mt-5 lg:mt-1 px-6 py-2 lg:py-2 lg:w-full md:max-w-[25rem] max-w-[15rem] mx-auto lg:ms-0 bg-[#D10003] text-white relative overflow-hidden group text-center">
                      <span className="absolute inset-0 transition-transform duration-500 ease-in-out transform -translate-y-full bg-white group-hover:translate-y-0"></span>
                      <span className="relative text-sm group-hover:text-black md:text-lg lg:text-lg" style={{ fontFamily: "Work Sans, sans-serif" }} >
                        {slide.buttonText}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute items-center hidden space-x-4 bottom-5 right-28 md:flex">
        <button className="z-10 flex items-center justify-center w-10 h-10 transition rounded-full custom-prev bg-gray-300/80 hover:bg-gray-400" aria-label="Previous Slide" >
          <ChevronLeft size={20} className="text-black" />
        </button>
        <button className="z-10 flex items-center justify-center w-10 h-10 transition rounded-full custom-next bg-gray-300/80 hover:bg-gray-400" aria-label="Next Slide" >
          <ChevronRight size={20} className="text-black" />
        </button>
        <div className="z-10 text-lg font-semibold">
          {activeIndex} <span className="mx-2">—</span> {slides.length}
        </div>
      </div>
    </>
  );
}
