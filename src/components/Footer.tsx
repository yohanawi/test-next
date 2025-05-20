import { FaFacebook, FaGooglePlus, FaInstagram, FaLinkedin, FaPinterest, FaSkype, FaTelegram, FaTiktok, FaTwitter, FaViber, FaYoutube, } from "react-icons/fa6";
import { GET_FOOTER_DATA, GET_PARTNER_DATA } from "@/lib/queries";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { JSX } from "react/jsx-runtime";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
    const dispatch = useDispatch();
    const { locale } = useSelector((state: RootState) => state.locale);
    const [locales, setLocales] = useState<any[]>([]);
    const { loading: footerLoading, error: footerError, data: footerData, } = useQuery(GET_FOOTER_DATA, { variables: { locale }, });
    const { loading: partnerLoading, error: partnerError, data: partnerData, } = useQuery(GET_PARTNER_DATA, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const partner = partnerData?.ourPartner?.data?.attributes || {};
    const partnerClients = partner?.patner || [];
    const mainFooter = footerData?.footer?.data?.attributes || {};
    const socialIconsMap: { [key: string]: JSX.Element } = {
        FaFacebook: <FaFacebook size={20} />,
        FaInstagram: <FaInstagram size={20} />,
        FaLinkedin: <FaLinkedin size={20} />,
        FaTwitter: <FaTwitter size={20} />,
        FaYoutube: <FaYoutube size={20} />,
        FaTiktok: <FaTiktok size={20} />,
        FaTelegram: <FaTelegram size={20} />,
        FaSkype: <FaSkype size={20} />,
        FaViber: <FaViber size={20} />,
        FaPinterest: <FaPinterest size={20} />,
        FaGooglePlus: <FaGooglePlus size={20} />,
    };

    return (
        <>
            <footer className="bg-[#d4d4d4] text-gray-700 font-sans">
                <div className=" hidden lg:block">
                    <div className="container mx-auto grid lg:grid-cols-12 lg:gap-28">
                        <div className="col-span-4 3xl:col-span-3 ms-4 lg:ms-40 3xl:ms-0 pt-10">
                            <div className="flex flex-col items-start text-left space-y-3 min-h-[300px]">
                                <div style={{ width: 191, height: 87 }}>
                                    <Image src="/images/Footer logo.png" width={191} height={87} alt="Footer Logo" quality={80} sizes="(max-width: 768px) 100vw, 191px" />
                                </div>
                                <div className="text-left flex flex-col pt-5">
                                    <div className="flex items-center justify-left gap-10 py-5">
                                        {mainFooter?.social?.map(
                                            (item: { icon: string; link: string }, index: number) => (
                                                <Link key={index} href={item.link || "#"} aria-label={item.icon} className="hover:text-[#e21f2c]" >
                                                    {socialIconsMap[item.icon] || null}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                    <Link href="https://maps.app.goo.gl/QdHJmr21RC4GPJya9" className="text-sm leading-relaxed hover:text-[#e21f2c]"
                                        dangerouslySetInnerHTML={{
                                            __html: mainFooter?.address || "Warehouse No 3, 20 a Street, Marabea Road Al Quoz 1, Dubai, UAE",
                                        }}
                                    ></Link>
                                    <Link href="tel:+971553721525" className="text-sm pt-5 hover:text-[#e21f2c]" >
                                        {mainFooter?.mobile_number || "+971 55 372 1525"}
                                    </Link>
                                    <Link href="mailto:info@xessevents.com" className="text-sm pt-5 hover:text-[#e21f2c]" >
                                        {mainFooter?.email || "info@xessevents.com"}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-8 3xl:col-span-9 grid mr-5">
                            <div className="flex flex-4 gap-10 justify-between pt-14 pb-12">
                                <div>
                                    <Link href="/about-us">
                                        <h3 className="text-[22px] hover:text-[#e21f2c]">
                                            {mainFooter?.footerA?.title || "About"}
                                        </h3>
                                    </Link>
                                    <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                        {mainFooter?.footerA?.subList?.map(
                                            (item: { link: any; name: any }, index: any) => (
                                                <li key={index} className="py-0.5">
                                                    <Link href={item.link || "#"} className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]" >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <Link href="/services">
                                        <h3 className="text-[22px] hover:text-[#e21f2c]">
                                            {mainFooter?.footerS?.title || "Services"}
                                        </h3>
                                    </Link>
                                    <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                        {mainFooter?.footerS?.subList?.map(
                                            (item: { link: any; name: any }, index: any) => (
                                                <li key={index} className="py-0.5">
                                                    <Link href={item.link || "#"} className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]" >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <Link href="/#">
                                        <h3 className="text-[22px] hover:text-[#e21f2c]">
                                            {mainFooter?.footerP?.title || "Partners"}
                                        </h3>
                                    </Link>
                                    <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                        {mainFooter?.footerP?.subList?.map(
                                            (item: { link: any; name: any }, index: any) => (
                                                <li key={index} className="py-0.5">
                                                    <Link href={item.link || "#"} target="_blank" rel="noopener noreferrer" className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]" >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div className="min-h-[200px]">
                                    <Link href="/top-city">
                                        <h3 className="text-[22px] hover:text-[#e21f2c]">
                                            {mainFooter?.footerCty?.title || "Top Destinations"}
                                        </h3>
                                    </Link>
                                    <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                        {mainFooter?.footerCty?.subList?.map(
                                            (item: { link: any; name: any }, index: any) => (
                                                <li key={index} className="py-0.5 w-48">
                                                    <Link href={item.link || "#"} className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]" >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 px-20 pb-8 gap-20">
                        <div className="col-span-2 pt-10">
                            <h2 className="text-[24px] md:text-[20px] text-left mb-2 font-normal font-sans text-[#17171B] px-20">
                                {partner?.title}
                            </h2>
                            <div className="flex ms-[4rem]">
                                {partnerClients.map((client: any, index: number) => {
                                    const imageUrl = client.image?.data?.attributes?.url ? `${baseUrl}${client.image.data.attributes.url}` : "/images/Design1.png";
                                    const altText = client.name || "Partner Logo";

                                    return (
                                        <div key={index} className="text-center p-2 group">
                                            <Link href={client?.link} target="_blank" rel="noopener noreferrer" >
                                                <div className="relative w-full max-w-[256px] aspect-[256/126] bg-white transition-transform duration-300 ease-in-out hover:scale-105">
                                                    <Image src={imageUrl} alt={altText} width={256} height={126} loading="lazy" className=" bg-white transition-transform duration-300 ease-in-out hover:scale-105" />
                                                </div>
                                                <br />
                                                <span className="group-hover:text-[#e21f2c]">
                                                    {client?.country}
                                                </span>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <h2 className="text-[24px] md:text-[20px] text-left font-normal font-sans text-[#17171B]">
                                Subscribe to our newsletters
                            </h2>
                            <div className="flex w-full max-w-md">
                                <input type="email" placeholder="EMAIL*" className="bg-white flex-grow px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
                                <button className="px-4 border py-3 border-gray-300 text-black bg-white hover:bg-red-600 hover:text-white transition" aria-label="Email Submit Button" >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start w-full max-w-md space-x-2 mt-16">
                            <input type="checkbox" id="marketingConsent" className="mt-1 h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500" />
                            <div>
                                <label htmlFor="marketingConsent" className="text-sm">
                                    I agree to receive marketing emails from XESS.
                                </label>
                                <p className="mt-1 text-[8px] text-gray-500 leading-relaxed">
                                    You can unsubscribe from these communications at any time. For
                                    more information on how to unsubscribe, our privacy practices,
                                    and how we are committed to protecting and respecting your
                                    privacy, please review our Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden flex flex-col">
                    <div className="col-span-4 mx-auto pt-5">
                        <div className="flex flex-col items-center text-center">
                            <div className="md:w-64 h-auto w-auto">
                                <div style={{ width: 191, height: 87 }}>
                                    <Image
                                        src="/images/Footer logo.png"
                                        width={191}
                                        height={87}
                                        alt="Footer Logo"
                                        quality={80}
                                        sizes="(max-width: 768px) 100vw, 191px"
                                        priority
                                    />
                                </div>
                            </div>
                            <div className="text-center flex flex-col pt-2">
                                <div className="flex items-center justify-left gap-10 py-5">
                                    {mainFooter?.social?.map(
                                        (item: { icon: string; link: string }, index: number) => (
                                            <Link
                                                key={index}
                                                href={item.link || "#"}
                                                aria-label={item.icon}
                                                className="hover:text-[#e21f2c]"
                                            >
                                                {socialIconsMap[item.icon] || null}
                                            </Link>
                                        )
                                    )}
                                </div>
                                <Link
                                    href="https://maps.app.goo.gl/QdHJmr21RC4GPJya9"
                                    className="text-sm leading-relaxed  hover:text-[#e21f2c]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            mainFooter?.address ||
                                            "Warehouse No 3, 20 a Street, Marabea Road Al Quoz 1, Dubai, UAE",
                                    }}
                                ></Link>
                                <Link
                                    href="tel:+971553721525"
                                    className="text-sm pt-4 hover:text-[#e21f2c]"
                                >
                                    {mainFooter?.mobile_number || "+971 55 372 1525"}
                                </Link>
                                <Link
                                    href="mailto:info@xessevents.com"
                                    className="text-sm pt-2 hover:text-[#e21f2c]"
                                >
                                    {mainFooter?.email || "info@xessevents.com"}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 py-12 px-12 md:px-20">
                        <div>
                            <Link href="/about">
                                <h3 className="text-[22px] font-semibold hover:text-[#e21f2c]">
                                    {mainFooter?.footerA?.title || "About"}
                                </h3>
                            </Link>
                            <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                {mainFooter?.footerA?.subList?.map(
                                    (item: { link: string; name: string }, index: number) => (
                                        <li key={index} className="py-0.5">
                                            <Link
                                                href={item.link || "#"}
                                                className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div>
                            <Link href="/service">
                                <h3 className="text-[22px] font-semibold hover:text-[#e21f2c]">
                                    {mainFooter?.footerS?.title || "Services"}
                                </h3>
                            </Link>
                            <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                {mainFooter?.footerS?.subList?.map(
                                    (item: { link: string; name: string }, index: number) => (
                                        <li key={index} className="py-0.5">
                                            <Link
                                                href={item.link || "#"}
                                                className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div>
                            <Link href="#">
                                <h3 className="text-[22px] font-semibold hover:text-[#e21f2c]">
                                    {mainFooter?.footerP?.title || "Partners"}
                                </h3>
                            </Link>
                            <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                {mainFooter?.footerP?.subList?.map(
                                    (item: { link: string; name: string }, index: number) => (
                                        <li key={index} className="py-0.5">
                                            <Link
                                                href={item.link || "#"}
                                                className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div>
                            <Link href="/top-city">
                                <h3 className="text-[22px] font-semibold hover:text-[#e21f2c]">
                                    {mainFooter?.footerCty?.title || "Top Destinations"}
                                </h3>
                            </Link>
                            <ul className="mt-2 space-y-1 text-sm min-h-[150px] w-48">
                                {mainFooter?.footerCty?.subList?.map(
                                    (item: { link: string; name: string }, index: number) => (
                                        <li key={index} className="py-0.5">
                                            <Link
                                                href={item.link || "#"}
                                                className="hover:underline hover:underline-offset-4 hover:text-[#e21f2c]"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 pb-8 gap-20">
                        <div className="col-span-2 pt-10">
                            <h2 className="text-[24px] text-left mb-2 font-normal font-sans text-[#17171B] px-10 md:px-40">
                                {partner?.title}
                            </h2>
                            <div className="grid grid-cols-3 gap-4 px-5 md:px-40">
                                {partnerClients.map((client: any, index: number) => {
                                    const imageUrl = client.image?.data?.attributes?.url
                                        ? `${baseUrl}${client.image.data.attributes.url}`
                                        : "/images/Design1.png";
                                    const altText = client.name || "Partner Logo";

                                    return (
                                        <div
                                            key={index}
                                            className="text-center p-2 bg-white shadow-md rounded-md"
                                        >
                                            <Link href="#">
                                                <Image
                                                    src={imageUrl}
                                                    className="w-auto mx-auto p-2"
                                                    alt={altText}
                                                    width={100}
                                                    height={100}
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <span className="block mt-2 text-gray-700">
                                                {client?.country}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4 px-12 md:px-40">
                        <h2 className="text-[18px] md:text-[20px] text-center font-normal font-sans text-[#17171B]">
                            Subscribe to our newsletters
                        </h2>
                        <div className="flex w-full">
                            <input
                                type="email"
                                placeholder="EMAIL*"
                                className="flex-grow px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                            <button className="px-4 border py-3 border-gray-300 text-black bg-white hover:bg-red-600 hover:text-white transition">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-start w-full space-x-2 py-2 md:py-8 px-14 md:px-40">
                        <input
                            type="checkbox"
                            id="marketingConsent"
                            className="mt-1 h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                        />
                        <div>
                            <label htmlFor="marketingConsent" className="text-sm">
                                I agree to receive marketing emails from XESS.
                            </label>
                            <p className="mt-1 text-[8px] text-gray-500 leading-relaxed">
                                You can unsubscribe from these communications at any time. For
                                more information on how to unsubscribe, our privacy practices,
                                and how we are committed to protecting and respecting your
                                privacy, please review our Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-600 text-white">
                    <div className="container mx-auto text-center text-sm py-4 px-4 flex flex-col md:flex-row gap-3 md:gap-8 lg:gap-10 items-center justify-center">
                        <Link href="#" className="hover:underline hover:underline-offset-4">
                            {mainFooter?.terms || "Terms of Service"}
                        </Link>
                        <Link href="#" className="hover:underline hover:underline-offset-4">
                            {mainFooter?.privacy || "Privacy Policy"}
                        </Link>
                        <p> © XESS 2025</p>
                    </div>
                </div>
            </footer>
        </>
    );
};
export default Footer;
