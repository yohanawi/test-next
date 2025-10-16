"use client";

import { GET_CALENDAR_DETAIL } from "@/lib/queries";
import ContactForm from "@/components/Contactform";
import { NavigationIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

export default function CalendarDetails() {

    const params = useParams();
    const SingleCalendar = params?.SingleCalendar;
    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_CALENDAR_DETAIL, { variables: { slug: SingleCalendar, locale }, skip: !SingleCalendar, });
    const calendarDetail = data?.calenDetails?.data?.[0]?.attributes || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

    const formatDateRange = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
        const endFormatted = endDate.toLocaleDateString('en-GB', options); // "Apr 2025"
        return `${startDay} - ${endDay} ${endFormatted}`;
    };

    const ratingMap: Record<string, number> = {
        worst: 1,
        bad: 2,
        normal: 3,
        good: 4,
        excellent: 5,
    };
    const ratingLabel = calendarDetail?.CalenCrd?.rating?.toLowerCase();
    const ratingValue = ratingLabel ? ratingMap[ratingLabel] : null;

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={calendarDetail?.HeroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${calendarDetail.HeroSec.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-black opacity-70"></div>
            </section>

            <section className="relative bg-white">
                <div className="max-w-5xl p-4 mx-auto">
                    <div className="flex flex-col items-center justify-between gap-6 p-6 bg-white shadow-lg rounded-xl md:flex-row lg:-mt-24">
                        <div className="flex items-start w-full gap-4 md:w-2/3">
                            <Image src={calendarDetail?.CalenCrd?.logo?.data?.attributes?.url ? `${baseUrl}${calendarDetail.CalenCrd.logo.data.attributes.url}` : "/images/Footer_logo.png"} alt="AI Journal Logo" className="object-contain w-16 h-16" width={64} height={64} />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    {calendarDetail?.CalenCrd?.Lebel?.map((label: { name: string }, index: number) => (
                                        <span key={index} className="px-2 py-1 text-xs text-white bg-green-600 rounded-md">
                                            {label.name}
                                        </span>
                                    ))}
                                    {calendarDetail?.CalenCrd?.Featured && (
                                        <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-md">Featured</span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-red-600">
                                    {calendarDetail?.CalenCrd?.startDate && calendarDetail?.CalenCrd?.endDate && formatDateRange(calendarDetail.CalenCrd.startDate, calendarDetail.CalenCrd.endDate)}
                                </p>

                                <Link href={calendarDetail?.Link || "#"} target="_blank" rel="noopener noreferrer">
                                    <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:underline">
                                        {calendarDetail?.CalenCrd?.title || "AI Jundi journal 2025"}
                                    </h1>
                                </Link>
                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                    {ratingValue && (
                                        <span className="flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor" >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                                            </svg> {ratingValue}({ratingValue} Ratings)
                                        </span>
                                    )}
                                    <span className="mx-2">•</span>
                                    <span>{calendarDetail?.CalenCrd?.category || "Conference"}</span>
                                </div>
                                <div className="items-center mt-1 text-sm text-gray-600 md:flex">
                                    <span className="text-orange-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
                                        </svg>
                                    </span>
                                    <span className="ml-1">{calendarDetail?.CalenCrd?.location || "Dubai World Centre"}</span>
                                    {calendarDetail?.CalenCrd?.map && (
                                        <Link href={calendarDetail.CalenCrd.map} className="flex ml-4 text-xs text-blue-600 hover:underline">Get Directions <NavigationIcon className="w-4 h-4" /></Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full text-center md:w-auto">
                            <Link href="/free-design">
                                <button className="px-6 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md md:text-base hover:bg-gray-700">
                                    Request a Booth
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white ">
                <div className="max-w-5xl px-10 py-8 mx-auto lg:px-4">
                    <h2 className="mb-4 text-2xl font-bold text-black">About</h2>
                    <p className="mb-2 font-semibold text-black">{calendarDetail?.topic}</p>
                    <p className="mb-6 text-gray-700" dangerouslySetInnerHTML={{ __html: calendarDetail?.description }}>
                    </p>

                    <div className="p-4 mb-6 bg-gray-100 rounded-md">
                        <h3 className="mb-2 font-semibold text-black">Highlights</h3>
                        <ul className="space-y-1 text-gray-800 list-disc list-inside">
                            {calendarDetail?.Highlight?.lists?.map((item: { text: string }, index: number) => (
                                <li key={index}>{item.text}</li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {calendarDetail?.Highlight?.HighLable?.map((label: { name: string }, index: number) => (
                                <span key={index} className="px-3 py-1 text-sm text-black bg-gray-200 rounded-md">{label.name}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-black">Listed In</h3>
                        <div className="flex flex-wrap gap-2">
                            {calendarDetail?.Listed?.map((tag: { name: string }, index: number) => (
                                <span key={index} className="px-3 py-1 text-sm text-black bg-gray-100 rounded-md">#{tag.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}