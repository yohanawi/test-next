import ContactForm from "@/components/Contactform";
import TeamSection from "@/components/TeamSection";
import Image from "next/image";
import Link from "next/link";

import type { AboutData, ServiceItem } from "@/types/about";
import AboutCounters from "./AboutCounters";

export type AboutClientProps = { aboutData: AboutData };

export default function AboutClient({ aboutData }: AboutClientProps) {
    
    const sanitizeHtml = (html: string) => { return html?.replace(/font-family:[^;"]*;?/gi, ""); };
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const serviceSec = aboutData?.serviceSec || {};
    const missionSec = aboutData?.missionSec || {};
    const missionCard = missionSec?.missionCard || {};
    const visionCard = missionSec?.VissionCard || {};
    const services = serviceSec?.serviceCrd || [];
    const sectionImageUrl = aboutData?.SecImage2?.data?.attributes?.url ? `${baseUrl}${aboutData.SecImage2.data.attributes.url}` : "/images/About_banner.png";
    const counters = aboutData?.CounterSec?.listCount || [];

    return (
        <>

            <section className="absolute w-full lg:h-[400px] 3xl:h-[500px] h-[350px] md:h-[500px] flex items-center text-center justify-center z-50">
                <div className="block lg:hidden">
                    <Image src={sectionImageUrl} layout="fill" objectFit="cover" alt="Banner" objectPosition="bottom" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#5a5a5a] via-[#5a5a5a] to-transparent opacity-70"></div>
                <div className="absolute lg:mt-20 mt-7 md:-mt-20">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {aboutData?.HeroSec?.title || "About Us"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/about-us" className="px-4 uppercase">About US</Link>
                    </div>
                </div>
            </section>

            <section className="w-full lg:h-[690px] h-[350px] md:h-[300px] 3xl:h-[900px]">
                <div className="hidden w-full h-full lg:block">
                    <Image src={sectionImageUrl} layout="fill" objectFit="cover" alt="Banner" objectPosition="bottom" />
                </div>
            </section>

            <AboutCounters counters={counters} />

            <section className="bg-[#f6f6f6]">
                <div className="py-5 md:py-5 lg:py-0">
                    <div className="flex mx-auto justify-center max-w-[300px] md:max-w-[350px] lg:max-w-[700px]">
                        <h2 className="lg:text-5xl md:text-2xl text-xl text-[#17171B] font-sans font-bold text-center"
                            dangerouslySetInnerHTML={{ __html: missionSec.title || "Our Story of Innovation", }}>
                        </h2>
                    </div>
                    <div className="flex justify-center pt-5 mx-12 lg:mx-52 md:mx-32 lg:pt-10">
                        <p className="lg:text-xl md:text-[16px] text-sm text-black lg:mx-20 3xl:mx-44 font-normal text-center" style={{ fontFamily: "Sora, sans-serif" }} >
                            {missionSec.sub_description}
                        </p>
                    </div>
                    <div className="text-[#797979] text-center mx-12 md:mx-24 lg:mx-20 tracking-normal 3xl:mx-56" style={{ fontFamily: "Sora, sans-serif" }} >
                        <p className="3xl:pt-10 lg:pt-5 md:pt-6 pt-4 text-sm lg:text-[15px] md:text-[14px] 3xl:text-base"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(missionSec.main_description || ""), }} >
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#d8dde0]">
                <div className="container px-12 py-10 mx-auto lg:py-20 md:py-16 lg:ms-0 3xl:ms-40 md:px-20">
                    <div className="flex flex-col justify-center gap-6 transition-all duration-500 lg:flex-row ">
                        {[missionCard, visionCard].map((card, index) => {
                            const imageUrl = card?.image?.data?.attributes?.url ? `${baseUrl}${card.image.data.attributes.url}` : "/images/About_banner.png";
                            const IconUrl = card.icon?.data?.attributes?.url ? `${baseUrl}${card.icon.data.attributes.url}` : "/images/About_banner.png";
                            return (
                                <div key={index} className={`group relative ${index === 0 ? "bg-[#b82229]" : "bg-[#29292a]"} text-white md:h-[300px] h-[300px] 3xl:h-[280px] rounded-lg overflow-hidden 3xl:pt-24 lg:pt-28 lg:ps-8 ps-6 transition-all duration-500 lg:w-[400px] md:w-[600px] w-[300px] hover:lg:w-[800px] flex-shrink-0`} >
                                    <div className="absolute top-0 right-0 w-[150px] md:w-[200px] md:h-[150px] overflow-hidden rounded-bl-full">
                                        <Image src={imageUrl} alt={card.title || "Card image"} fill className="object-cover w-full h-full rounded-bl-full" />
                                    </div>
                                    <div className="transition-all duration-300 group-hover:lg:-translate-y-44 group-hover:3xl:-translate-y-44 group-hover:md:-translate-y-48 group-hover:-translate-y-48">
                                        <div className="relative flex items-center mt-56 space-x-2 lg:space-x-3 md:mt-56 lg:mt-28">
                                            <Image src={IconUrl} alt="icon" width={32} height={32} className="w-5 lg:w-8 md:w-7" />
                                            <h3 className="font-normal lg:text-2xl md:text-xl">{card.title}</h3>
                                        </div>
                                        <hr className="w-32 pb-3 mt-2 border-white lg:pb-0 lg:w-48" />
                                    </div>
                                    <div className="opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 group-hover:lg:-translate-y-44 group-hover:-translate-y-52 group-hover:md:-translate-y-52 text-xs md:text-base lg:text-base transition-all duration-500 mt-4 lg:w-[550px] md:w-[380px] w-[170px] group-hover:3xl:-translate-y-[10.5rem]" >
                                        <p>{card.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div>
                    <div className="bg-[#313131]">
                        <div className="pt-10 mx-16 font-sans 3xl:mx-60 lg:mx-40 md:mx-32 lg:pt-20 lg:pb-10 pb-7">
                            <h2 className="font-sans text-2xl font-light text-white lg:text-5xl md:text-3xl">{serviceSec?.title || "What We Do"}</h2>
                            <span className="text-sm text-white 3xl:text-base" style={{ fontFamily: "Work Sans, sans-serif" }} >
                                {serviceSec?.description || "Our services help you succeed."}
                            </span>
                        </div>
                        <div className="grid gap-6 pb-10 mx-16 lg:grid-cols-3 md:grid-cols-2 lg:gap-14 lg:mx-40 md:mx-32 3xl:mx-60 md:pb-16 lg:pb-20" style={{ fontFamily: "Work Sans, sans-serif" }} >
                            {services.map((service: ServiceItem, index: number) => (
                                <div key={index}>
                                    <h3 className="pb-2 text-white uppercase lg:pb-5 md:pb-5 3xl:text-lg">{service.name}</h3>
                                    <p className="text-xs text-white lg:text-sm 3xl:text-base">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <TeamSection />
            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}