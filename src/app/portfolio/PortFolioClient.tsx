"use client";

import { GET_PORTFOLIO_CATEGORY, GET_PORTFOLIO_IMAGES, GET_PORTFOLIO_PAGE } from "@/lib/queries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/Contactform";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

type Category = {
    attributes: {
        name: string;
    };
};

type PortfolioItem = {
    attributes: {
        name: string;
        description?: string;
        image?: {
            data?: {
                attributes?: {
                    url?: string;
                };
            };
        };
        portfolio_catgry?: {
            data?: {
                attributes?: {
                    name: string;
                };
            };
        };
        SubImgs?: {
            images?: SubImage[];
        };
    };
};


type SubImage = {
    image?: {
        data?: {
            attributes?: {
                url?: string;
            };
        };
    };
};



export default function Portfolio() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data: pageData, } = useQuery(GET_PORTFOLIO_PAGE, { variables: { locale } });
    const { data: imgData, } = useQuery(GET_PORTFOLIO_IMAGES, { variables: { locale } });
    const { data: categoryData, } = useQuery(GET_PORTFOLIO_CATEGORY, { variables: { locale } });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const portfolioPage = pageData?.portfolioPages?.data?.[0]?.attributes || {};
    const heroSection = portfolioPage?.HeroSec || {};
    const standSection = portfolioPage?.StandSec || {};

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    const portfolioItems = imgData?.portfolioImgs?.data || [];
    const categories = ["All", ...(categoryData?.portfolioCatgries?.data?.map((cat: Category) => cat.attributes.name) || []),];
    const [activeTab, setActiveTab] = useState("All");
    // const [visibleImages, setVisibleImages] = useState(8);
    const filteredPortfolio = portfolioItems.filter((item: PortfolioItem) => {
        const categoryName = item.attributes?.portfolio_catgry?.data?.attributes?.name || "";
        return activeTab === "All" || categoryName === activeTab;
    });

    // const loadMoreImages = () => setVisibleImages((prev) => prev + 4);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const openModal = (index: number) => {
        const item = filteredPortfolio[index];
        const mainImage = item.attributes?.image?.data?.attributes?.url ? `${baseUrl}${item.attributes.image.data.attributes.url}` : "/images/01.jpg";
        const subImgUrls = item.attributes?.SubImgs?.images?.map((subImage: SubImage) =>
            subImage.image?.data?.attributes?.url ? `${baseUrl}${subImage.image.data.attributes.url}` : "/images/default-image.jpg"
        ) || [];

        const allImages = [mainImage, ...subImgUrls];
        setCurrentImages(allImages);
        setCurrentImageIndex(0);
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setCurrentImages([]);
        setCurrentImageIndex(0);
        setCurrentIndex(null);
    };

    const handleNext = () => {
        if (currentIndex === null) return;

        if (currentImageIndex < currentImages.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
        } else if (currentIndex < filteredPortfolio.length - 1) {
            openModal(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex === null) return;

        if (currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
        } else if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const item = filteredPortfolio[prevIndex];
            const mainImage = item.attributes?.image?.data?.attributes?.url ? `${baseUrl}${item.attributes.image.data.attributes.url}` : "/images/01.jpg";
            const subImgUrls = item.attributes?.SubImgs?.images?.map((subImage: SubImage) =>
                subImage.image?.data?.attributes?.url ? `${baseUrl}${subImage.image.data.attributes.url}` : "/images/default-image.jpg"
            ) || [];

            const allImages = [mainImage, ...subImgUrls];
            setCurrentImages(allImages);
            setCurrentImageIndex(allImages.length - 1);
            setCurrentIndex(prevIndex);
        }
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                closeModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [isZoomed, setIsZoomed] = useState(false);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            } else if (e.key === "Escape") {
                setIsZoomed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentIndex, currentImageIndex, currentImages]);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={heroSection?.bgImage?.data?.attributes?.url ? `${baseUrl}${heroSection.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {heroSection?.title || "Portfolio"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="portfolio" className="px-4 uppercase">{heroSection?.title || "Portfolio"}</Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6]">
                <div className="py-5 text-center lg:mx-56 md:py-10 3xl:py-20 mx-14">
                    <h2 className="font-sans text-2xl font-normal text-gray-800 lg:text-5xl md:text-3xl">
                        {standSection?.title || "Our Exhibition Stand Projects"}
                    </h2>
                    <p className="text-xs leading-relaxed tracking-wide text-gray-500 3xl:text-lg md:pt-5 md:text-sm"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(standSection?.description),
                        }}
                    ></p>
                </div>
            </section>

            <section className="bg-[#d8dde0] lg:py-10 md:py-8 py-5">
                <div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 md:text-sm text-black text-center border-b border-gray-300 lg:mx-44 mx-16 md:mx-10 bg-[#f4f4f5] rounded-lg gap-2 p-2 lg:px-4 lg:py-0">
                        {categories.map((category: string, index: number) => (
                            <button key={index} onClick={() => setActiveTab(category)} className={`w-full py-1 lg:m-2 m-0 text-sm font-medium transition relative ${activeTab === category
                                ? "text-[#B40C17] bg-white rounded-xl" : "text-[#71717A] hover:bg-gray-200 hover:text-[#D10003]"}`} >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 pt-10 mx-4 lg:grid-cols-4 md:grid-cols-2 lg:pt-14 lg:mx-6">
                        {filteredPortfolio.slice(0,).map((item: PortfolioItem, index: number) => {
                            const imageUrl = item.attributes?.image?.data?.attributes?.url ? `${baseUrl}${item.attributes.image.data.attributes.url}` : "/images/01.jpg";
                            return (
                                <div key={index} className="relative group overflow-hidden aspect-[4/3]" onClick={() => openModal(index)} >
                                    <div className="relative w-full h-full">
                                        <Image src={imageUrl} alt={item.attributes.name} layout="fill" objectFit="cover" className="object-center transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute inset-0 transition-opacity duration-300 bg-black opacity-0 group-hover:opacity-40"></div>
                                    </div>
                                    <span className="absolute z-20 w-0 h-0 transition-all duration-300 border-white top-6 right-6 group-hover:border-t-4 group-hover:border-r-4 group-hover:w-full group-hover:h-full"></span>
                                    <span className="absolute z-20 w-0 h-0 transition-all duration-300 border-white bottom-6 left-6 group-hover:border-b-4 group-hover:border-l-4 group-hover:w-full group-hover:h-full"></span>
                                    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 text-center transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100">
                                        <div className={`pointer-events-auto text-black mt-8 ${item.attributes.name && item.attributes.description ? "bg-white opacity-85" : "bg-white opacity-0"} py-2 mx-5`} >
                                            <h2 className="mb-2 text-2xl font-semibold text-center uppercase">
                                                {item.attributes.name}
                                            </h2>
                                            <p className="max-w-xs mx-auto text-sm font-light text-center capitalize">
                                                {item.attributes.description}
                                            </p>
                                        </div>

                                        <div className="flex justify-center mb-5 pointer-events-auto">
                                            <Image src="/images/ic_round-plus.png" alt="Expand" width={44} height={44} className="p-2 transition-all duration-300 rounded-full cursor-pointer group-hover:bg-red-600" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {currentImages.length > 0 && (
                        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[120] p-4">
                            <div ref={modalRef} className="relative w-full max-w-[40rem] xl:max-w-[50rem] 3xl:max-w-[80rem] 4k:max-w-[150rem] mx-auto flex flex-col items-center" >
                                <div className={`relative  transition-all duration-300 ${isZoomed ? "w-screen h-screen cursor-zoom-out" : "max-h-[80vh] w-full h-[80vh] cursor-zoom-in"}`}>
                                    <Image src={currentImages[currentImageIndex]} onClick={toggleZoom} alt="Selected" layout="fill" objectFit="contain" className="rounded-lg" />
                                </div>
                                {!isZoomed && (
                                    <>
                                        <button className="absolute z-50 flex items-center justify-center w-12 h-12 p-2 text-4xl text-white transition-all bg-gray-300 rounded-full shadow-lg top-14 right-2 3xl:right-40 4k:right-60 bg-opacity-70 hover:bg-gray-700" onClick={closeModal} >
                                            &times;
                                        </button>
                                        {currentImages.length > 1 && (
                                            <div className="grid grid-cols-6 gap-2 mt-4">
                                                {currentImages.slice(1).map((subImgUrl, idx) => (
                                                    <div key={idx} className={`relative w-20 h-auto aspect-square cursor-pointer border rounded ${currentImageIndex === idx + 1 ? "border-red-500" : "border-white"}`} onClick={() => setCurrentImageIndex(idx + 1)} >
                                                        <Image src={subImgUrl} alt={`Sub Image ${idx + 1}`} layout="fill" objectFit="cover" className="rounded" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentIndex !== null && currentIndex > 0 && (
                                            <button className="absolute p-2 text-4xl text-white transform -translate-y-1/2 bg-gray-900 bg-opacity-50 rounded-full lg:-left-20 left-1 top-1/2 lg:bg-gray-300 hover:bg-gray-900" onClick={handlePrev} >
                                                <ChevronLeft className="w-8 h-8" />
                                            </button>
                                        )}

                                        {currentIndex !== null &&
                                            currentIndex < filteredPortfolio.length - 1 && (
                                                <button className="absolute p-2 text-4xl text-white transform -translate-y-1/2 bg-gray-900 bg-opacity-50 rounded-full lg:-right-20 right-1 top-1/2 lg:bg-gray-300 hover:bg-gray-900" onClick={handleNext} >
                                                    <ChevronRight className="w-8 h-8" />
                                                </button>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {/* {visibleImages < filteredPortfolio.length && (
                        <div className="flex items-center justify-center pt-10 ">
                            <button onClick={loadMoreImages} className="uppercase text-[#E21F2C] border border-[#E21F2C] text-xs font-sans font-normal lg:px-6 px-4 py-2 rounded-md hover:bg-[#E21F2C] hover:text-white transition" >
                                View More
                            </button>
                        </div>
                    )} */}
                </div>
            </section >

            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}