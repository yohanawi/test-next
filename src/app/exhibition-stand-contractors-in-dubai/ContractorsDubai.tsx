"use client";

import { GET_EXHIBITION_CONSTROCTOR_DATA } from "@/lib/queries";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/Contactform";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ContractorsDubai() {

    const { slug } = useParams();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [contentRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev: number | null) => (prev === index ? null : index));
    };
    const { data } = useQuery(GET_EXHIBITION_CONSTROCTOR_DATA, { variables: { locale: "en", city: slug }, skip: !slug, });
    const mainExhibitionconstroctor = data?.constroctorInCity?.data?.attributes || {};
    const { Conhead } = mainExhibitionconstroctor;
    const { ConSec } = data?.exhibitionPages?.data?.[0].attributes || {};
    // const accordion = mainExhibitionconstroctor?.accordion?.ConFaq || [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = Conhead?.image?.data?.attributes?.url ? `${baseUrl}${Conhead.image.data.attributes.url}` : "/images/Banner.jpg";

    const images = [
        ConSec?.image1?.data?.attributes?.url ? `${baseUrl}${ConSec.image1.data.attributes.url}` : "/images/exhibition1.png",
        ConSec?.image2?.data?.attributes?.url ? `${baseUrl}${ConSec.image2.data.attributes.url}` : "/images/exhibition2.png",
        // ConSec?.image3?.data?.attributes?.url ? `${baseUrl}${ConSec.image3.data.attributes.url}` : "/images/exhibition3.png",
        // ConSec?.image4?.data?.attributes?.url ? `${baseUrl}${ConSec.image4.data.attributes.url}` : "/images/exhibition4.png",
    ];

    const [, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-2xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {Conhead?.heading || "exhibition stand contractor"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={mainExhibitionconstroctor?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {Conhead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={mainExhibitionconstroctor?.breadcrumb?.link2 || "/exhibition-stand-contractors-in-dubai"} className="px-4 uppercase" >
                            {Conhead?.breadcrumb?.SubHead2 || "exhibition stand contractors in dubai"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-8 py-8 bg-white lg:py-14">
                <div className="lg:mx-40 3xl:mx-[15rem] mx-5 md:mx-20">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                            <div>
                                <h2 className="text-2xl font-normal text-black uppercase md:text-4xl lg:text-5xl"
                                    dangerouslySetInnerHTML={{
                                        __html: mainExhibitionconstroctor?.ConSec?.heading || "Exhibition stand <br /> contractors<span style='color: #EA2127;'> in Dubai</span>",
                                    }}>
                                </h2>
                                <p className="pt-2 text-sm font-bold text-black uppercase lg:text-base">
                                    {mainExhibitionconstroctor?.ConSec?.subheading || "Delivering High-Quality Exhibition Stands and Design Solutions"}
                                </p>
                                <div className="lg:py-3 py-2 text-sm text-[#3E444A] 3xl:text-base" dangerouslySetInnerHTML={{
                                    __html: mainExhibitionconstroctor?.ConSec?.description || "XESS Exhibitions and Events is an exhibition stand company in Dubai that has your best interests at heart. With its striking skyline, luxury lifestyle, and ultramodern architecture, Dubai is the heart of a new global crossroads. And at XESS, we know that you have your eyes on the prize. And we’re prepared to help you get it. Our project managers and trade show booth design teams are driven to provide you with the best experience possible.Be it the construction process or on the trade show floor, XESS aims to create exhibition stands that attract audiences and stamp your mark at your exhibition or even Dubai itself.",
                                }}>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:gap-4">
                                {images.map((src, index) => (
                                    <div key={index} className="relative w-full overflow-hidden transition-transform transform scale-100 aspect-square group duration-350 hover:scale-95"
                                        onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} >
                                        <Image src={src} layout="fill" objectFit="cover" alt={`Exhibition ${index + 1}`} className="object-cover w-full h-full transition-transform transform scale-100 rounded-xl duration-350 group-hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >
            </section >

            <section className="bg-[#d4d4d4] text-center lg:py-10 py-8">
                <div className="container px-6 mx-auto">
                    <h2 className="text-xl text-center text-black md:text-3xl lg:text-4xl md:mx-20">
                        {mainExhibitionconstroctor?.topic || "Rental Trade Show Booths that Leave an Unforgettable Experience"}
                    </h2>
                    <p className="text-[#EA2127] md:text-base py-2 text-xs px-8 uppercase">
                        {mainExhibitionconstroctor?.subTopic || "Providing High Quality Exhibition Services in Dubai"}
                    </p>
                    <div className="lg:mx-48 md:mx-20 mx-10 3xl:mx-[6rem]">
                        <p className="text-xs text-gray-700 md:text-base"
                            dangerouslySetInnerHTML={{
                                __html: mainExhibitionconstroctor?.description || "Sometimes you don’t need to build an exhibition stand from scratch. Fortunately, at XESS, we have a wide array of stands for you to choose from. As an expert in trade show booth design, we produce durable and all-environment booths that have been produced in our own facility. Our exhibition stand rentals are guaranteed to leave a lasting impression on your audience.",
                            }}>
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#D8DDE0] py-10">
                <h2 className="max-w-[4.2rem] text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[19rem] md:mx-32 mx-14 bg-white rounded-full px-4 py-1">
                    FAQ
                </h2>
                <div className="grid lg:grid-cols-2 lg:mx-48 md:mx-32 3xl:mx-56">
                    <div className="pt-8 mx-14 md:mx-0 3xl:mx-20">
                        <h2 className="text-xl text-black md:text-3xl lg:text-5xl">
                            Partner with the best exhibition stand contractors in Dubai
                        </h2>
                    </div>
                    <div className="w-full mt-5 space-y-2 lg:-mt-8 md:mt-10 md:mx-0 px-9 md:px-0">
                        {[
                            {
                                question: "What services do exhibition stand builders in Dubai provide for international exhibitions?",
                                answers: "Exhibition stand builders in Dubai offer a variety of services. These include design, fabrication, and construction of both custom and modular stands. Additionally, they also provide technical services such as AV equipment rental, lighting, and graphic printing. Project management services for either logistical or administrative tasks can also be provided."
                            },
                            {
                                question: "Why should I choose Global Branding as my exhibition stand builder in UAE for international exhibitions?",
                                answers: "One of the primary reasons to choose XESS is because of our experience within the exhibition and event industry in Dubai and the UAE as a whole. XESS events prides itself on being able to provide custom and innovative designs, specialized expertise, and strategic solutions with over 20 years of experience."
                            },
                            {
                                question: "What makes an exhibition stand design in Dubai suitable for international exhibitions?",
                                answers: "Dubai is at a major crossroads of the world. With brands from Europe, Asia, and Africa all using Dubai as a major hub due to its world-class infrastructure and venues like the Dubai World Trade Centre and Expo City. This, combined with their robust business ecosystem built to support major global events make it an ideal location for exhibitions and exhibition stand design."
                            },
                            {
                                question: "How do exhibition companies in Dubai help prepare for international trade shows?",
                                answers: "Exhibition companies help with Planning and strategy, Design and fabrication, On-site execution, and Post-show support. These companies handle the entire process from the initial planning, budgeting, scheduling, construction, delivery and on site support."
                            },
                            {
                                question: "What are the benefits of hiring exhibition stand builders UAE for an international exhibition?",
                                answers: "Hiring exhibition stand builders in the UAE offer several benefits.\nThey already know of the customer base in the UAE and will know how to cater to their expectations. Their expertise, professionalism, design knowledge, time saving, and cost effective solutions are also some other benefits."
                            }
                        ].map((item: { question: string, answers: string }, index: number) => {
                            const isOpen = openIndex === index;
                            const contentRef = contentRefs[index];

                            return (
                                <div key={index} className="border-[#00000056] text-black bg-white rounded-3xl" >
                                    <button className="flex items-center justify-between w-full p-1 text-lg font-medium text-left md:p-2 lg:p-4" onClick={() => toggleAccordion(index)} >
                                        <div className="flex items-center gap-2 lg:gap-10 3xl:gap-16 md:text-lg text-xs lg:text-base ps-4 md:ps-7 font-bold lg:max-w-[30rem] max-w-[15rem] md:max-w-[28rem] 3xl:max-w-[40rem]">
                                            {item.question}
                                        </div>
                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full" >
                                            {isOpen ? (
                                                <ArrowUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ArrowDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: contentRef?.current?.scrollHeight || "auto", opacity: 1, }}
                                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden" >
                                                <div ref={contentRef} className="p-4 border-t-2 bg-gray-50 rounded-b-3xl" >
                                                    {item.answers?.split("\n").map((line: string, i: number) => (
                                                        <p key={i} className="text-xs list-disc md:text-lg md:ps-7 ps-2" dangerouslySetInnerHTML={{ __html: line }} />
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

            <section className="bg-[#41474D] text-white lg:py-20 md:py-12 py-10 px-6 md:px-32 lg:px-56 3xl:px-[25rem]">
                <div className="grid gap-5 lg:grid-cols-2 lg:gap-32">
                    <div>
                        <h2 className="text-3xl font-bold lg:text-4xl">
                            Production Processes
                        </h2>
                        <h5 className="py-5 text-lg">
                            Our Process to Get Your Booth Ready!
                        </h5>
                        <p className="text-gray-300">
                            Let us drive you through this process in a jiffy. At first, before
                            accepting the project we conduct a discussion with the client to
                            gather information to provide the design concepts, after the
                            briefing, the design will be created and shown, with the client’s
                            approval on the design the costing for the overall project will be
                            done. After the client’s confirmation, we begin in-house
                            production where we build the exhibition stand adhering to your
                            needs. From design to dismantling, we make it a hassle-free
                            experience on your exhibition day.
                        </p>
                    </div>
                    <div className="relative w-full lg:w-[40rem] md:h-[20rem] h-[12rem] lg:h-96 lg:-ms-20">
                        <Image src="/images/XESS-Process-Road-map.png" layout="fill" alt="Event 1" />
                    </div>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}
