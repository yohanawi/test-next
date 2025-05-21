"use client";

import { Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { GET_CLIENT_DATA } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import Image from "next/legacy/image";
import "swiper/css/pagination";
import "swiper/css";

type ImageAttributes = {
  url?: string;
  alternativeText?: string;
};

type ImageData = {
  data?: {
    attributes?: ImageAttributes;
  };
};

type ClientType = {
  name?: string;
  image?: ImageData;
};


export default function HomeTrusted() {

  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_CLIENT_DATA, { variables: { locale }, });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const partner = data?.partner?.data?.attributes || {};
  const clients = partner?.client || [];

  const firstRowClients = clients.filter(
    (_: ClientType, index: number) => index % 2 === 0
  );
  const secondRowClients = clients.filter(
    (_: ClientType, index: number) => index % 2 !== 0
  );

  return (
    <section className="bg-white">
      <div className="mx-20 py-14 md:py-16 lg:py-20 3xl:ms-28 lg:mx-10 md:mx-16">
        <p className="text-black text-center font-sans font-bold text-[24px] 3xl:text-[28px] pb-8">
          {partner?.title || "Trusted by 100+ of companies"}
        </p>

        <div className="hidden mt-10 space-y-8 lg:block">
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full">
              <Swiper modules={[Autoplay]} spaceBetween={30} slidesPerView="auto" loop={true} autoplay={{
                delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true,
              }} speed={2000} className="w-full" >
                {firstRowClients.map((client: ClientType, index: number) => {
                  const imageUrl = client.image?.data?.attributes?.url ? `${baseUrl}${client.image.data.attributes.url}` : "/images/placeholder.png";
                  const altText = client.image?.data?.attributes?.alternativeText || client.name || "Trusted Client";

                  return (
                    <SwiperSlide key={`first-${index}`} className="!w-auto">
                      <Image src={imageUrl} width={230} height={130} alt={altText} quality={60} objectFit="contain" className="w-[120px] h-[70px] sm:w-[150px] sm:h-[85px] md:w-[180px] md:h-[100px] lg:w-[230px] lg:h-[130px]" />
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <Swiper modules={[Autoplay]} spaceBetween={30} slidesPerView="auto" loop={true} autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true, }} speed={2000} dir="rtl" className="w-full" >
                {secondRowClients.map((client: ClientType, index: number) => {
                  const imageUrl = client.image?.data?.attributes?.url ? `${baseUrl}${client.image.data.attributes.url}` : "/images/placeholder.png";
                  const altText = client.image?.data?.attributes?.alternativeText || client.name || "Trusted Client";

                  return (
                    <SwiperSlide key={`second-${index}`} className="!w-auto">
                      <div className="!rtl:!direction-ltr">
                        <Image src={imageUrl} width={230} height={130} alt={altText} quality={60} objectFit="contain" className="w-[120px] h-[70px] sm:w-[150px] sm:h-[85px] md:w-[180px] md:h-[100px] lg:w-[230px] lg:h-[130px]" />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="block lg:hidden">
          <Swiper modules={[Autoplay]} slidesPerView={1} spaceBetween={20} loop={true} autoplay={{ delay: 2000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }} className="flex items-center justify-center 3xl:mt-10" >
            {clients.map((client: ClientType, index: number) => {
              const imageUrl = client.image?.data?.attributes?.url ? `${baseUrl}${client.image.data.attributes.url}` : "/images/placeholder.png";
              const altText = client.image?.data?.attributes?.alternativeText || client.name || "Trusted Client";
              return (
                <SwiperSlide key={index} className="flex justify-center">
                  <Image src={imageUrl} width={230} height={130} alt={altText} quality={30} className="w-[120px] h-[70px] sm:w-[150px] sm:h-[85px] md:w-[180px] md:h-[100px] lg:w-[230px] lg:h-[130px]" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
