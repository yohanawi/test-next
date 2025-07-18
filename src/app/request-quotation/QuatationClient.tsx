"use client";

import countryList from "react-select-country-list";
import ContactForm from "@/components/Contactform";
import Select from "react-select";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";

type CountryOption = {
    label: string;
    value: string;
};

type FormDataType = {
    userName: string;
    companyName: string;
    website: string;
    phoneNumber: string;
    emailAddress: string;
    eventName: string;
    country: string;
    standSize: string;
    deckerType: string;
    budget: string;
    description: string;
    sampleDesign: File | null;
    floorDesign: File | null;
};

type FormErrorsType = {
    [K in keyof FormDataType]?: string;
};

export default function QuatationClient() {

    const [formData, setFormData] = useState<FormDataType>({
        userName: "",
        companyName: "",
        website: "",
        phoneNumber: "",
        emailAddress: "",
        eventName: "",
        country: "",
        standSize: "",
        deckerType: "Single Decker",
        budget: "",
        description: "",
        sampleDesign: null,
        floorDesign: null,
    });


    const [errors, setErrors] = useState<FormErrorsType>({});
    const [sampleDesign, setSampleDesign] = useState<File | null>(null);
    const [floorDesign, setFloorDesign] = useState<File | null>(null);
    const options = countryList().getData();
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const handleCountryChange = (selectedOption: CountryOption | null) => {
        if (!selectedOption) return;
        setFormData((prev) => ({ ...prev, country: selectedOption.label }));
        setErrors((prev) => ({ ...prev, country: undefined }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fileSetter: React.Dispatch<React.SetStateAction<File | null>>
    ) => {
        if (e.target.files) {
            fileSetter(e.target.files[0]);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrorsType = {};
        let formIsValid = true;

        if (!formData.companyName) {
            newErrors.companyName = "Company Name is required";
            formIsValid = false;
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Phone Number is required";
            formIsValid = false;
        }

        if (!formData.userName) {
            newErrors.userName = "Contact Person is required";
            formIsValid = false;
        }

        if (!formData.emailAddress) {
            newErrors.emailAddress = "Email Address is required";
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
            newErrors.emailAddress = "Email Address is invalid";
            formIsValid = false;
        }

        if (!formData.eventName) {
            newErrors.eventName = "Event Name is required";
            formIsValid = false;
        }

        if (!formData.country) {
            newErrors.country = "Country is required";
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors: FormErrorsType = {
            userName: formData.userName ? undefined : "User name is required",
            companyName: formData.companyName ? undefined : "Company name is required",
            phoneNumber: formData.phoneNumber ? undefined : "Phone number is required",
            emailAddress: formData.emailAddress ? undefined : "Email address is required",
            eventName: formData.eventName ? undefined : "Event name is required",
            country: formData.country ? undefined : "Country is required",
            standSize: formData.standSize ? undefined : "Stand size is required",
            budget: formData.budget ? undefined : "Budget is required",
            description: formData.description ? undefined : "Description is required",
            sampleDesign: sampleDesign ? undefined : "Sample design is required",
            floorDesign: floorDesign ? undefined : "Floor design is required",
        };

        setErrors(validationErrors);

        if (!validateForm()) {
            return;
        }
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });

        if (sampleDesign) {
            data.append("files", sampleDesign);
        }
        if (floorDesign) {
            data.append("files", floorDesign);
        }

        const uploadRes = await axios.post("https://cms.xessevents.com/api/upload", data);
        const uploadedFiles = uploadRes.data;
        const sampleDesignId = uploadedFiles[0]?.id || null;
        const floorDesignId = uploadedFiles[1]?.id || null;

        const payload = {
            data: {
                userName: formData.userName,
                companyName: formData.companyName,
                website: formData.website,
                phoneNumber: formData.phoneNumber,
                emailAddress: formData.emailAddress,
                eventName: formData.eventName,
                country: formData.country,
                standSize: formData.standSize,
                deckerType: formData.deckerType,
                budget: formData.budget,
                description: formData.description,
                sampleDesign: sampleDesignId ? [sampleDesignId] : [],
                floorDesign: floorDesignId ? [floorDesignId] : [],
            },
        };

        try {
            const response = await axios.post("https://cms.xessevents.com/api/quotations", payload, {
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: "Thank You!",
                    text: "Your quotation has been submitted successfully.",
                    icon: "success",
                    confirmButtonText: "Close",
                    customClass: {
                        confirmButton: "bg-[#EA2127] text-white px-4 py-2 rounded",
                    },
                    buttonsStyling: false,
                });

                setStatusMessage({ type: "success", text: "Quotation submitted successfully!" });
                setFormData({
                    userName: "",
                    companyName: "",
                    website: "",
                    phoneNumber: "",
                    emailAddress: "",
                    eventName: "",
                    country: "",
                    standSize: "",
                    deckerType: "Single Decker",
                    budget: "",
                    description: "",
                    sampleDesign: null,
                    floorDesign: null,

                });
                setSampleDesign(null);
                setFloorDesign(null);
                setTimeout(() => setIsSubmitting(false), 3000);
                console.log('Response:', response);
            } else {
                setStatusMessage({ type: "error", text: "Failed to submit. Please try again." });
                setIsSubmitting(false);
            }
        } catch (err) {
            const error = err as Error | { message?: string };
            console.error("Error during form submission:", error);
            setStatusMessage({ type: "error", text: "Something went wrong. Try again later." });
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="relative w-full lg:h-[120px] h-[100px] bg-black"></section>

            <section className="flex items-center justify-center text-center bg-white">
                <div className="w-full mb-5 border-b-2 border-black lg:mx-44 mx-14 3xl:mx-72">
                    <div className="mt-10 mb-5 lg:mt-20 lg:mb-16 md:mt-16 md:mb-8">
                        <h1 className="font-sans text-2xl font-semibold text-black uppercase lg:text-5xl md:text-4xl">Request Quotation</h1>
                        <div className="flex items-center justify-center pt-2 text-xs text-center text-black md:text-sm md:pt-5">
                            <Link href="/" className="px-4 uppercase">Home</Link>
                            /
                            <Link href="/request-quotation" className="uppercase px-4 text-[#EA2127]">request Quatation</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="pb-10 mx-12 lg:mx-44 md:mx-16 md:pb-20 3xl:mx-72">
                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">contact details</p>
                                <span className="text-sm text-black">* Required Feilds</span>
                            </div>
                            <div className="grid gap-2 mt-5 lg:grid-cols-3 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label htmlFor="companyName" className="text-black ms-3">Your company name <span className="text-[#EA2127]">*</span></label>
                                    <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name *" className={`w-full px-4 py-2 rounded-full border-2 ${errors.companyName ? "border-red-500" : "border-gray-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`} />
                                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                                </div>
                                <div className="space-y-3 ">
                                    <label htmlFor="phoneNumber" className="text-black ms-3">Phone Number<span className="text-[#EA2127]">*</span></label>
                                    <input id="phoneNumber" type="text" name="phoneNumber" placeholder="Phone Number *" value={formData.phoneNumber} onChange={handleChange} className={`w-full px-4 py-2 rounded-full border-2 ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`} />
                                    {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                                </div>
                                <div className="space-y-3 ">
                                    <label htmlFor="website" className="text-black ms-3">WebSite</label>
                                    <input id="website" type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />

                                </div>
                                <div className="space-y-3 lg:mt-5">
                                    <label htmlFor="userName" className="text-black ms-3">Contact Person<span className="text-[#EA2127]">*</span></label>
                                    <input id="userName" type="text" name="userName" placeholder="Contact Person *" value={formData.userName} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-3 lg:mt-5">
                                    <label htmlFor="emailAddress" className="text-black ms-3">Email Address<span className="text-[#EA2127]">*</span></label>
                                    <input id="emailAddress" type="email" name="emailAddress" placeholder="Email ID" value={formData.emailAddress} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">show information</p>
                            </div>
                            <div className="grid gap-2 mt-5 lg:grid-cols-2 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label htmlFor="eventName" className="text-black ms-3">Event Name <span className="text-[#EA2127]">*</span></label>
                                    <input id="eventName" type="text" name="eventName" placeholder="Show Name *" value={formData.eventName} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-3 ">
                                    <label htmlFor="Country" className="text-black ms-3">Country<span className="text-[#EA2127]">*</span></label>
                                    <Select options={options} placeholder="Select Country" onChange={handleCountryChange} className="w-full text-black" isSearchable />
                                </div>
                            </div>
                        </div>
                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">Stand dimensions & size</p>
                            </div>
                            <div className="grid gap-2 mt-5 lg:grid-cols-2 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label htmlFor="standSize" className="text-black ms-3">Stand Size</label>
                                    <input type="text" name="standSize" placeholder="Stand Size" value={formData.standSize} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="flex items-center space-x-3 md:mt-7 lg:ms-8 lg:gap-16">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="deckerType" value="Single Decker" checked={formData.deckerType === "Single Decker"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300 " />
                                        <label htmlFor="deckerType" className="text-black">Single Decker</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="deckerType" value="Double Decker" checked={formData.deckerType === "Double Decker"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                        <label htmlFor="deckerType" className="text-black">Double Decker</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">budget</p>
                            </div>
                            <div className="grid gap-2 mt-5 lg:grid-cols-2 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label htmlFor="budget" className="text-black ms-3">Your approximate Budget (if possible)</label>
                                    <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="Your approximate Budget (if possible)" className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-3"></div>
                                <div className="mt-5 space-y-3">
                                    <label htmlFor="Sample Design (Any Design)" className="text-black ms-3">Sample Design (Any Design)</label>
                                    <input type="file" name="sampleDesign" onChange={(e) => handleFileChange(e, setSampleDesign)} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="mt-5 space-y-3">
                                    <label htmlFor="Floor Design" className="text-black ms-3">Floor Design</label>
                                    <input type="file" name="floorDesign" onChange={(e) => handleFileChange(e, setFloorDesign)} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">Description</p>
                            </div>
                            <div className="mt-5">
                                <div className="space-y-3">
                                    <textarea name="description" placeholder="Your Message" value={formData.description} onChange={handleChange} className="w-full h-64 px-4 py-6 text-black border-2 border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5}></textarea>
                                </div>
                            </div>
                        </div>
                        {statusMessage.text && (
                            <p className={`text-center mt-2 ${statusMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
                                {statusMessage.text}
                            </p>
                        )}
                        <div className="flex justify-center">
                            <button type="submit" className="w-full px-3 py-3 text-white bg-[#EA2127] hover:bg-[#D31D22]" disabled={isSubmitting}> {isSubmitting ? "Submitting..." : "Submit"}</button>
                        </div>
                    </div>
                </form>
            </section>

            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}