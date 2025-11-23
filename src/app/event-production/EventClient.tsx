import ContactForm from "@/components/Contactform";
import Image from "next/image";
import Link from "next/link";

type EventSection = {
    SectionImg?: {
        data?: {
            attributes?: {
                url?: string;
                alternativeText?: string;
            };
        };
    };
    HeadTitle?: string;
    HeadTitleLink?: string;
    HeadDesc?: string;
    SubTitle?: string;
    SubDesc?: string;
};

export default function EventClient({ eventProduction }: { eventProduction: any }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const heroSec = eventProduction?.HeroSec || {};
    const secndSec = eventProduction?.SecndSec || {};
    const eventSections = eventProduction?.EventSections || [];

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={heroSec?.bgImage?.data?.attributes?.url ? `${baseUrl}${heroSec.bgImage.data.attributes.url}` : "/images/Banner.jpg"} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {heroSec?.title || "Events Production in Dubai"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/event-production" className="px-4 uppercase">event production</Link>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center px-8 py-8 bg-white lg:py-12 md:py-14 3xl:py-16">
                <div className="mx-5 lg:mx-36 md:mx-20 3xl:mx-64">
                    <div className="container mx-auto">
                        <div className="grid items-center grid-cols-1 lg:grid-cols-2 lg:gap-8">
                            <div>
                                <h2 className="text-2xl font-normal text-black uppercase md:text-3xl lg:text-5xl">
                                    {secndSec?.title || "XESS! SERVICES EVENT PRODUCTION"}
                                </h2>
                                <div className="lg:py-8 md:py-2 text-sm 3xl:text-base text-[#3E444A]">
                                    <p dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(secndSec.description || ""),
                                    }}>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative lg:w-[90%] lg:h-[450px] w-full h-[200px] md:w-full md:h-[400px] flex justify-center">
                                    <Image src="/images/stages.png" layout="fill" objectFit="cover" alt="Exhibition 1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                {eventSections.map((section: EventSection, index: number) => (
                    <div key={index} className={`grid lg:grid-cols-2 ${index % 2 === 0 ? "bg-[#d8dde0] 3xl:-ms-20 lg:-ms-10" : "bg-white py-10"} lg:px-36 md:px-24 px-5 3xl:px-64`} >
                        <div className={`flex justify-center 3xl:justify-end items-center 3xl:pr-5  ${index % 2 === 0 ? "" : "lg:order-1"}`}>
                            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] 3xl:w-[600px]">
                                <Image src={section?.SectionImg?.data?.attributes?.url ? `${baseUrl}${section.SectionImg.data.attributes.url}` : ""} layout="fill" objectFit="cover" alt={section?.SectionImg?.data?.attributes?.alternativeText || "Event Section Image"} />
                            </div>
                        </div>
                        <div className="p-8">
                            {section?.HeadTitleLink ? (
                                <Link href={section.HeadTitleLink}>
                                    <h2 className="text-xl 3xl:text-2xl font-semibold uppercase text-[#EA2127] hover:underline">
                                        {section?.HeadTitle || "Event Title"}
                                    </h2>
                                </Link>
                            ) : (
                                <h2 className="text-xl 3xl:text-2xl font-semibold uppercase text-[#EA2127]">
                                    {section?.HeadTitle || "Event Title"}
                                </h2>
                            )}
                            <p className="mt-4 text-sm text-black 3xl:text-base">
                                {section?.HeadDesc || "Description not available"}
                            </p>

                            <h2 className="mt-6 text-xl font-semibold text-black uppercase 3xl:text-2xl">
                                {section?.SubTitle || "Sub Title"}
                            </h2>
                            <p className="mt-4 text-sm text-black 3xl:text-base">
                                {section?.SubDesc || "Sub Description not available"}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}