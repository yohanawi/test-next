"use client";

import { GET_EXHIBITION_PAGE_DATA, GET_STAND_DETAIL } from "@/lib/queries";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { Check, Minus, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ImageAttributes {
    url: string;
    alternativeText?: string;
}

interface ImageData {
    attributes: ImageAttributes;
}

interface ImageWrapper {
    data?: ImageData;
}

interface ImgItem {
    image?: ImageWrapper;
}

export default function Stands() {

    const { stand } = useParams();
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data: StandDeatilsData } = useQuery(GET_STAND_DETAIL, { variables: { slug: stand, locale }, skip: !stand, });
    const standDetail = StandDeatilsData?.standDetails?.data?.[0]?.attributes || {};
    const { data: exhibitionData } = useQuery(GET_EXHIBITION_PAGE_DATA, { variables: { locale }, });
    const mainExhibition = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const { services } = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

    const serviceCards = [
        {
            image: services?.image01?.data?.attributes?.url ? `${baseUrl}${services.image01.data.attributes.url}` : "/images/exhibition-ser1.png",
            title: services?.label01 || "Exhibition Stand Contractor",
            link: services?.link1 || "/exhibition-stand-contractors",
        },
        {
            image: services?.image02?.data?.attributes?.url ? `${baseUrl}${services.image02.data.attributes.url}` : "/images/exhibition-ser2.png",
            title: services?.label02 || "Exhibition Stand Design",
            link: services?.link2 || "/exhibition-stand-designer",
        },
        {
            image: services?.image03?.data?.attributes?.url ? `${baseUrl}${services.image03.data.attributes.url}` : "/images/exhibition-ser3.png",
            title: services?.label03 || "Exhibition Stand Builders",
            link: services?.link3 || "/exhibition-stand-builders",
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const [, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                {standDetail?.HeroSec?.bgImage?.data?.attributes?.url && (
                    <Image src={`${baseUrl}${standDetail.HeroSec.bgImage.data.attributes.url}`} layout="fill" objectFit="cover" alt={standDetail.HeroSec.bgImage.data.attributes.alternativeText || "Hero Image"} />
                )}
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-2xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">{standDetail?.HeroSec?.title || "Exhibition Stand"}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/exhibition-stand-services" className="px-4 uppercase">Exhibition Services</Link>
                        /
                        <Link href={`/exhibition-sub/${standDetail?.slug}`} className="px-4 uppercase">{standDetail?.HeroSec?.title} Page</Link>
                    </div>
                </div>
            </section>

            <section className="px-8 bg-white 3xl:px-0 lg:py-14 py-14">
                <div className="lg:mx-36 mx-5 md:mx-20 3xl:mx-[17rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-2xl font-normal text-black uppercase md:text-4xl lg:text-5xl" dangerouslySetInnerHTML={{ __html: standDetail?.SecondSec?.title }}>

                                </h2>
                                <div className="lg:py-8 py-5 text-sm text-[#3E444A] 3xl:text-base">
                                    <p>{standDetail?.SecondSec?.description}</p>
                                    <p className="mt-4">{standDetail?.SecondSec?.description2}</p>
                                </div>
                                <div className="grid gap-4 text-xs text-black md:grid-cols-2 3xl:text-sm">
                                    {standDetail?.SecondSec?.ExhiList?.map((item: { lable: string }, index: number) => (
                                        <div key={index} className="flex items-center gap-6">
                                            <Image src="/images/correct-icon.png" alt="Correct Icon" width={17} height={17} layout="fixed" priority quality={30} />{item.lable}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    standDetail?.SecondSec?.image1,
                                    standDetail?.SecondSec?.image2,
                                    standDetail?.SecondSec?.image3,
                                    standDetail?.SecondSec?.image4,
                                ]
                                    .filter((img) => img?.data?.attributes?.url).map((img, index) => (
                                        <div key={index} className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95"
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)} >
                                            <Image src={`${baseUrl}${img.data.attributes.url}`} layout="fill" objectFit="cover" alt={img.data.attributes.alternativeText || `Exhibition ${index + 1}`}
                                                className="object-cover w-full h-full transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-10 md:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 lg:text-4xl md:text-3xl" dangerouslySetInnerHTML={{
                        __html: mainExhibition?.services?.title || "EXHIBITION <span style='color: #EA2127;'>SERVICES</span>",
                    }}>
                    </h2>
                    <p className="mx-auto mt-4 text-gray-600 md:max-w-lg lg:max-w-3xl 3xl:text-lg">
                        {mainExhibition?.services?.description}
                    </p>
                    <div className="grid lg:grid-cols-3 gap-8 mt-10 lg:mx-40 md:mx-40 3xl:mx-[7rem]">
                        {serviceCards.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
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

            <section className="py-5 bg-white lg:py-12 md:py-5">
                <div className="flex items-center justify-center py-5 lg:py-0 lg:pb-10 md:py-8">
                    <div className="w-full lg:max-w-[74rem] md:max-w-xl 3xl:max-w-[84rem] max-w-xs space-y-2">
                        {standDetail?.faqSec?.faqList?.map((faq: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="border-b-2 border-[#00000056] text-black">
                                    <button className="flex items-center justify-between w-full p-4 text-lg font-medium text-left" onClick={() => toggleAccordion(index)} >
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
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="overflow-hidden" >
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

            {standDetail?.ImgSec?.img?.length > 0 && (
                <section className="bg-white">
                    <div className="grid gap-4 pb-10 mx-4 lg:grid-cols-3 md:grid-cols-1 lg:pb-10 md:pb-16 lg:mx-6 md:mx-40">
                        {standDetail?.ImgSec?.img?.map((img: ImgItem, index: number) => (
                            <div key={index} className="relative w-full lg:h-[27rem] 3xl:h-[32rem] h-[20rem] group overflow-hidden">
                                {img.image?.data?.attributes?.url && (
                                    <Image src={`${baseUrl}${img.image.data.attributes.url}`} alt={img.image.data.attributes.alternativeText || `Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}