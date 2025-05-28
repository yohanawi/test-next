"use client";

import ContactForm from "@/components/Contactform";
import { GET_RECENT_CLIENT_DATA } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function RecentClients() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const { data } = useQuery(GET_RECENT_CLIENT_DATA, { variables: { locale }, });
    const mainClients = data?.clientsPage?.data?.attributes || {};
    const { ClientsHead } = mainClients;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = ClientsHead?.image?.data?.attributes?.url ? `${baseUrl}${ClientsHead.image.data.attributes.url}` : "/images/Banner.jpg";
    const clientList = data?.clientsPage?.data?.attributes?.RecentClients?.ClientList || [];

    const defaultClients = [
        "/images/client1.png",
        "/images/client2.png",
        "/images/client3.png",
        "/images/client4.png",
        "/images/client5.png",
        "/images/client6.png",
        "/images/client7.png",
        "/images/client8.png",
    ];

    const clients = clientList.length > 0 ? clientList.map((client: { image: { data: { attributes: { url: string; }; }; }; }) => client.image?.data?.attributes?.url ? `${baseUrl}${client.image.data.attributes.url}` : "/images/default.png") : defaultClients;
    const [visibleClients, setVisibleClients] = useState(8);
    const showMoreClients = () => {
        setVisibleClients(clients.length);
    };

    const portfolioImages = [
        { src: mainClients?.ClientProt?.image1?.data?.attributes?.url ? `${baseUrl}${mainClients.ClientProt.image1.data.attributes.url}` : "/images/portfolio1.png" },
        { src: mainClients?.ClientProt?.image2?.data?.attributes?.url ? `${baseUrl}${mainClients.ClientProt.image2.data.attributes.url}` : "/images/portfolio2.png" },
        { src: mainClients?.ClientProt?.image3?.data?.attributes?.url ? `${baseUrl}${mainClients.ClientProt.image3.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainClients?.ClientProt?.image4?.data?.attributes?.url ? `${baseUrl}${mainClients.ClientProt.image4.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainClients?.ClientProt?.image5?.data?.attributes?.url ? `${baseUrl}${mainClients.ClientProt.image5.data.attributes.url}` : "/images/portfolio3.png" },
        { src: mainClients?.ClientProt?.image6?.data?.attributes?.url ? `${baseUrl}${mainClients.ClientProt.image6.data.attributes.url}` : "/images/portfolio3.png" },
    ];

    return (

        <>

            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">{ClientsHead?.heading || "recent clients"}</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={ClientsHead?.breadcrumb?.link1 || "/"} className="px-4 uppercase">{ClientsHead?.breadcrumb?.SubHead1 || "Home"}</Link>
                        /
                        <Link href={ClientsHead?.breadcrumb?.link2 || "/recent-clients"} className="px-4 uppercase">{ClientsHead?.breadcrumb?.SubHead2 || "recent clients"}</Link>
                    </div>
                </div>
            </section>

            <section className="py-5 text-center bg-white lg:py-12 md:py-8">
                <div className="container px-6 mx-auto">
                    <h2 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20">{mainClients?.Heading || "GET YOUR OWN"}</h2>
                    <p className="text-xl text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        {mainClients?.SubHeading || "CUSTOM EXHIBITION STAND Builders"}
                    </p>
                    <div className=" lg:mx-44 md:mx-20 3xl:mx-[6rem] mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base" dangerouslySetInnerHTML={{ __html: mainClients?.description }}></p>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] md:py-10 py-5 lg:py-12 3xl:py-20">
                <div className="text-center lg:px-60 3xl:px-80 lg:text-left">
                    <h2 className="uppercase text-[#EA2127] text-xl md:text-3xl lg:text-4xl">
                        {mainClients?.RecentClients?.heading || "Our Recent Clients"}
                    </h2>
                    <p className="text-black uppercase">{mainClients?.RecentClients?.SubHeading || "Our Recent Clients"}</p>
                </div>

                <div className="grid grid-cols-2 gap-5 px-10 pt-10 md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-10 md:px-36 lg:px-60 3xl:px-80">
                    {clients.slice(0, visibleClients).map((client: string, index: number) => (
                        <div key={index} className="flex items-center justify-center p-8 bg-white rounded-md shadow-md md:w-60 md:h-56">
                            <Image src={client} width={150} height={150} alt={`Client ${index + 1}`} className="object-contain" />
                        </div>
                    ))}
                </div>
                {visibleClients < clients.length && (
                    <div className="flex justify-center">
                        <button className="pt-10 flex flex-col items-center uppercase text-center text-[#E21F2C] text-xs font-sans font-normal lg:px-6 px-4 py-2 rounded-md hover:text-black transition" onClick={showMoreClients}>
                            Show More
                            <ChevronDown size={16} />
                        </button>
                    </div>
                )}
            </section>

            <section className="py-5 bg-white md:py-10">
                <div className="mx-20 text-center md:mx-0">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">{mainClients?.ClientProt?.title || "Take a look at some of our work"}</h2>
                    <span className="text-[#E42D39] text-xs md:text-base">{mainClients?.ClientProt?.SubTitle || "Lorem Ipsum is simply dummy text of the printing"}</span>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 lg:pt-10 lg:pb-5 md:pb-8 pb-10 pt-10 lg:mx-60 mx-8 md:mx-40 3xl:mx-[18rem]">
                    {portfolioImages.map((item, index) => (
                        <div key={index} className="relative w-full h-[18rem] md:h-[14rem] lg:h-[20rem] group overflow-hidden">
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href={mainClients?.ClientProt?.button?.link || "/portfolio"} className=" uppercase border border-[#E21F2C] text-[#E21F2C] text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all">
                        {mainClients?.ClientProt?.button?.label || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}