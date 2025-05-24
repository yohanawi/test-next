import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GET_HEADER_DATA } from "@/lib/queries";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from 'next/link';

interface ServiceItem {
    link: string;
    name: string;
}

export default function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const locale = "en";
    const { data } = useQuery(GET_HEADER_DATA, { variables: { locale }, });
    const mainHeader = data?.header?.data?.attributes || {};

    const defaultService = {
        title: "Exhibition Stand Services",
        link: "/exhibition",
        list: [
            {
                name: "Stand Contractor",
                link: "/exhibition-stand-contractors",
            },
            {
                name: "Exhibition Stand Design",
                link: "/exhibition-stand-designer",
            },
            {
                name: "Exhibition Stand Branding",
                link: "/exhibition-stand-branding-services",
            },
        ],
    };

    const service = mainHeader.service || defaultService;
    const serviceList = service.list?.length > 0 ? service.list : defaultService.list;

    useEffect(() => {
        let lastScrollY = 0;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setIsScrolled(window.scrollY > 50);
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <header className={`fixed top-0 left-0 w-screen py-5 z-[99] transition duration-300 border-b-8 border-[#D10003] ${isVisible ? "translate-y-0" : "-translate-y-full"} ${isScrolled ? "bg-white" : "bg-white"}`} >
            <div className="flex items-center justify-between mx-10 lg:mx-36 md:mx-24">
                <Link href="/" onClick={() => setIsOpen(false)}>
                    <Image src="/images/Footer logo.png" alt="XESS Events Logo" width={150} height={60} className="h-auto" priority />
                </Link>
                <nav className="hidden lg:flex items-center justify-center lg:space-x-6 ps-24 lg:ps-10 text-[16px] text-black 3xl:space-x-14">
                    {serviceList.length > 0 && (
                        <div className="relative group">
                            <button className="relative flex items-center space-x-1">
                                <Link href={service.link}>
                                    <span className={`relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-300 group-hover:before:w-full hover:text-[#D10003] ${isActive("/exhibition") ? "text-red-600" : "text-black"}`} >
                                        {service.title}
                                    </span>
                                </Link>
                                <ChevronDown size={16} />
                            </button>
                            <div className="absolute hidden group-hover:block bg-white text-black p-2 min-w-[250px]">
                                {serviceList.map((item: ServiceItem, index: number) => (
                                    <Link key={index} href={item.link} className={`block px-4 py-2 relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-black before:transition-all before:duration-300 hover:before:w-full hover:text-[#D10003] ${isActive(item.link) ? "text-[#D10003]" : "text-black"}`} >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    <Link href="/portfolio" className={`relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-[#D10003] ${isActive("/portfolio") ? "text-red-600" : "text-black"}`}>
                        {mainHeader?.trade_show || "Portfolio"}
                    </Link>

                    <Link href="/event-production" className={`relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-[#D10003] ${isActive("/event-production") ? "text-red-600" : "text-black"}`}>
                        {mainHeader?.project || "Event Services"}
                    </Link>

                    <Link href="/exhibition-calendar" className={`relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-[#D10003] ${isActive("/exhibition-calendar") ? "text-red-600" : "text-black"}`}>
                        {mainHeader?.calendar || "Exhibition Calendar"}
                    </Link>

                    <Link href="/about-us" className={`relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-[#D10003] ${isActive("/about-us") ? "text-red-600" : "text-black"}`}>
                        {mainHeader?.about || "About"}
                    </Link>

                    <Link href="/contact-us" className={`relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-[#D10003] ${isActive("/contact-us") ? "text-red-600" : "text-black"}`}>
                        {mainHeader?.contact || "Contact"}
                    </Link>
                </nav>
                <div className="hidden gap-5 lg:flex">
                    <div className="relative w-10 h-10 hover:scale-110">
                        <Image src="/images/call-icon.png" alt="call iocn" layout="fill" objectFit="cover" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">{mainHeader?.CallNow?.lable || "Call Now"}</p>
                        <Link href={`tel:${mainHeader?.CallNow?.phone}`} className="text-black hover:text-[#D10003]" >
                            {mainHeader?.CallNow?.phone || "+971 55 372 1525"}
                        </Link>
                    </div>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="z-50 text-2xl text-black lg:hidden">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-black text-white p-10 px-6 md:px-10 space-y-4 text-[18px] md:text-[22px] text-left max-h-screen overflow-y-auto">
                    {serviceList.length > 0 && (
                        <div ref={dropdownRef} className="relative">
                            <Link href={service.link}>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between w-full hover:text-red-500" >
                                    {service.title}
                                    <span className={`ml-2 transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} >
                                        <ChevronDown size={16} />
                                    </span>
                                </button>
                            </Link>
                            <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`} >
                                <div className="py-2 pl-4 mt-2 space-y-2 rounded-md shadow-lg">
                                    {serviceList.map((item: ServiceItem, index: number) => (
                                        <Link key={index} href={item.link} onClick={() => setIsOpen(false)} className={`block py-2 text-white hover:bg-red-600 hover:text-[#D10003] ${isActive(item.link) ? "text-[#D10003]" : "text-black"}`} >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                    <Link href="/portfolio" onClick={() => setIsOpen(false)} className={`block hover:text-red-500 ${isActive("/portfolio") ? "text-red-600" : "text-white"}`}>
                        {mainHeader?.trade_show || "Portfolio"}
                    </Link>
                    <Link href="/event-production" onClick={() => setIsOpen(false)} className={`block hover:text-red-500 ${isActive("/event-production") ? "text-red-600" : "text-white"}`} >
                        {mainHeader?.project || "Event Services"}
                    </Link>
                    <Link href="/exhibition-calendar" onClick={() => setIsOpen(false)} className={`block hover:text-red-500 ${isActive("/exhibition-calendar") ? "text-red-600" : "text-white"}`}>
                        {mainHeader?.calendar || "Exhibition Calendar"}
                    </Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className={`block hover:text-red-500 ${isActive("/about") ? "text-red-600" : "text-white"}`}>
                        {mainHeader?.about || "About"}
                    </Link>
                    <Link href="/contact-us" onClick={() => setIsOpen(false)} className={`block hover:text-red-500 ${isActive("/contact-us") ? "text-red-600" : "text-white"}`}>
                        {mainHeader?.contact || "Contact"}
                    </Link>
                </div>
            )}
        </header>
    )
}