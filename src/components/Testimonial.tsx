"use client";

import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import type { Swiper as SwiperType } from 'swiper';
import { Ref, useEffect, useRef } from "react";
import { GET_REVIEW } from "@/lib/queries";
import { useSelector } from "react-redux";
import { Autoplay } from "swiper/modules";
import { useQuery } from "@apollo/client";
import { RootState } from "@/redux/store";
import { useMemo } from 'react';
import Image from "next/image";
import "swiper/css";


interface Testimonial {
  authorName?: string;
  aboutAuthor?: string;
  decription: string;
  rating: string | number;
  authorImg?: {
    data?: {
      attributes?: {
        url: string;
      };
    };
  };
}

export default function Testimonial() {

  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_REVIEW, { variables: { locale }, });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const review = useMemo(() => data?.review?.data?.attributes || {}, [data]);
  const clientReviews = useMemo(() => review?.review || [], [review]);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current?.navigation) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [clientReviews]);

  const truncateText = (text: string, limit: number): string => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const ratingMap: Record<"worst" | "bad" | "normal" | "good" | "excellent", number> = {
    worst: 1,
    bad: 2,
    normal: 3,
    good: 4,
    excellent: 5,
  };

  return (
    <div className="bg-[#e5e9eb] pb-2 pt-16 px-4">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-normal text-gray-700 lg:text-4xl md:text-3xl">
          {review?.title || "Don't take our word for it."}
        </h2>
        <h3 className="font-sans text-2xl font-bold text-red-600 lg:text-4xl md:text-3xl">
          {review?.sub_title || "Trust our customers"}
        </h3>
      </div>

      <div className="mx-2 lg:mx-10 3xl:mx-36 md:mx-8">
        <Swiper ref={swiperRef as Ref<SwiperRef>} spaceBetween={20} slidesPerView={1}
          breakpoints={{
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
            320: { slidesPerView: 1 },
          }} autoplay={{ delay: 4000, disableOnInteraction: false }} modules={[Autoplay]} loop={true} >
          {clientReviews.map((testimonial: Testimonial, index: number) => {
            const imageUrl = testimonial.authorImg?.data?.attributes?.url ? `${baseUrl}${testimonial.authorImg.data.attributes.url}` : "/images/user.png";
            return (
              <SwiperSlide key={index}>
                <div className="relative z-50 top-12 left-6">
                  <Image src={imageUrl} alt={testimonial.authorName || "Author"} width={80} height={80} loading="lazy" quality={30} className="object-cover w-20 h-20 border-4 border-white rounded-full" />
                </div>
                <div className="bg-white rounded-2xl p-6 relative hover:shadow-xl transition w-[21rem] 3xl:w-[23rem] 3xl:h-[16rem] h-[18rem]">
                  <div className="absolute text-lg text-blue-500 top-4 right-6">
                    {Array.from({
                      length: ratingMap[testimonial.rating as keyof typeof ratingMap] || 0,
                    }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <div className="pt-10 text-gray-600">
                    <p className="mt-4 text-sm">
                      {truncateText(testimonial.decription, 240)}
                    </p>
                  </div>
                  <div className="absolute flex items-center justify-between gap-10 mt-10 3xl:gap-20 lg:gap-9 md:gap-5 bottom-5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        {testimonial.authorName || "Anonymous"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {testimonial.aboutAuthor || "No position specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
