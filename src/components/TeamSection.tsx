"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { GET_HOME_PAGE_DATA } from "@/lib/queries";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";

type ImageAttributes = {
  url?: string;
};

type ImageData = {
  data?: {
    attributes?: ImageAttributes;
  };
};

type TeamMember = {
  name: string;
  position: string;
  email: string;
  image?: ImageData;
};

export default function TeamSection() {

  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_HOME_PAGE_DATA, { variables: { locale } });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const Hometeamsection = data?.homePages?.data?.[0]?.attributes || {};
  const teamMembers = Hometeamsection?.HomeTeam?.leaderMembr || [];

  return (
    <section className="bg-[#f6f6f6]">
      <div className="max-w-xs md:max-w-xl lg:max-w-[77rem] 3xl:max-w-[87rem] mx-auto py-10 3xl:py-20">
        <div className="flex items-center justify-between px-4 mb-6">
          <h2 className="font-sans text-xl font-normal text-black md:text-4xl">
            {Hometeamsection?.HomeTeam?.title || "Our Team"}
          </h2>
          <Link href={Hometeamsection?.HomeTeam?.link || "/about-us"} className="text-sm text-gray-600 hover:text-[#D10003] flex items-center gap-1 hover:underline underline-offset-2" >
            {Hometeamsection?.HomeTeam?.linkLabel || "Learn more about us"} ➔
          </Link>
        </div>

        <Swiper slidesPerView={4} spaceBetween={20} pagination={{ clickable: true }} loop={true}
          breakpoints={{
            1900: { slidesPerView: 5 },
            1500: { slidesPerView: 4 },
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 2 },
            320: { slidesPerView: 1 },
          }} modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }} className="w-full px-4">
          {teamMembers.map((member: TeamMember, index: number) => {
            const imageUrl = member.image?.data?.attributes?.url ? `${baseUrl}${member.image.data.attributes.url}` : "/images/default-profile.png";
            return (
              <SwiperSlide key={index} className="relative group">
                <div className="relative overflow-hidden transition duration-300 bg-white rounded-lg shadow-md group group-hover:bg-gray-500">
                  <div className="relative overflow-hidden group-hover:bg-gray-500">
                    <Image src={imageUrl} alt={member.name} width={300} height={300} className="object-cover w-full transition-transform duration-300 h-72 group-hover:bg-gray-400 group-hover:scale-110" quality={30} loading="lazy" />
                    <div className="relative group">
                      <div className="absolute left-0 z-10 w-full p-3 text-white transition-all duration-300 ease-in-out -bottom-6 group-hover:bottom-0 bg-gradient-to-t from-gray-700 via-gray-700/70 to-transparent">
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <span className="z-50 text-xs font-bold text-white uppercase">
                          {member.position}
                        </span>
                        <Link href={`mailto:${member.email}`}>
                          <p className="text-sm transition-opacity duration-300 ease-in-out opacity-0 cursor-pointer group-hover:opacity-100 hover:underline">
                            {member.email}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
