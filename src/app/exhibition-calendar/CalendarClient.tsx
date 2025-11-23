"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ContactForm from "@/components/Contactform";

export type EventItem = {
    attributes: {
        slug: string;
        CalenCrd: {
            startDate: string;
            is_popular?: boolean;
            title?: string;
            location?: string;
            category?: string;
            logo?: { data?: { attributes?: { url?: string } } };
        };
    };
};

export type CalendarItem = EventItem;

type Props = {
    calendarData: any;
    heroSection: any;
    allCalendar: CalendarItem[];
    locale: string;
    baseUrl: string;
};

export default function CalendarClient({ calendarData, heroSection, allCalendar, locale, baseUrl }: Props) {
    // Keep original UI and behavior but move all data-driven logic to client where required
    const [selectedFilter, setSelectedFilter] = useState("This Year");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const filters = ["All", "This Month", "Next Month", "Last Month", "This Year"];

    // derive months and years
    const [months] = useState<string[]>(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    const [years] = useState<number[]>(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    });

    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Extract unique categories and locations from all calendar data
    const categories = useMemo(() => {
        const uniqueCategories = new Set<string>();
        allCalendar.forEach((item: CalendarItem) => {
            if (item.attributes.CalenCrd.category) {
                uniqueCategories.add(item.attributes.CalenCrd.category);
            }
        });
        return Array.from(uniqueCategories).sort();
    }, [allCalendar]);

    const locations = useMemo(() => {
        const uniqueLocations = new Set<string>();
        allCalendar.forEach((item: CalendarItem) => {
            if (item.attributes.CalenCrd.location) {
                uniqueLocations.add(item.attributes.CalenCrd.location);
            }
        });
        return Array.from(uniqueLocations).sort();
    }, [allCalendar]);

    // Clear all filters function
    const clearAllFilters = () => {
        setSelectedMonth("");
        setSelectedYear("");
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedLocation("");
    };

    // Filter calendar for grid + mobile lists with search and all filters
    const filteredCalendar = useMemo(() => {
        return allCalendar.filter((item: CalendarItem) => {
            const startDate = new Date(item.attributes.CalenCrd.startDate);
            if (isNaN(startDate.getTime())) return false;

            // Month filter
            const matchesMonth = selectedMonth ? startDate.getMonth() + 1 === Number(selectedMonth) : true;

            // Year filter
            const matchesYear = selectedYear ? startDate.getFullYear() === Number(selectedYear) : true;

            // Search filter (searches in title, location, and category)
            const matchesSearch = searchQuery ? (
                item.attributes.CalenCrd.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.attributes.CalenCrd.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.attributes.CalenCrd.category?.toLowerCase().includes(searchQuery.toLowerCase())
            ) : true;

            // Category filter
            const matchesCategory = selectedCategory ? item.attributes.CalenCrd.category === selectedCategory : true;

            // Location filter
            const matchesLocation = selectedLocation ? item.attributes.CalenCrd.location === selectedLocation : true;

            return matchesMonth && matchesYear && matchesSearch && matchesCategory && matchesLocation;
        });
    }, [allCalendar, selectedMonth, selectedYear, searchQuery, selectedCategory, selectedLocation]);

    // Popular events (client side filtering + improved "This Year" behavior to include future years)
    const filteredPopularEvents = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const startOfMonth = new Date(year, now.getMonth(), 1);
        const endOfMonth = new Date(year, now.getMonth() + 1, 0);
        const startOfNextMonth = new Date(year, now.getMonth() + 1, 1);
        const endOfNextMonth = new Date(year, now.getMonth() + 2, 0);
        const startOfLastMonth = new Date(year, now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(year, now.getMonth(), 0);
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31);

        const isValidDate = (d: Date) => !isNaN(d.getTime());

        return allCalendar.filter((event: EventItem) => {
            const card = event.attributes.CalenCrd;
            if (!card?.startDate) return false;
            const startDate = new Date(card.startDate);
            if (!isValidDate(startDate)) return false;

            if (!card.is_popular) return false;

            switch (selectedFilter) {
                case "All":
                    return true;
                case "This Month":
                    return startDate >= startOfMonth && startDate <= endOfMonth;
                case "Next Month":
                    return startDate >= startOfNextMonth && startDate <= endOfNextMonth;
                case "Last Month":
                    return startDate >= startOfLastMonth && startDate <= endOfLastMonth;
                case "This Year":
                    // include events in this year and any future years
                    return startDate.getFullYear() >= year;
                default:
                    return true;
            }
        });
    }, [allCalendar, selectedFilter]);

    // Sort popular events: upcoming first (soonest date), then recent past
    const sortedPopularEvents = useMemo(() => {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        return [...filteredPopularEvents].sort((a, b) => {
            const dateA = new Date(a.attributes.CalenCrd.startDate);
            const dateB = new Date(b.attributes.CalenCrd.startDate);
            const aUpcoming = dateA >= todayMidnight;
            const bUpcoming = dateB >= todayMidnight;

            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;

            if (aUpcoming && bUpcoming) return dateA.getTime() - dateB.getTime();
            return dateB.getTime() - dateA.getTime();
        });
    }, [filteredPopularEvents]);

    // Sort grid calendar: upcoming first, earliest first
    const sortedCalendar = useMemo(() => {
        const now = new Date();
        return [...filteredCalendar].sort((a: CalendarItem, b: CalendarItem) => {
            const dateA = new Date(a.attributes.CalenCrd.startDate);
            const dateB = new Date(b.attributes.CalenCrd.startDate);

            const aFuture = dateA >= now;
            const bFuture = dateB >= now;
            if (aFuture && !bFuture) return -1;
            if (!aFuture && bFuture) return 1;

            return dateA.getTime() - dateB.getTime();
        });
    }, [filteredCalendar]);

    // Swiper refs + pagination state
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const totalPages = Math.max(1, Math.ceil(sortedCalendar.length / 9));

    useEffect(() => {
        if (swiperInstance && swiperInstance.params.navigation && typeof swiperInstance.params.navigation === "object" && prevRef.current && nextRef.current) {
            const navigation = swiperInstance.params.navigation as any;
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
            swiperInstance.navigation?.destroy?.();
            swiperInstance.navigation?.init?.();
            swiperInstance.navigation?.update?.();
        }
    }, [swiperInstance]);

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={heroSection?.bgImage?.data?.attributes?.url ? `${baseUrl}${heroSection.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
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
                            <h2 className="font-sans text-lg font-normal text-gray-800 lg:text-3xl">Popular Events</h2>
                            <div className="relative" ref={dropdownRef}>
                                <button type="button" aria-haspopup="true" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 font-sans text-xs text-gray-500 transition-all border border-gray-300 rounded-md lg:text-sm hover:text-gray-900 hover:border-gray-900">
                                    {selectedFilter} ▼
                                </button>
                                {isOpen && (
                                    <div role="menu" aria-label="Filter events" className="absolute z-10 w-40 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filters.map((filter) => (
                                            <button key={filter} role="menuitem" onClick={() => { setSelectedFilter(filter); setIsOpen(false); }} className="block w-full px-4 py-2 text-sm text-left text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 } }} navigation pagination={{ clickable: true }} className="lg:mx-40">
                        {sortedPopularEvents.length === 0 ? (
                            <div className="p-6">No popular events found.</div>
                        ) : (
                            sortedPopularEvents.map((calendarItem: EventItem, index: number) => {
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
                                                <span className="pl-2 text-4xl font-light text-gray-500">{day}</span>
                                                <div className="text-sm text-gray-500">
                                                    <p className="text-xs font-light">{weekday}</p>
                                                    <p className="text-xs">{monthYear}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-center my-4">
                                                <Image src={calendar?.logo?.data?.attributes?.url ? `${baseUrl}${calendar?.logo?.data?.attributes.url}` : ""} alt={calendar?.title || "Event Logo"} width={120} height={80} style={{ objectFit: "cover" }} />
                                            </div>
                                            <div className="absolute bottom-5">
                                                <Link href={`/exhibition-calendar/${calendarItem?.attributes?.slug}`}>
                                                    <h3 className="text-lg font-semibold text-gray-900 hover:text-red-500 hover:underline">{calendar?.title || "Event"}</h3>
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

            <section className="pt-10 pb-5 bg-gradient-to-b from-gray-50 to-white lg:pt-16">
                <div className="px-4 mx-auto max-w-7xl">
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-gray-800 lg:text-3xl">Find Your Event</h2>
                        <p className="text-sm text-gray-600 lg:text-base">Search and filter through our extensive exhibition calendar</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search by event name, location, or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 text-gray-700 transition-all duration-300 bg-white border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-red-500 focus:shadow-lg"
                            />
                            <svg
                                className="absolute w-6 h-6 text-gray-400 transform -translate-y-1/2 right-6 top-1/2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl lg:p-8">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Month Filter */}
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">
                                    <svg className="inline w-4 h-4 mr-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Month
                                </label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full px-4 py-3 text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400 sm:w-auto"
                                    aria-label="Filter by month"
                                >
                                    <option value="">All Months</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={index + 1}>{month}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Filter */}
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">
                                    <svg className="inline w-4 h-4 mr-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Year
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-4 py-3 text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400"
                                >
                                    <option value="">All Years</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">
                                    <svg className="inline w-4 h-4 mr-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-semibold text-gray-700">
                                    <svg className="inline w-4 h-4 mr-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Location
                                </label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-4 py-3 text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400"
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">{filteredCalendar.length}</span> events found
                            </div>
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 active:scale-95"
                            >
                                <svg className="inline w-4 h-4 mr-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Tags */}
                    {(searchQuery || selectedMonth || selectedYear || selectedCategory || selectedLocation) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {searchQuery && (
                                <span className="inline-flex items-center px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery("")} className="ml-2 hover:text-red-900">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {selectedMonth && (
                                <span className="inline-flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                                    {months[Number(selectedMonth) - 1]}
                                    <button onClick={() => setSelectedMonth("")} className="ml-2 hover:text-blue-900">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {selectedYear && (
                                <span className="inline-flex items-center px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                                    {selectedYear}
                                    <button onClick={() => setSelectedYear("")} className="ml-2 hover:text-green-900">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="inline-flex items-center px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                                    {selectedCategory}
                                    <button onClick={() => setSelectedCategory("")} className="ml-2 hover:text-purple-900">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {selectedLocation && (
                                <span className="inline-flex items-center px-3 py-1 text-sm text-orange-700 bg-orange-100 rounded-full">
                                    {selectedLocation}
                                    <button onClick={() => setSelectedLocation("")} className="ml-2 hover:text-orange-900">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="pb-5 bg-white lg:pb-10">
                <div>
                    <div className="w-full max-w-[75rem] 3xl:max-w-[83rem] lg:mx-auto lg:py-20 hidden lg:block">
                        <Swiper slidesPerView={1} spaceBetween={20} pagination={{ clickable: true }} onSwiper={setSwiperInstance} onSlideChange={(swiper) => setCurrentPage(swiper.realIndex + 1)} modules={[Pagination, Navigation]} className="mySwiper">
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
                                                                <p className="text-sm font-normal text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                                                                <Link href={`/exhibition-calendar/${slug}`}>
                                                                    <h2 className="text-lg font-bold text-black hover:text-red-500">{event.title}</h2>
                                                                </Link>
                                                                <p className="text-sm font-normal text-gray-900 lg:py-4">{event.location}</p>
                                                                <p className="mt-2 text-sm font-normal text-gray-500">{event.category}</p>
                                                            </div>
                                                            <div className="flex justify-center mt-4 lg:justify-end lg:col-span-1">
                                                                <Image src={event.logo?.data?.attributes?.url ? `${baseUrl}${event.logo.data.attributes.url}` : "/images/default-logo.png"} alt="Event Logo" width={80} height={40} style={{ objectFit: "contain" }} />
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
                            <button ref={prevRef} className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-900 hover:text-white">Previous</button>
                            <span className="font-semibold text-gray-700">{currentPage} of {totalPages} pages</span>
                            <button ref={nextRef} className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-900 hover:text-white">Next</button>
                        </div>
                    </div>

                    {/* Mobile Swiper */}
                    <div className="block max-w-5xl p-4 py-16 mx-10 lg:w-full lg:hidden">
                        <Swiper slidesPerView={1} spaceBetween={20} pagination={{ clickable: true }} modules={[Pagination]} className="mySwiper">
                            {sortedCalendar.map((item: CalendarItem, index: number) => {
                                const event = item.attributes.CalenCrd;
                                const slug = item.attributes.slug;

                                return (
                                    <SwiperSlide key={index}>
                                        <div className="max-w-md p-4 mx-auto bg-white border rounded-lg shadow-lg">
                                            <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                                            <Link href={`/exhibition-calendar/${slug}`}>
                                                <h2 className="text-lg font-bold text-black hover:text-red-500">{event.title}</h2>
                                            </Link>
                                            <p className="text-sm text-gray-700">{event.location}</p>
                                            <p className="mt-2 text-sm text-gray-500">{event.category}</p>
                                            <div className="flex justify-end mt-4">
                                                <Image src={event.logo?.data?.attributes?.url ? `${baseUrl}${event.logo.data.attributes.url}` : "/images/default-logo.png"} alt="Event Logo" width={100} height={64} style={{ objectFit: "contain" }} />
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
    );
}
