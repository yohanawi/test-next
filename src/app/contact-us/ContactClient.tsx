"use client";

import { GET_CONTACT_PAGE_DATA } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface Address {
    country: string;
    link?: string;
    address?: string;
    phoneLabel?: string;
    phoneNumber?: string;
    phone1Country?: string;
    phoneNumber2?: string;
    phone2Country?: string;
    email?: string;
    emailLabel?: string;
}


export default function Contact() {

    const { locale } = useSelector((state: RootState) => state.locale);
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API || "https://cms.xessevents.com/api/contacts";
    const { data } = useQuery(GET_CONTACT_PAGE_DATA, { variables: { locale }, });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const contactPage = data?.contactPages?.data?.[0]?.attributes;
    const heroTitle = contactPage?.HeroSec?.title || "We'd Love to Talk";
    const cmsImagePath = contactPage?.HeroSec?.bgImage?.data?.attributes?.url;
    const heroBgImage = cmsImagePath ? `${baseUrl}${cmsImagePath}` : "/images/Banner.jpg";
    const formSection = contactPage?.FormSec;
    const formFields = formSection?.form || {};
    const infoSection = contactPage?.InfoSec;
    const addresses = infoSection?.address || [];
    const headquarter = infoSection?.headquarter;

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    const [formData, setFormData] = useState({
        companyName: "",
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptedTerms) {
            setStatusMessage({ type: "error", text: "You must accept the terms and conditions.", });
            return;
        }
        try {
            const response = await axios.post(
                apiUrl,
                {
                    data: formData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setStatusMessage({ type: "success", text: "Message sent successfully!", });
                setFormData({
                    companyName: "",
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
            } else {
                setStatusMessage({ type: "error", text: "Failed to send message. Please try again.", });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setStatusMessage({ type: "error", text: "An error occurred while sending the message.", });
        }
    };

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={heroBgImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">
                        {heroTitle}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="contact-us" className="px-4 uppercase">Contact</Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] lg:p-10 md:p-8 p-2 relative" id="contactForm" >
                <div className="grid grid-cols-1 gap-16 p-5 mx-4 bg-white lg:grid-cols-3 lg:mx-44 rounded-2xl">
                    <div className="lg:col-span-1 flex flex-col bg-[#373946] p-4 rounded-2xl" style={{ fontFamily: "Work Sans, sans-serif" }} >
                        <h2 className="text-2xl font-extrabold text-white uppercase md:text-4xl">
                            {formSection?.title}
                        </h2>
                        <p className="text-xs leading-relaxed tracking-wide text-white md:mt-4 lg:text-sm md:py-4"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(formSection?.description || ""),
                            }}>
                        </p>
                        <h4 className="pt-10 text-xs font-extrabold text-white uppercase lg:text-sm">
                            {headquarter?.headquaterLbl}
                        </h4>
                        <Link href="https://maps.app.goo.gl/QdHJmr21RC4GPJya9">
                            <p className="text-white opacity-70 text-xs lg:text-sm py-4 font-sans leading-relaxed hover:text-[#EA2127]"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(headquarter?.address || "DUBAI </br> Warehouse No, 3,</br> 20 a Street, Marabea Road </br>Al Quozlnd4, Dubai, UAE"),
                                }}>
                            </p>
                        </Link>
                        <div>
                            <h4 className="py-2 text-xs font-extrabold text-white uppercase lg:text-sm lg:py-2">
                                {headquarter?.phoneLbl}
                            </h4>
                            <p className="py-2 font-sans text-xs leading-relaxed text-white opacity-70 lg:text-sm lg:py-1">
                                <Link href={`tel:${headquarter?.phoneNum}`} className="hover:text-[#EA2127]" >
                                    {" "}
                                    {headquarter?.phoneNum}
                                </Link>
                            </p>
                        </div>
                        <div className="py-3 lg:py-5">
                            <h4 className="py-2 text-xs font-extrabold text-white uppercase lg:text-sm lg:py-2">
                                {headquarter?.emailLbl}
                            </h4>
                            <p className="py-2 font-sans text-xs leading-relaxed text-white opacity-70 lg:text-sm lg:py-1">
                                <Link href={`mailto:${headquarter?.email}`} className="hover:text-[#EA2127]" >
                                    {headquarter?.email}
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 lg:grid-cols-2" >
                            <div>
                                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }} >
                                    {formFields?.nameLabel}{" "}
                                    <span className="text-[#E72836]">*</span>
                                </label>
                                <input id="name" value={formData.name} onChange={handleChange} className="w-full py-5 text-sm text-black border-b border-black outline-none" type="text" placeholder={formFields?.namePlaceholder} style={{ fontFamily: "Sora, sans-serif" }} />
                            </div>
                            <div>
                                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }} >
                                    {formFields?.emailLabel}{" "}
                                    <span className="text-[#E72836]">*</span>
                                </label>
                                <input id="email" value={formData.email} onChange={handleChange} className="w-full py-5 text-sm text-black border-b border-black outline-none" type="email" placeholder={formFields?.emailPlaceholder} style={{ fontFamily: "Sora, sans-serif" }} />
                            </div>
                            <div>
                                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }}>
                                    {formFields?.phoneLabel}{" "}
                                    <span className="text-[#E72836]">*</span>
                                </label>
                                <input id="phone" value={formData.phone} onChange={handleChange} className="w-full py-5 text-sm text-black border-b border-black outline-none" type="text" placeholder={formFields?.phonePlaceholder} style={{ fontFamily: "Sora, sans-serif" }} />
                            </div>
                            <div>
                                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }}>
                                    {formFields?.budgetLabel}{" "}
                                    <span className="text-[#E72836]">*</span>
                                </label>
                                <input id="companyName" value={formData.companyName} onChange={handleChange} className="w-full py-5 text-sm text-black border-b border-black outline-none" type="text" placeholder={formFields?.budgetPlaceholder} style={{ fontFamily: "Sora, sans-serif" }} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }}>
                                    {formFields?.messageLabel}{" "}
                                    <span className="text-[#E72836]">*</span>
                                </label>
                                <textarea id="message" value={formData.message} onChange={handleChange} className="w-full py-5 text-sm text-black border-b border-black outline-none" placeholder={formFields?.messagePlaceholder} rows={7} style={{ fontFamily: "Sora, sans-serif" }}></textarea>
                            </div>
                            <div className="flex items-center col-span-2">
                                <input type="checkbox" id="terms" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} className="w-4 h-4 mr-2" />
                                <label htmlFor="terms" className="text-sm text-black opacity-70">
                                    Accept the terms and conditions of personal data.
                                </label>
                            </div>

                            <div className="col-span-2 my-4">
                                <button type="submit" className={`bg-[#e21f2c] text-sm text-black px-12 py-4 font-bold ${!acceptedTerms ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!acceptedTerms} >
                                    {formFields?.btnLabel || "Send Now"}
                                </button>
                            </div>

                            {statusMessage.text && (
                                <p className={`text-center mt-2 ${statusMessage.type === "success" ? "text-green-500" : "text-red-500"}`} >
                                    {statusMessage.text}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            <section className="bg-[#d8dde0] relative pt-10 lg:pb-40 md:pb-10 pb-8" style={{ fontFamily: "Work Sans, sans-serif" }} >
                <div className="grid grid-cols-1 mx-12 lg:grid-cols-5 lg:mx-44 md:mx-20 lg:gap-10">
                    <div className="flex flex-col lg:col-span-2">
                        <h2 className="text-2xl font-bold text-black uppercase md:text-4xl">
                            {infoSection?.title}
                        </h2>
                        <p className="py-4 mt-4 text-xs text-gray-600 md:text-sm"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(infoSection?.description || ""),
                            }}>
                        </p>
                    </div>
                    <div className="col-span-3">
                        <div className="grid gap-5 md:grid-cols-3">
                            {addresses.map((address: Address, index: number) => (
                                <div key={index}>
                                    <h5 className="text-black uppercase">{address.country}</h5>
                                    <div className="mt-2 border-b-4 border-[#dc0f12] mr-8 w-16"></div>
                                    <Link href={address?.link || "#"}>
                                        <p className="text-black opacity-70 text-xs lg:text-sm pt-5 pb-1 font-sans leading-relaxed hover:text-[#dc0f12]"
                                            dangerouslySetInnerHTML={{
                                                __html: address.address || "",
                                            }}
                                        ></p>
                                    </Link>
                                    {address.phoneNumber && (
                                        <p className="font-sans text-xs text-black opacity-70 lg:text-sm">
                                            {address.phoneLabel}:{" "}
                                            <Link href={`tel:${address.phoneNumber}`} className="hover:text-[#dc0f12]" >
                                                {address.phoneNumber}{" "}
                                                {address.phone1Country ? `(${address.phone1Country})` : ""}
                                            </Link>
                                        </p>
                                    )}
                                    {address.phoneNumber2 && (
                                        <p className="font-sans text-xs text-black opacity-70 lg:text-sm">
                                            {address.phoneLabel}:{" "}
                                            <Link href={`tel:${address.phoneNumber2}`} className="hover:text-[#dc0f12]">
                                                {address.phoneNumber2}{" "}
                                                {address.phone2Country ? `(${address.phone2Country})` : ""}
                                            </Link>
                                        </p>
                                    )}
                                    {address.email && address.emailLabel && (
                                        <p className="font-sans text-xs text-black opacity-70 lg:text-sm">
                                            {address.emailLabel}:{" "}
                                            <Link href={`mailto:${address.email}`} className="hover:text-[#dc0f12]" >
                                                {address.email}
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="lg:-mt-[120px] lg:relative ">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.863749348657!2d55.239492041088624!3d25.123819704436013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzI1LjgiTiA1NcKwMTQnMjEuMiJF!5e1!3m2!1sen!2s!4v1739427755557!5m2!1sen!2s"
                    width="100%" height="500" loading="lazy" className="rounded" title="Xess exhibition stand services llc"></iframe>
            </section>
        </>
    );
}