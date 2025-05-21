"use client";

import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { GET_HOME_PAGE_DATA } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { RootState } from "@/redux/store";
import Image from "next/image";

interface ImageData {
  attributes: {
    url: string;
    alternativeText?: string;
  };
}

interface Card {
  icon?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  label?: string;
  number?: number | string;
}

interface SlideImage {
  url: string;
  alt: string;
}

export default function HomeSection2() {
  const [, setIsVisible] = useState(false);
  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_HOME_PAGE_DATA, { variables: { locale }, });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const secndSec = data?.homePages?.data[0]?.attributes?.SecndSec || {};
  const scrollRef1 = useRef<HTMLDivElement | null>(null);
  const scrollRef2 = useRef<HTMLDivElement | null>(null);
  const normalSpeed = 30;
  const [speed,] = useState(normalSpeed);

  useEffect(() => {
    const scrollUp = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        ref.current.scrollTop -= 1;
        if (ref.current.scrollTop <= 0) {
          ref.current.scrollTop = ref.current.scrollHeight / 2;
        }
      }
    };

    const scrollDown = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        ref.current.scrollTop += 1;
        if (ref.current.scrollTop >= ref.current.scrollHeight / 2) {
          ref.current.scrollTop = 0;
        }
      }
    };

    const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        ref.current.scrollLeft -= 1;
        if (ref.current.scrollLeft <= 0) {
          ref.current.scrollLeft = ref.current.scrollWidth / 2;
        }
      }
    };

    const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        ref.current.scrollLeft += 1;
        if (ref.current.scrollLeft >= ref.current.scrollWidth / 2) {
          ref.current.scrollLeft = 0;
        }
      }
    };
    const isMobile = window.innerWidth < 1024;

    const interval1 = isMobile ? setInterval(() => scrollLeft(scrollRef1), speed) : setInterval(() => scrollUp(scrollRef1), speed);
    const interval2 = isMobile ? setInterval(() => scrollRight(scrollRef2), speed) : setInterval(() => scrollDown(scrollRef2), speed);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [speed]);

  const slideUpImages = (secndSec?.slideUpImgs?.data as ImageData[])?.map((img) => ({ url: `${baseUrl}${img.attributes.url}`, alt: img.attributes.alternativeText || "Slide Up Image", })) || [];
  const slideDownImages = (secndSec?.slideDownImgs?.data as ImageData[])?.map((img) => ({ url: `${baseUrl}${img.attributes.url}`, alt: img.attributes.alternativeText || "Slide Down Image", })) || [];

  const sectionRef = useRef(null);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const Counter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 4000;
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

    return <>{count.toLocaleString()}+</>;
  };

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ fontFamily: "Work Sans, sans-serif" }} >
      <Image src="/images/about.jpg" alt="Background of exhibition stand" layout="fill" quality={30} priority className="object-cover object-center -z-10" />
      <div className="gap-4 lg:grid lg:grid-cols-3">
        <div className="flex justify-center col-span-2 mx-16 lg:mx-0 lg:ms-2">
          <div className="lg:py-20">
            <h2 className="lg:text-5xl md:text-[50px] text-[32px] font-bold text-black md:max-w-[600px] pt-12 lg:pt-0 leading-none"
              dangerouslySetInnerHTML={{
                __html: secndSec.title || "Our Story of Innovation",
              }}
            ></h2>
            <p className="text-black font-light lg:text-[20px] md:text-[18px] max-w-[700px] pt-4 lg:pt-5">
              {secndSec.description || "From humble beginnings to industry leaders, we've spent 15+ years perfecting the art of exhibition stand design and construction"}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 max-w-[720px] md:max-w-[400px] lg:max-w-[700px]">
              {secndSec?.Card?.map((card: Card, index: number) => {
                const iconUrl = card.icon?.data?.attributes?.url ? `${baseUrl}${card.icon.data.attributes.url}` : "/images/about-icon1.png";
                return (
                  <div key={index} className="bg-[#d9d9d9] p-4 rounded-3xl flex lg:block" >
                    <div className="relative w-[63px] h-auto aspect-[63/55] mb-2 my-auto">
                      <Image src={iconUrl} alt={card.label || "Icon"} layout="fill" className="object-contain" priority quality={30} />
                    </div>
                    <div className="border-l-8 border-[#D10003] lg:pl-2 pl-5 ms-2">
                      <div className="flex flex-col md:items-center md:flex-row gap-x-2">
                        <p className="text-[#383838] font-semibold text-[34px] pt-2 md:pt-0 md:text-[44px] lg:text-[40px]">
                          <Counter value={Number(card.number) || 0} />
                        </p>
                        <p className="text-[#383838] font-semibold text-[16px] md:text-[18px] lg:text-[18px]">
                          {card.label}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-hidden lg:w-[600px] lg:h-[34.7rem] lg:-ms-28 pb-10">
          <div className="flex flex-col items-center justify-center pt-12 space-y-4 overflow-hidden lg:flex-row lg:space-y-0 lg:space-x-4 lg:pt-0 lg:mr-12 lg:-mt-20">
            <div className="overflow-hidden lg:h-[110vh] lg:rotate-12" ref={scrollRef1} >
              <div className="flex space-x-4 lg:flex-col lg:space-y-2 lg:space-x-0">
                {slideUpImages.concat(slideUpImages).map((img: SlideImage, index: number) => (
                  <div key={`slideUp-${index}`} className="flex-shrink-0">
                    <Image width={180} height={180} src={img.url} alt={img.alt} quality={30} className="rounded-3xl object-cover w-[120px] h-[110px] md:w-[150px] md:h-[130px] lg:w-[180px] lg:h-[180px]" priority />
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden lg:h-[110vh] lg:rotate-12" ref={scrollRef2} >
              <div className="flex space-x-4 lg:flex-col lg:space-y-2 lg:space-x-0">
                {slideDownImages.concat(slideDownImages).map((img: SlideImage, index: number) => (
                  <div key={`loop2-${index}`} className="flex-shrink-0">
                    <Image width={180} height={180} src={img.url} alt={img.alt} className="rounded-3xl object-cover w-[120px] h-[110px] md:w-[150px] md:h-[130px] lg:w-[180px] lg:h-[180px]" priority />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
