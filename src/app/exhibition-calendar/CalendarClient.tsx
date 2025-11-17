"use client";

import { GET_ALL_CALENDAR, GET_CALENDER } from "@/lib/queries";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperType } from 'swiper/types';
import ContactForm from "@/components/Contactform";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavigationOptions } from 'swiper/types';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import "swiper/css/pagination";
import Image from "next/image";
import "swiper/css/navigation";
import Link from "next/link";
import "swiper/css";

export type EventItem = {
    attributes: {
        slug: string;
        CalenCrd: {
            startDate: string;
            is_popular?: boolean;
            title?: string;
            location?: string;
            category?: string;
            logo?: {
                data?: {
                    attributes?: {
                        url?: string;
                    };
                };
            };
        };
    };
};


type CalendarItem = {
    attributes: {
        slug: string;
        CalenCrd: {
            startDate: string;
            title: string;
            location?: string;
            category?: string;
            is_popular?: boolean;
            logo?: {
                data?: {
                    attributes?: {
                        url?: string;
                    };
                };
            };
        };
    };
};

export default function Calendar() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_CALENDER, { variables: { locale }, });
    const { loading: allcalendarLoading, error: allcalendarError, data: allcalendarData } = useQuery(GET_ALL_CALENDAR, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const calendarData = data?.calenders?.data?.[0]?.attributes || {};
    const heroSection = calendarData?.HeroSec || {};
    const Allcalendar = allcalendarData?.calenDetails?.data || [];
    const [selectedFilter, setSelectedFilter] = useState("This Year");
    const [isOpen, setIsOpen] = useState(false);
    const filters = ["This Month", "Last Month", "This Year", "Custom"];

    const filterEvents = (events: EventItem[], filter: string): EventItem[] => {
        const now = new Date();
        let filteredEvents = events;

        switch (filter) {
            case "This Month":
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                filteredEvents = events.filter(event => {
                    const startDate = new Date(event.attributes.CalenCrd.startDate);
                    return (
                        startDate >= startOfMonth &&
                        startDate <= endOfMonth &&
                        event.attributes.CalenCrd.is_popular
                    );
                });
                break;

            case "Last Month":
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                filteredEvents = events.filter(event => {
                    const startDate = new Date(event.attributes.CalenCrd.startDate);
                    return (
                        startDate >= startOfLastMonth &&
                        startDate <= endOfLastMonth &&
                        event.attributes.CalenCrd.is_popular
                    );
                });
                break;

            case "This Year":
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const endOfYear = new Date(now.getFullYear(), 11, 31);
                filteredEvents = events.filter(event => {
                    const startDate = new Date(event.attributes.CalenCrd.startDate);
                    return (
                        startDate >= startOfYear &&
                        startDate <= endOfYear &&
                        event.attributes.CalenCrd.is_popular
                    );
                });
                break;

            case "Custom":
                break;

            default:
                break;
        }

        return filteredEvents;
    };

    const filteredEvents = filterEvents(Allcalendar, selectedFilter);
    const [months, setMonths] = useState<string[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    useEffect(() => {
        const monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        setMonths(monthNames);
        const currentYear = new Date().getFullYear();
        const yearRange: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
        setYears(yearRange);
    }, []);

    const filteredCalendar = Allcalendar.filter((item: CalendarItem) => {
        const startDate = new Date(item.attributes.CalenCrd.startDate);
        const matchesMonth = selectedMonth ? startDate.getMonth() + 1 === Number(selectedMonth) : true;
        const matchesYear = selectedYear ? startDate.getFullYear() === Number(selectedYear) : true;
        return matchesMonth && matchesYear;
    });

    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const totalPages = Math.ceil(filteredCalendar.length / 9);

    useEffect(() => {
        if (
            swiperInstance &&
            swiperInstance.params.navigation &&
            typeof swiperInstance.params.navigation === 'object' &&
            prevRef.current &&
            nextRef.current
        ) {
            const navigation = swiperInstance.params.navigation as NavigationOptions;

            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;

            swiperInstance.navigation.destroy();
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    // Sort by latest event first
    const sortedCalendar = [...filteredCalendar].sort((a: CalendarItem, b: CalendarItem) => {
        const dateA = new Date(a.attributes.CalenCrd.startDate);
        const dateB = new Date(b.attributes.CalenCrd.startDate);
        const now = new Date();

        const isCurrentMonth = (d: Date) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

        const aCurrent = isCurrentMonth(dateA);
        const bCurrent = isCurrentMonth(dateB);

        // Current month first
        if (aCurrent && !bCurrent) return -1;
        if (!aCurrent && bCurrent) return 1;

        // Within the same group, latest (newest) first
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={heroSection?.bgImage?.data?.attributes?.url ? `${baseUrl}${heroSection.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">{heroSection?.title || "Exhibition Calendar"}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/exhibition-calendar" className="px-4 uppercase">{heroSection?.title || "Exhibition Calendar"}</Link>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="lg:mx-24">
                    <div className="pt-20 pb-10">
                        <div className="flex items-center justify-between mx-8 lg:mx-20 3xl:mx-48 md:mx-20">
                            <h2 className="font-sans text-lg font-normal text-gray-800 lg:text-3xl">
                                Popular Events
                            </h2>
                            <div className="relative">
                                <button onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 font-sans text-xs text-gray-500 transition-all border border-gray-300 rounded-md lg:text-sm hover:text-gray-900 hover:border-gray-900">
                                    {selectedFilter} ▼
                                </button>
                                {isOpen && (
                                    <div className="absolute z-10 w-40 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filters.map((filter) => (
                                            <button key={filter} onClick={() => { setSelectedFilter(filter); setIsOpen(false); }} className="block w-full px-4 py-2 text-sm text-left text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }} navigation pagination={{ clickable: true }} className="lg:mx-40" >
                        {allcalendarLoading ? (<div>Loading...</div>) : allcalendarError ? (<div>Error fetching calendar data</div>) : (
                            filteredEvents.map((calendarItem: EventItem, index: number) => {
                                const calendar = calendarItem.attributes.CalenCrd;
                                const startDate = new Date(calendar?.startDate || "");
                                const day = startDate.getDate();
                                const weekday = startDate.toLocaleDateString("en-US", { weekday: "long" });
                                const monthYear = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

                                return (
                                    <SwiperSlide key={index} className="lg:!w-[270px] md:!w-[270px] lg:pb-20 pb-10">
                                        <div className="relative p-6 bg-white shadow-lg rounded-2xl w-64 lg:mx-20 3xl:mx-48 mx-[4.5rem] h-80">
                                            <div className="absolute top-0 w-1 h-10 mt-6 bg-red-500 rounded-l-2xl"></div>
                                            <div className="flex items-center space-x-2">
                                                <span className="pl-2 text-4xl font-light text-gray-500">
                                                    {day}
                                                </span>
                                                <div className="text-sm text-gray-500">
                                                    <p className="text-xs font-light">{weekday}</p>
                                                    <p className="text-xs">{monthYear}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-center my-4">
                                                <Image src={calendar?.logo?.data?.attributes?.url ? `${baseUrl}${calendar?.logo?.data?.attributes.url}` : ""} alt={calendar?.title || "Event Logo"} width={120} height={80} objectFit="cover" />
                                            </div>
                                            <div className="absolute bottom-5">
                                                <Link href={`/exhibition-calendar/${calendarItem?.attributes?.slug}`}>
                                                    <h3 className="text-lg font-semibold text-gray-900 hover:text-red-500 hover:underline">{calendar?.title || "AI Jundi journal 2025"}</h3>
                                                </Link>
                                                <p className="text-sm text-gray-500">{calendar?.location}</p>
                                                <p className="mt-2 text-xs text-gray-600">{calendar?.category}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })
                        )}
                    </Swiper>
                </div>
            </section>

            <section className="pt-5 bg-white lg:pt-10">
                <div className="grid gap-4 mx-16 lg:grid-cols-3 md:grid-cols-3 lg:mx-40 3xl:mx-72">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Month:</label>
                        <select className="p-2 text-black bg-gray-100 border border-gray-300 rounded-md" onChange={(e) => setSelectedMonth(e.target.value)} >
                            <option value="">All Months</option>
                            {months.map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Year:</label>
                        <select className="p-2 text-black bg-gray-100 border border-gray-300 rounded-md" onChange={(e) => setSelectedYear(e.target.value)} >
                            <option value="">All Years</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="pb-5 bg-white lg:pb-10">
                <div>
                    <div className="w-full max-w-[75rem] 3xl:max-w-[83rem] lg:mx-auto lg:py-20 hidden lg:block">
                        <Swiper slidesPerView={1} spaceBetween={20} pagination={{ clickable: true }} onSwiper={setSwiperInstance} onSlideChange={(swiper) => setCurrentPage(swiper.realIndex + 1)} modules={[Pagination, Navigation]} className="mySwiper" >
                            {Array.from({ length: Math.ceil(sortedCalendar.length / 9) }).map((_, slideIndex) => {
                                const chunk = sortedCalendar.slice(slideIndex * 9, slideIndex * 9 + 9);

                                return (
                                    <SwiperSlide key={slideIndex}>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" style={{ fontFamily: "Work Sans, sans-serif" }}>
                                            {chunk.map((item: CalendarItem, index: number) => {
                                                const event = item.attributes.CalenCrd;
                                                const slug = item.attributes.slug;

                                                return (
                                                    <div key={index} className="p-4 bg-white border rounded-lg shadow-lg">
                                                        <div className="grid lg:grid-cols-4">
                                                            <div className="lg:col-span-3">
                                                                <p className="text-sm font-normal text-gray-500">
                                                                    {new Date(event.startDate).toLocaleDateString()}
                                                                </p>
                                                                <Link href={`/exhibition-calendar/${slug}`}>
                                                                    <h2 className="text-lg font-bold text-black hover:text-red-500">
                                                                        {event.title}
                                                                    </h2>
                                                                </Link>
                                                                <p className="text-sm font-normal text-gray-900 lg:py-4">{event.location}</p>
                                                                <p className="mt-2 text-sm font-normal text-gray-500">{event.category}</p>
                                                            </div>
                                                            <div className="flex justify-center mt-4 lg:justify-end lg:col-span-1">
                                                                <Image src={event.logo?.data?.attributes?.url ? `${baseUrl}${event.logo.data.attributes.url}` : "/images/default-logo.png"}
                                                                    alt="Event Logo" width={80} height={40} layout="intrinsic" objectFit="contain" className="w-auto h-auto max-w-full max-h-[40px] lg:max-h-[50px]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <div className="flex items-center justify-between">
                            <button ref={prevRef} className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-900 hover:text-white">
                                Previous
                            </button>
                            <span className="font-semibold text-gray-700">
                                {currentPage} of {totalPages} pages
                            </span>
                            <button ref={nextRef} className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-900 hover:text-white">
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Mobile Swiper */}
                    <div className="block max-w-5xl p-4 py-16 mx-10 lg:w-full lg:hidden">
                        <Swiper slidesPerView={1} spaceBetween={20} pagination={{ clickable: true }} modules={[Pagination]} className="mySwiper" >
                            {sortedCalendar.map((item: CalendarItem, index: number) => {
                                const event = item.attributes.CalenCrd;
                                const slug = item.attributes.slug;

                                return (
                                    <SwiperSlide key={index}>
                                        <div className="max-w-md p-4 mx-auto bg-white border rounded-lg shadow-lg">
                                            <p className="text-sm text-gray-500">
                                                {new Date(event.startDate).toLocaleDateString()}
                                            </p>
                                            <Link href={`/exhibition-calendar/${slug}`}>
                                                <h2 className="text-lg font-bold text-black hover:text-red-500">{event.title}</h2>
                                            </Link>
                                            <p className="text-sm text-gray-700">{event.location}</p>
                                            <p className="mt-2 text-sm text-gray-500">{event.category}</p>
                                            <div className="flex justify-end mt-4">
                                                <Image src={event.logo?.data?.attributes?.url ? `${baseUrl}${event.logo.data.attributes.url}` : "/images/default-logo.png"} alt="Event Logo" width={100} height={64} className="object-contain w-auto h-16" />
                                                {/* <img src={event.logo?.data?.attributes?.url ? `${baseUrl}${event.logo.data.attributes.url}` : "/images/default-logo.png"} alt="Event Logo" className="w-auto h-16" /> */}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    )
}