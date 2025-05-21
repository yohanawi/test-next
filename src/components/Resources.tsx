"use client";

import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { GET_RESOURCE_DATA } from "@/lib/queries";
import { Pagination } from "swiper/modules";
import { useQuery } from "@apollo/client";
import { RootState } from "@/redux/store";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";

interface CardImage {
  data?: {
    attributes?: {
      url?: string;
    };
  };
}

interface ResourceCard {
  image?: CardImage;
  link: string;
  title: string;
}


export default function Resources() {

  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_RESOURCE_DATA, { variables: { locale }, });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const resource = data?.resource?.data?.attributes || {};
  const resourceCrds = resource?.resourceCrd || [];

  return (
    <section className="py-[30px] md:py-[50px] lg:py-16 bg-[#d8dde0]">
      <div className="lg:mx-44 mx-14 md:mx-32 lg:gap-8 3xl:mx-[17rem]">
        <h2 className="text-[22px] md:text-[30px] lg:text-[36px] font-sans text-black font-bold max-w-[48rem]">
          {resource.mainTitle || "We Are a Creative Exhibition Stand Construction & Booth Design Company in Dubai"}
        </h2>
        <div className="lg:text-left">
          <p className="text-[18px] lg:text-[18px] hidden lg:block font-sans font-normal text-black">
            {resource.description || "We are a unique group of professionals committed to research-based design that enhances human achievement."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mx-6 md:mx-12 lg:mx-44 md:mt-5 lg:mt-5 3xl:mx-[17rem]">
        {resourceCrds.map((card: ResourceCard, index: number) => {
          const imageUrl = card.image?.data?.attributes?.url ? `${baseUrl}${card.image.data.attributes.url}` : "/images/placeholder.png";

          return (
            <div key={index} className="relative overflow-hidden transition-transform h-[300px] hidden lg:block group" >
              <Link href={card.link} className="relative block w-full h-full group">
                <div className="absolute inset-x-0 bottom-[-100%] h-60 bg-gradient-to-t from-gray-800 via-transparent to-transparent group-hover:opacity-100 transition-all duration-300 group-hover:bottom-0 z-10"></div>
                <div className="relative w-full h-full overflow-hidden group">
                  <Image src={imageUrl} alt="Client Image" layout="fill" objectFit="cover" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="transition-transform duration-300 group-hover:scale-110" priority />
                </div>
                <div className="absolute z-50 flex items-center justify-between bottom-4 left-4 right-4">
                  <h2 className="text-white text-[14px] font-semibold uppercase opacity-100 transition-opacity duration-300" style={{ fontFamily: "Work Sans, sans-serif" }} >
                    {card.title}
                  </h2>
                  <span className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                    ➔
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
        <div className="relative block mx-4 mt-5 lg:hidden md:mx-20">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={10} centeredSlides={false} slidesPerView={1.1} className="w-full" navigation={{ nextEl: ".swiper-next1", prevEl: ".swiper-prev1", }} >
            {resourceCrds.map((card: ResourceCard, index: number) => {
              const imageUrl = card.image?.data?.attributes?.url ? `${baseUrl}${card.image.data.attributes.url}` : "/images/placeholder.png";
              return (
                <SwiperSlide key={index}>
                  <div className="relative overflow-hidden transition-transform h-[250px] md:h-[450px]">
                    <Link href={card.link} passHref className="group">
                      <div className="absolute inset-x-0 bottom-[-100%] h-60 bg-gradient-to-t from-gray-800 via-transparent to-transparent group-hover:opacity-100 transition-all duration-300 group-hover:bottom-0 z-10"></div>
                      <div className="relative w-full h-full overflow-hidden group">
                        <Image src={imageUrl} alt="Client Image" layout="fill" objectFit="cover" sizes="100vw" className="transition-transform duration-300 group-hover:scale-110" priority />
                      </div>
                      <div className="absolute z-50 flex items-center justify-between bottom-4 left-4 right-4">
                        <h2 className="text-white text-[14px] md:text-xl font-semibold uppercase">
                          {" "}
                          {card.title}{" "}
                        </h2>
                        <button className="bg-gray-200 rounded-full md:w-7 md:h-7 w-5 h-5 flex items-center justify-center text-black group-hover:bg-[#f55152] group-hover:text-white">
                          ➔
                        </button>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section >
  );
}
