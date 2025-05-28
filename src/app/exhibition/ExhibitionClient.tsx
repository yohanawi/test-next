"use client";

import { GET_EXHIBITION_PAGE_DATA } from "@/lib/queries";
import HomeSection3 from "@/components/HomeSection3";
import ContactForm from "@/components/Contactform";
import Resources from "@/components/Resources";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ExhibitionItem = {
    lable: string;
};

export default function Exhibition() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_EXHIBITION_PAGE_DATA, { variables: { locale }, });
    const mainExhibition = data?.exhibitionPages?.data?.[0].attributes || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const { services } = data?.exhibitionPages?.data?.[0].attributes || {};
    const { ExhiSec } = data?.exhibitionPages?.data?.[0].attributes || {};
    const { HeadSec } = data?.exhibitionPages?.data?.[0].attributes || {};
    const bannerImage = HeadSec?.image?.data?.attributes?.url ? `${baseUrl}${HeadSec.image.data.attributes.url}` : "/images/default-banner.jpg";
    const images = [
        ExhiSec?.image1?.data?.attributes?.url ? `${baseUrl}${ExhiSec.image1.data.attributes.url}` : "/images/exhibition1.png",
        ExhiSec?.image2?.data?.attributes?.url ? `${baseUrl}${ExhiSec.image2.data.attributes.url}` : "/images/exhibition2.png",
    ];

    const serviceCards = [
        {
            image: services?.image01?.data?.attributes?.url ? `${baseUrl}${services.image01.data.attributes.url}` : "/images/exhibition-ser1.png",
            title: services?.label01 || "Exhibition Stand Contractor",
            link: services?.link1 || "/exhibition-stand-contractors",
        },
        {
            image: services?.image02?.data?.attributes?.url ? `${baseUrl}${services.image02.data.attributes.url}` : "/images/exhibition-ser2.png",
            title: services?.label02 || "Exhibition Stand Designs",
            link: services?.link2 || "/exhibition-stand-designer",
        },
        {
            image: services?.image03?.data?.attributes?.url ? `${baseUrl}${services.image03.data.attributes.url}` : "/images/exhibition-ser3.png",
            title: services?.label03 || "Exhibition Stand Builders",
            link: services?.link3 || "/exhibition-stand-builders",
        },
    ];

    const portfolioImages = [
        {
            src: mainExhibition?.banner1?.data?.attributes?.url ? `${baseUrl}${mainExhibition.banner1.data.attributes.url}` : "/images/portfolio1.png",
        },
        {
            src: mainExhibition?.banner2?.data?.attributes?.url ? `${baseUrl}${mainExhibition.banner2.data.attributes.url}` : "/images/portfolio2.png",
        },
        {
            src: mainExhibition?.banner3?.data?.attributes?.url ? `${baseUrl}${mainExhibition.banner3.data.attributes.url}` : "/images/portfolio3.png",
        },
    ];

    const [, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {HeadSec?.heading || "Exhibition Services"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={mainExhibition?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {HeadSec?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={mainExhibition?.breadcrumb?.link2 || "/exhibition"} className="px-4 uppercase" >
                            {HeadSec?.breadcrumb?.SubHead2 || "Exhibition Services"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-8 py-8 bg-white 3xl:px-0 md:py-14">
                <div className="lg:mx-36 mx-5 md:mx-20 3xl:mx-[17rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-xl font-bold text-black uppercase md:text-4xl"
                                    dangerouslySetInnerHTML={{
                                        __html: mainExhibition?.ExhiSec?.title || "#1 Exhibition Stand Design Company <span style='color: #EA2127;'>in Dubai</span>",
                                    }}>
                                </h2>
                                <div className="lg:py-8 py-5 text-sm md:text-base text-[#3E444A] 3xl:text-base">
                                    <p>{mainExhibition?.ExhiSec?.description}</p>
                                    <p className="mt-4">
                                        {mainExhibition?.ExhiSec?.description2}
                                    </p>
                                </div>
                                <div className="grid gap-4 text-sm text-black md:grid-cols-2 md:text-base">
                                    {mainExhibition?.ExhiSec?.ExhiList?.map(
                                        (item: ExhibitionItem, index: number) => (
                                            <div key={index} className="flex items-center gap-6">
                                                <Image src="/images/correct-icon.png" alt="Correct Icon" width={17} height={17} />
                                                {item.lable}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 justify-center items-center max-w-[900px] w-full p-5">
                                {images.map((src, index) => (
                                    <div key={index} className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} >
                                        <Image src={src} layout="fill" objectFit="cover" alt={`Exhibition ${index + 1}`} className="object-cover w-full h-full transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Resources />

            <HomeSection3 />

            <section className="bg-[#f6f6f6] text-center lg:py-20 md:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-xl font-normal text-gray-900 lg:text-4xl md:text-3xl"
                        dangerouslySetInnerHTML={{
                            __html: mainExhibition?.services?.title.trim() || "EXHIBITION <span style='color: #EA2127;'>SERVICES</span>",
                        }}
                    ></h2>
                    <p className="mx-auto mt-4 text-gray-600 md:max-w-lg lg:max-w-3xl 3xl:text-lg">
                        {mainExhibition?.services?.description}
                    </p>
                    <div className="grid lg:grid-cols-3 gap-8 mt-10 lg:mx-40 md:mx-40 3xl:mx-[7rem]">
                        {serviceCards.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-lg group" >
                                <Link href={item.link} className="block">
                                    <Image src={item.image} alt={item.title} width={400} height={300} className="w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-105" />
                                    <div className="p-2 bg-white text-black font-semibold text-lg text-center group-hover:text-[#EA2127]">
                                        {item.title}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6]">
                <div className="grid gap-4 py-5 mx-4 lg:grid-cols-3 md:grid-cols-3 lg:py-10 lg:mx-6 md:mx-5">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full lg:h-[27rem] md:h-[15rem] h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
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