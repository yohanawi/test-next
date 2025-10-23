"use client";

import { GET_EXHIBITION_DESIGN_DATA } from "@/lib/queries";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { ArrowDown, ArrowUp } from "lucide-react";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DesignerDubai() {

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [contentRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev: number | null) => (prev === index ? null : index));
    };

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_EXHIBITION_DESIGN_DATA, { variables: { locale }, });
    const mainExhibitiondesign = data?.exhiDesPage?.data?.attributes || {};
    const accordion = mainExhibitiondesign?.DesFaq?.ConFaq || [];
    const { DesHead } = mainExhibitiondesign;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = DesHead?.image?.data?.attributes?.url ? `${baseUrl}${DesHead.image.data.attributes.url}` : "/images/Banner.jpg";

    const portfolioImages = mainExhibitiondesign?.SecPortfolio ? [
        {
            src: `${baseUrl}${mainExhibitiondesign?.SecPortfolio?.image1?.data?.attributes?.url || "/images/portfolio1.png"}`,
        },
        {
            src: `${baseUrl}${mainExhibitiondesign?.SecPortfolio?.image2?.data?.attributes?.url || "/images/portfolio2.png"}`,
        },
        {
            src: `${baseUrl}${mainExhibitiondesign?.SecPortfolio?.image3?.data?.attributes?.url || "/images/portfolio3.png"}`,
        },
    ]
        : [];

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        Exhibition Stand Design in Dubai
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={mainExhibitiondesign?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {DesHead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={mainExhibitiondesign?.breadcrumb?.link2 || "/exhibition-stand-designer-in-dubai"} className="px-4 uppercase" >
                            Exhibition Stand Design in Dubai
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#fefefe] px-8 lg:py-14 py-8">
                <div className="lg:mx-[10rem] mx-5 md:mx-20 3xl:mx-[15rem]">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                            <div className="3xl:pt-10">
                                <h2 className="text-xl font-normal text-black uppercase md:text-4xl lg:text-5xl">
                                    Exhibition stand Design <span style={{ color: "#EA2127" }}>In Dubai </span>
                                </h2>
                                <p className="pt-5 text-sm font-bold text-black uppercase lg:text-base">
                                    Stand Out with High Quality Trade Show Booth Designs
                                </p>
                                <br />
                                <div className="lg:py-8 pt-5 lg:pt-0 text-sm text-[#3E444A] 3xl:text-base">
                                    We are an experienced exhibition stand design company in Dubai. This allows us to identify your needs as a brand and address them. When it comes to design, we want your brand to attract as many attendees as possible. And when it comes to delivery, we focus on delivering fast and reliable exhibition stand installation.
                                    <br /><br />
                                    We provide free exhibition stand designs but we also love creating experimental exhibition stands. Constantly innovating, developing and producing something new that Dubai’s crowds have never seen.
                                    <br /><br />
                                    But our designs are not only creative. They can be used in any environment. Our team of experienced experts who specialize in the design, development, building, implementation, and dismantling process will always work efficiently and will be as attentive to your needs as possible.

                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="relative w-full md:h-52 3xl:h-60 h-28 ">
                                    <Image src={mainExhibitiondesign?.DesSec2?.image1?.data?.attributes?.url ? `${baseUrl}${mainExhibitiondesign?.DesSec2.image1.data.attributes.url}` : "/images/ESD1.png"}
                                        layout="fill" objectFit="cover" alt="Exhibition 1" className="rounded-xl" />
                                </div>
                                <div className="relative w-full md:h-52 h-28 3xl:h-60">
                                    <Image src={mainExhibitiondesign?.DesSec2?.image2?.data?.attributes?.url ? `${baseUrl}${mainExhibitiondesign?.DesSec2.image2.data.attributes.url}` : "/images/ESD2.png"}
                                        layout="fill" objectFit="cover" alt="Exhibition 2" className="rounded-xl" />
                                </div>
                                <div className="relative w-full h-64 lg:h-72 3xl:h-[22rem] col-span-2 ">
                                    <Image src={mainExhibitiondesign?.DesSec2?.image3?.data?.attributes?.url ? `${baseUrl}${mainExhibitiondesign?.DesSec2.image3.data.attributes.url}` : "/images/ESD3.png"}
                                        layout="fill" objectFit="cover" alt="Exhibition 3" className="rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#D4D4D4] text-center py-5 md:py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-[#EA2127] text-center text-2xl md:text-3xl lg:text-4xl md:mx-20">
                        BUILD YOUR OWN
                    </h2>
                    <p className="text-2xl text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        CUSTOM 3D EXHIBITION STAND DESIGN
                    </p>
                    <div className=" lg:mx-44 md:mx-20 3xl:mx-[6rem] mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base">
                            At XESS, we want to combine your goal and message. And when backed by our creativity and passion, we believe that we can create stands that can create an unforgettable experience. And as a veteran of the trade show industry, we’re always on the look out for long term business partners who are willing to create something special with us!
                            <br /><br />
                            We’re committed to forming long-term business partnerships with reputable companies. We accomplish this through a collaborative process that combines your goals with our hallmark creativity, and a genuine passion for service, accountability, and measurement.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-10 bg-white">
                <div className="text-center">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                        {mainExhibitiondesign?.SecPortfolio?.title || "Take a look at some of our work"}
                    </h2>
                    <span className="text-[#E42D39] text-xs md:text-base">
                        {mainExhibitiondesign?.SecPortfolio?.SubTitle || "Lorem Ipsum is simply dummy text of the printing"}
                    </span>
                </div>
                <div className="grid lg:grid-cols-3 gap-4 lg:pt-10 lg:pb-14 md:pb-16 pb-10 pt-10 lg:mx-48 mx-8 md:mx-40 3xl:mx-[17rem]">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href={mainExhibitiondesign?.SecPortfolio?.button?.link || "/portfolio"} className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        {mainExhibitiondesign?.SecPortfolio?.button?.label || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <section className="bg-[#D8DDE0] py-10">
                <h2 className="max-w-[4.2rem] text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[19rem] md:mx-32 mx-14 bg-white rounded-full px-4 py-1">
                    FAQ
                </h2>
                <div className="grid lg:grid-cols-2 lg:mx-48 md:mx-32 3xl:mx-56">
                    <div className="pt-8 mx-14 md:mx-0 3xl:mx-20">
                        <h2 className="text-xl text-black md:text-3xl lg:text-5xl">
                            Partner with the best Exhibition stand design <br /> in Dubai
                        </h2>
                    </div>
                    <div className="w-full mt-5 space-y-2 lg:-mt-8 md:mt-10 md:mx-0 px-9 md:px-0">
                        {[
                            {
                                question: "Which service offers quick exhibition stand installation in Dubai?",
                                answers: "For quick exhibition stand installations Dubai, companies like XESS Exhibitions offer modular and quick production helped along by our in-house ability to produce custom exhibition stands."
                            },
                            {
                                question: "Where can I get creative exhibition stand concepts for upcoming events?",
                                answers: "At XESS, you can not only get creative exhibition stand concepts, you can get creative exhibition stand designs for free as well."
                            },
                            {
                                question: "Who specializes in eco-friendly exhibition stand designs in Dubai?",
                                answers: "We at XESS not only focus on eco-friendly stands but also on all-environment designs as well."
                            },
                            {
                                question: "Where to find exhibition stand builders with experience in tech industry events?",
                                answers: "We at XESS not only focus on eco-friendly stands but also on all-environment designs as well."
                            },
                        ].map((item: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;
                            const contentRef = contentRefs[index];

                            return (
                                <div key={index} className="border-[#00000056] text-black bg-white rounded-3xl" >
                                    <button className="flex items-center justify-between w-full p-1 text-lg font-medium text-left md:p-2 lg:p-4" onClick={() => toggleAccordion(index)}>
                                        <div className="flex items-center gap-2 lg:gap-10 3xl:gap-16 md:text-lg text-xs lg:text-base ps-4 md:ps-7 font-bold lg:max-w-[30rem] max-w-[15rem] md:max-w-[28rem] 3xl:max-w-[40rem]">
                                            {item.question}
                                        </div>
                                        <motion.div animate={{ rotate: isOpen ? 360 : 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full" >
                                            {isOpen ? (
                                                <ArrowUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ArrowDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: contentRef?.current?.scrollHeight || "auto", opacity: 1, }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden" >
                                                <div ref={contentRef} className="p-4 border-t-2 bg-gray-50 rounded-b-3xl" >
                                                    {item.answers?.split("\n").map((line: string, i: number) => (
                                                        <p key={i} className="text-xs list-disc md:text-base md:ps-7 ps-2" dangerouslySetInnerHTML={{ __html: line }} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}
