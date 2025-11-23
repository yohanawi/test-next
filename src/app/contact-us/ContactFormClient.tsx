"use client";

import { useState } from "react";
import axios from "axios";

export default function ContactFormClient({ formSection }: { formSection: any }) {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API || "https://cms.xessevents.com/api/contacts";
    const formFields = formSection?.form || {};

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
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 lg:grid-cols-2">
            <div>
                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }}>
                    {formFields?.nameLabel}{" "}
                    <span className="text-[#E72836]">*</span>
                </label>
                <input id="name" value={formData.name} onChange={handleChange} className="w-full py-5 text-sm text-black border-b border-black outline-none" type="text" placeholder={formFields?.namePlaceholder} style={{ fontFamily: "Sora, sans-serif" }} />
            </div>
            <div>
                <label className="text-xs font-extrabold text-black uppercase lg:text-sm" style={{ fontFamily: "Work Sans, sans-serif" }}>
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
                <button type="submit" className={`bg-[#e21f2c] text-sm text-black px-12 py-4 font-bold ${!acceptedTerms ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!acceptedTerms}>
                    {formFields?.btnLabel || "Send Now"}
                </button>
            </div>

            {statusMessage.text && (
                <p className={`text-center mt-2 ${statusMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
                    {statusMessage.text}
                </p>
            )}
        </form>
    );
}