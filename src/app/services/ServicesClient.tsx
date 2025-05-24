"use client";

import { GET_EXHIBITION_PAGE_DATA, GET_SERVICE_DATA } from "@/lib/queries";
import { useState, useRef, useEffect } from "react";
import ContactForm from "@/components/Contactform";
import { Check, Minus, Plus } from "lucide-react";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type CardItem = {
    icon?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
    number: number;
    label: string;
};

type SlideImage = {
    attributes: {
        url: string;
        alternativeText?: string;
    };
};


export default function Services() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data: serviceData } = useQuery(GET_SERVICE_DATA, { variables: { locale }, });
    const { data: exhibitionData } = useQuery(GET_EXHIBITION_PAGE_DATA, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const servicePages = serviceData?.servicePages?.data?.[0]?.attributes || {};
    const heroSec = servicePages?.HeroSec || {};
    const offerSec = servicePages?.OfferSec || {};
    const secndSec = servicePages?.SecndSec || {};
    const faqSec = servicePages?.faqSec || {};
    const portfolioImages = [
        servicePages?.banner1?.data?.attributes?.url ? `${baseUrl}${servicePages.banner1.data.attributes.url}` : "/images/portfolio1.png",
        servicePages?.banner2?.data?.attributes?.url ? `${baseUrl}${servicePages.banner2.data.attributes.url}` : "/images/portfolio2.png",
        servicePages?.banner3?.data?.attributes?.url ? `${baseUrl}${servicePages.banner3.data.attributes.url}` : "/images/portfolio3.png",
    ];

    const slideUpImgs = secndSec?.slideUpImgs?.data || [];
    const slideDownImgs = secndSec?.slideDownImgs?.data || [];
    const mainExhibition = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};
    const { services } = exhibitionData?.exhibitionPages?.data?.[0].attributes || {};

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
            link: services?.link3 || "/#",
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const [active, setActive] = useState("All");
    const scrollRef1 = useRef<HTMLDivElement | null>(null);
    const scrollRef2 = useRef<HTMLDivElement | null>(null);
    const normalSpeed = 30;
    const [speed] = useState(normalSpeed);

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

    const Counter = ({ value }: { value: number }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {

            const duration = 5000;
            const startTime = performance.now();

            const animateCounter = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = Math.ceil(progress * value);

                setCount(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(animateCounter);
                }
            };
            requestAnimationFrame(animateCounter);
        }, [value]);

        return (
            <span className="text-2xl font-bold text-red-600 md:text-4xl">
                {count}+
            </span>
        );
    };

    const [, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={heroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${heroSec.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">services</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/services" className="px-4 uppercase">services</Link>
                    </div>
                </div>
            </section>

            <section className="lg:h-screen 3xl:h-[90vh] bg-[url('/images/about.jpg')] bg-cover bg-center bg-no-repeat" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                <div className="h-full gap-4 lg:grid lg:grid-cols-3">
                    <div className="flex items-center justify-center col-span-2 mx-16 lg:mx-0 lg:ms-2 3xl:ms-12">
                        <div>
                            <h1 className="lg:text-[74px] md:text-[50px] text-[32px] font-bold text-black max-w-[500px] pt-12 lg:pt-0 leading-none"
                                dangerouslySetInnerHTML={{ __html: secndSec?.title || "Our <span class='text-[#D10003]'>Services</span>" }}>
                            </h1>
                            <p className="text-black font-light lg:text-[24px] md:text-[18px] max-w-[550px] pt-4 lg:pt-0">
                                {secndSec?.description || "We provide expert branding solutions for exhibition stands and events."}
                            </p>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 max-w-[720px]">
                                {secndSec?.Card?.map((card: CardItem, index: number) => {
                                    const iconUrl = card.icon?.data?.attributes?.url ? `${baseUrl}${card.icon.data.attributes.url}` : "/images/about-icon1.png";
                                    return (
                                        <div key={index} className="bg-[#d9d9d9] p-4 rounded-3xl flex lg:block">
                                            <Image src={iconUrl} width={65} height={60} alt={card.label || "Icon"} className="mb-2" />
                                            <div className="border-l-8 border-[#D10003] lg:pl-2 pl-2 ms-2">
                                                <div className="flex items-center gap-x-2">
                                                    <p className="text-[#383838] font-semibold text-[34px] pt-2 md:pt-0 md:text-[44px]"><Counter value={card.number} /></p>
                                                    <p className="text-[#383838] font-semibold text-[16px] md:text-[18px] lg:text-[18px]">{card.label}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden lg:w-[600px] lg:-ms-28">
                        <div className="flex flex-col items-center justify-center pt-12 space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:pt-0 lg:mr-12 lg:-mt-20">

                            <div className="overflow-hidden lg:h-[115vh] lg:rotate-12" ref={scrollRef1}>
                                <div className="flex space-x-4 lg:flex-col lg:space-y-2 lg:space-x-0">
                                    {slideUpImgs.map((img: SlideImage, index: number) => (
                                        <div key={index} className="flex-shrink-0">
                                            <Image src={`${baseUrl}${img.attributes.url}`} alt={img.attributes.alternativeText || `Slide ${index + 1}`} width={180} height={180} className="rounded-3xl object-cover w-[120px] h-[110px] md:w-[150px] md:h-[130px] lg:w-[180px] lg:h-[180px]" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-hidden lg:h-[115vh] lg:rotate-12 pb-10 lg:pb-0" ref={scrollRef2}>
                                <div className="flex space-x-4 lg:flex-col lg:space-y-2 lg:space-x-0">
                                    {slideDownImgs.map((img: SlideImage, index: number) => (
                                        <div key={index} className="flex-shrink-0">
                                            <Image src={`${baseUrl}${img.attributes.url}`} alt={img.attributes.alternativeText || `Slide ${index + 1}`} width={180} height={180} className="rounded-3xl object-cover w-[120px] h-[110px] md:w-[150px] md:h-[130px] lg:w-[180px] lg:h-[180px]" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className=" bg-[#d8dde0] py-[50px] md:py-12 lg:py-16 3xl:px-8">
                <div className="lg:mx-40 mx-10 md:mx-20 3xl:mx-[17rem]">
                    <div className="container mx-auto">
                        <div className="text-2xl text-center text-black lg:text-4xl">
                            <h2>{offerSec?.title || "We Offer Our Clients"}</h2>
                            <div className="flex justify-center py-5 mb-10 space-x-6 overflow-x-auto text-base font-normal md:text-lg" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                                {offerSec?.clintOfferCat?.map((category: { name: string, link: string }, index: number) => (
                                    <button key={index} onClick={() => setActive(category.name)} className={`uppercase transition-colors duration-300 ${active === category.name ? "text-[#d42300]" : "text-black hover:text-[#d42300]"}`}>
                                        <Link href={category.link}>{category.name}</Link>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="flex flex-col justify-center">
                                <p className="text-xl font-normal text-black lg:text-2xl" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                                    {offerSec?.main_description || "From humble beginnings to industry leaders, we've spent 15+ years perfecting the art of exhibition stand design and construction"}
                                </p>
                                <div className="py-5 text-sm text-black lg:pb-8 3xl:text-base" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                                    <p className="mt-4"
                                        dangerouslySetInnerHTML={{ __html: offerSec?.sub_description || "" }}>
                                    </p>
                                </div>
                                <div className="grid gap-4 text-xs text-black md:grid-cols-2 3xl:text-sm">
                                    {offerSec?.offerList?.map((offer: { name: string }, index: number) => (
                                        <div key={index} className="flex items-center gap-6">
                                            {offer.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[offerSec?.image1, offerSec?.image2, offerSec?.image3, offerSec?.image4].map((img, index) => (
                                    img?.data?.attributes?.url && (
                                        <div key={index} className="block w-full overflow-hidden scaling-image" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} >
                                            <div className="overflow-hidden transition-transform transform scale-100 frame duration-350 aspect-square hover:scale-95">
                                                <div className="relative w-full overflow-hidden shadow-md group">
                                                    <Image src={`${baseUrl}${img.data.attributes.url}`} alt={`Exhibition ${index + 1}`} width={800} height={800} layout="responsive" objectFit="cover" priority={index === 0} quality={30} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="transition-transform transform scale-100 duration-350 hover:scale-110" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center lg:py-12 md:py-16 py-10">
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
                            <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                                <Link href={item.link}>
                                    <Image src={item.image} alt={item.title} width={400} height={300} className="w-full transition-transform duration-300 ease-in-out hover:scale-105" />
                                    <div className="p-4 bg-white text-black font-semibold text-lg text-center hover:text-[#EA2127]">
                                        {item.title}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#d8dde0] md:py-12 py-10">
                <div className="flex items-center justify-center py-5 lg:py-0 lg:pb-10 md:py-8">
                    <div className="w-full lg:max-w-[74rem] md:max-w-xl 3xl:max-w-[84rem] max-w-xs space-y-2">
                        {faqSec?.faqList?.map((item: { question: string, answers: string }, index: number) => (
                            <div key={index} className=" border-b-2 border-[#00000056]  text-black">
                                <button className="flex items-center justify-between w-full p-4 text-lg font-medium text-left" onClick={() => toggleAccordion(index)} >
                                    <div className="flex items-center gap-2 text-base 3xl:gap-16 lg:text-lg">
                                        <Check className="text-black" />
                                        {item.question}
                                    </div>
                                    {openIndex === index ? (
                                        <Minus className="text-gray-600" />
                                    ) : (
                                        <Plus className="text-gray-600" />
                                    )}
                                </button>

                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: openIndex === index ? "auto" : 0, opacity: openIndex === index ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden" >
                                    {openIndex === index && (
                                        <div className="p-4">
                                            <div className="space-y-2 text-xs text-gray-700 list-disc 3xl:ms-20 lg:ms-8 lg:mx-7 md:text-sm lg:text-base">
                                                {item.answers.split('\n').map((answer: string, i: number) => (
                                                    <p key={i} className="list-disc" dangerouslySetInnerHTML={{ __html: answer }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            <section className="py-5 bg-white">
                <div className="grid gap-4 mx-4 lg:grid-cols-3 md:grid-cols-3 lg:pt-4 lg:mx-6">
                    {portfolioImages.map((imageUrl, index) => (
                        <div key={index} className="relative w-full lg:h-[27rem] md:h-[15rem] h-[20rem] group overflow-hidden">
                            <Image src={imageUrl} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}