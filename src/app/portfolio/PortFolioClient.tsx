"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/Contactform";
import Image from "next/image";
import Link from "next/link";

type Category = {
    attributes: { name: string };
};

type PortfolioItem = {
    attributes: {
        name: string;
        description?: string;
        image?: {
            data?: { attributes?: { url?: string; alternativeText?: string | null } };
        };
        portfolio_catgry?: {
            data?: { attributes?: { name?: string } };
        };
        SubImgs?: { images?: SubImage[] };
    };
};

type SubImage = {
    image?: { data?: { attributes?: { url?: string; alternativeText?: string | null } } };
};

export default function PortFolioClient({ pageData, imgData, categoryData, baseUrl }: any) {
    const portfolioPage = pageData?.portfolioPages?.data?.[0]?.attributes || {};
    const heroSection = portfolioPage?.HeroSec || {};
    const standSection = portfolioPage?.StandSec || {};

    const sanitizeHtml = (html: string) => {
        if (!html) return "";
        let cleaned = html.replace(/font-family:[^;"']*;?/gi, "");
        cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
        return cleaned;
    };

    const portfolioItems: PortfolioItem[] = imgData?.portfolioImgs?.data || [];
    const categories = ["All", ...(categoryData?.portfolioCatgries?.data?.map((c: Category) => c.attributes.name) || [])];

    const [activeTab, setActiveTab] = useState("All");
    const [itemsToShow, setItemsToShow] = useState(12);

    const filteredPortfolio = portfolioItems.filter((item: PortfolioItem) => {
        const categoryName = item.attributes?.portfolio_catgry?.data?.attributes?.name || "";
        return activeTab === "All" || categoryName === activeTab;
    });

    const displayedItems = filteredPortfolio.slice(0, itemsToShow);

    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const openModal = (index: number) => {
        const item = filteredPortfolio[index];
        const mainImage =
            item.attributes?.image?.data?.attributes?.url
                ? `${baseUrl}${item.attributes.image.data.attributes.url}`
                : "/images/01.jpg";

        const subImgUrls =
            item.attributes?.SubImgs?.images?.map((s: SubImage) =>
                s.image?.data?.attributes?.url
                    ? `${baseUrl}${s.image.data.attributes.url}`
                    : "/images/default-image.jpg"
            ) || [];

        const allImages = [mainImage, ...subImgUrls];

        setCurrentImages(allImages);
        setCurrentImageIndex(0);
        setCurrentIndex(index);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setCurrentImages([]);
        setCurrentIndex(null);
        setCurrentImageIndex(0);
        document.body.style.overflow = "";
    };

    const handleNext = () => {
        if (currentIndex === null) return;

        // next sub image
        if (currentImageIndex < currentImages.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
        }
        // next gallery item
        else if (currentIndex < filteredPortfolio.length - 1) {
            openModal(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex === null) return;

        // previous sub image
        if (currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
        } else if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const item = filteredPortfolio[prevIndex];

            const mainImage =
                item.attributes?.image?.data?.attributes?.url
                    ? `${baseUrl}${item.attributes.image.data.attributes.url}`
                    : "/images/01.jpg";

            const subImgUrls =
                item.attributes?.SubImgs?.images?.map((s: SubImage) =>
                    s.image?.data?.attributes?.url
                        ? `${baseUrl}${s.image.data.attributes.url}`
                        : "/images/default-image.jpg"
                ) || [];

            const allImages = [mainImage, ...subImgUrls];
            setCurrentImages(allImages);
            setCurrentImageIndex(allImages.length - 1);
            setCurrentIndex(prevIndex);
        }
    };

    // Close modal on outside click
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeModal();
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Keyboard arrows + ESC support
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [currentIndex, currentImages, currentImageIndex]);

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center justify-center text-center">
                <Image src={heroSection?.bgImage?.data?.attributes?.url ? `${baseUrl}${heroSection.bgImage.data.attributes.url}` : "/images/Banner.jpg"}
                    fill priority alt={heroSection?.title || "Portfolio Banner"} className="object-cover" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70" />
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="text-xl font-semibold text-white uppercase md:text-3xl lg:text-5xl">
                        {heroSection?.title || "Portfolio"}
                    </h1>
                    <div className="flex justify-center pt-2 text-xs text-white md:text-sm">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/portfolio" className="px-4 uppercase">
                            {heroSection?.title || "Portfolio"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* DESCRIPTION SECTION */}
            <section className="bg-[#f6f6f6]">
                <div className="py-5 text-center lg:mx-56 md:py-10 3xl:py-20 mx-14">
                    <h2 className="text-2xl text-gray-800 md:text-3xl lg:text-5xl">
                        {standSection?.title || "Our Exhibition Stand Projects"}
                    </h2>
                    <p className="text-xs leading-relaxed tracking-wide text-gray-500 3xl:text-lg md:pt-5 md:text-sm"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(standSection?.description),
                        }}
                    />
                </div>
            </section>

            {/* FILTER BUTTONS */}
            <section className="bg-[#d8dde0] py-6 md:py-10">
                <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-2 bg-[#f4f4f5] mx-10 md:mx-20 lg:mx-44 p-3 rounded-lg text-center border-b border-gray-300">
                    {categories.map((cat, idx) => (
                        <button key={idx}
                            onClick={() => {
                                setActiveTab(cat);
                                setItemsToShow(12);
                            }}
                            className={`py-2 rounded-xl text-sm transition ${activeTab === cat
                                ? "bg-white text-[#B40C17]"
                                : "text-[#71717A] hover:bg-gray-200 hover:text-[#D10003]"
                                }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* PORTFOLIO GRID */}
                <div className="grid gap-4 pt-10 mx-4 lg:grid-cols-4 md:grid-cols-2 lg:pt-14">
                    {displayedItems.map((item, index) => {
                        const imgUrl = item.attributes?.image?.data?.attributes?.url ? `${baseUrl}${item.attributes.image.data.attributes.url}` : "/images/01.jpg";
                        const altText = item.attributes?.image?.data?.attributes?.alternativeText || `${item.attributes.name} - Portfolio Image`;

                        return (
                            <div key={index} onClick={() => openModal(index)} className="relative group overflow-hidden aspect-[4/3] cursor-pointer">
                                <Image src={imgUrl} alt={altText} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                <span className="absolute z-20 w-0 h-0 transition-all duration-300 border-white top-6 right-6 group-hover:border-t-4 group-hover:border-r-4 group-hover:w-full group-hover:h-full"></span>
                                <span className="absolute z-20 w-0 h-0 transition-all duration-300 border-white bottom-6 left-6 group-hover:border-b-4 group-hover:border-l-4 group-hover:w-full group-hover:h-full"></span>

                                <div className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-40" />
                                <div className="absolute inset-0 flex flex-col justify-between p-6 text-center transition opacity-0 group-hover:opacity-100">
                                    <div className={`bg-white mt-8 ${item.attributes.description ? "opacity-85" : "opacity-0"} text-black py-2 mx-5`}>
                                        <h3 className="text-2xl font-semibold uppercase">
                                            {item.attributes.name}
                                        </h3>
                                        <p className="text-sm capitalize">
                                            {item.attributes.description}
                                        </p>
                                    </div>

                                    <img src="/images/plus.png" width={44} height={44} alt={`Open ${item.attributes.name}`} className="p-2 mx-auto mb-5 transition rounded-full group-hover:bg-red-600" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* LOAD MORE */}
                {itemsToShow < filteredPortfolio.length && (
                    <div className="flex justify-center mt-10">
                        <button onClick={() => setItemsToShow((prev) => prev + 8)}
                            className="px-6 py-2 text-xs uppercase border border-[#E21F2C] text-[#E21F2C] rounded-md hover:bg-[#E21F2C] hover:text-white transition">
                            View More
                        </button>
                    </div>
                )}
            </section>

            {/* CONTACT SECTION */}
            <section className="hidden w-full lg:block">
                <ContactForm />
            </section>

            {/* MODAL */}
            {currentImages.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-[120] flex items-center justify-center p-4">
                    <div ref={modalRef} className="relative max-w-[50rem] w-full max-w-[40rem] xl:max-w-[50rem] 3xl:max-w-[80rem] 4k:max-w-[150rem] mx-auto">
                        <div className="relative h-[80vh] cursor-pointer">
                            <Image
                                src={currentImages[currentImageIndex]}
                                alt={`Gallery Image ${currentImageIndex + 1}`}
                                fill
                                className="object-contain rounded-lg"
                                onClick={() =>
                                    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
                                }
                            />
                        </div>

                        {/* Close button */}
                        <button className="absolute z-50 flex items-center justify-center w-12 h-12 p-2 text-4xl text-white transition-all bg-gray-300 rounded-full shadow-lg top-14 right-2 3xl:right-40 4k:right-60 bg-opacity-70 hover:bg-gray-700" onClick={closeModal} >
                            &times;
                        </button>

                        {currentImages.length > 1 && (
                            <div className="grid grid-cols-6 gap-2 mx-auto mt-4 w-fit">
                                {currentImages.slice(1).map((subImgUrl, idx) => (
                                    <div key={idx} className={`relative w-20 h-auto aspect-square cursor-pointer border rounded ${currentImageIndex === idx + 1 ? "border-red-500" : "border-white"}`} onClick={() => setCurrentImageIndex(idx + 1)} >
                                        <Image src={subImgUrl} alt={`Sub Image ${idx + 1}`} layout="fill" objectFit="cover" className="rounded" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Prev */}
                        {currentIndex! > 0 && (
                            <button className="absolute p-2 text-4xl text-white transform -translate-y-1/2 bg-gray-900 bg-opacity-50 rounded-full lg:-left-20 left-1 top-1/2 lg:bg-gray-300 hover:bg-gray-900" onClick={handlePrev} >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                        )}

                        {/* Next */}
                        {currentIndex! < filteredPortfolio.length - 1 && (
                            <button className="absolute p-2 text-4xl text-white transform -translate-y-1/2 bg-gray-900 bg-opacity-50 rounded-full lg:-right-20 right-1 top-1/2 lg:bg-gray-300 hover:bg-gray-900" onClick={handleNext} >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
