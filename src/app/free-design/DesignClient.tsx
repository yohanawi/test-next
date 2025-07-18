"use client";

import countryList from "react-select-country-list";
import ContactForm from "@/components/Contactform";
import { SingleValue } from "react-select";
import Select from "react-select";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

interface FormErrors {
    [key: string]: string;
}

export default function DesignClient() {

    const [formData, setFormData] = useState({
        userName: "",
        companyName: "",
        website: "",
        phoneNumber: "",
        emailAddress: "",
        eventName: "",
        country: "",
        standSize: "",
        deckerType: "Single Decker",
        spaceType: "Two Slide F & L",
        meetingAreaType: "Closed",
        meetingArea: "Hanging Structure",
        length: 0.00,
        width: 0.00,
        area: 0.00,
        budget: "",
        message: "",
        sampleDesign: null,
        floorDesign: null,
        graphicLogo: null,
    });

    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [, setErrorFlags] = useState({
        userName: false,
        companyName: false,
        phoneNumber: false,
        emailAddress: false,
        eventName: false,
        country: false,
        standSize: false,
        budget: false,
        message: false,
    });

    const [sampleDesign, setSampleDesign] = useState<File | null>(null);
    const [floorDesign, setFloorDesign] = useState<File | null>(null);
    const [graphicLogo, setGraphicLogo] = useState<File | null>(null);
    const options = countryList().getData();
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                meetingArea: target.checked ? value : ""
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        setErrorFlags((prev) => ({ ...prev, [name]: false }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleCountryChange = (
        selectedOption: SingleValue<{ value: string; label: string }>

    ) => {
        if (selectedOption) {
            setFormData((prev) => ({ ...prev, country: selectedOption.label }));
            setErrorFlags((prev) => ({ ...prev, country: false }));
        } else {
            setFormData((prev) => ({ ...prev, country: "" }));
            setErrorFlags((prev) => ({ ...prev, country: true }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileSetter: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files) {
            fileSetter(e.target.files[0]);
        }
    };

    // Removed unused validateForm function

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const errors: FormErrors = {};
        if (!formData.companyName) errors.companyName = "Company Name is required";
        if (!formData.phoneNumber) errors.phoneNumber = "Phone Number is required";
        if (!formData.userName) errors.userName = "Contact Person is required";
        if (!formData.emailAddress) errors.emailAddress = "Email Address is required";
        else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) errors.emailAddress = "Email Address is invalid";
        if (!formData.eventName) errors.eventName = "Event Name is required";
        if (!formData.country) errors.country = "Country is required";
        if (!formData.budget) errors.budget = "Budget is required";
        if (!formData.message) errors.message = "Message is required";

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            setIsSubmitting(false);
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill all required fields correctly.",
            });
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value.toString());
        });
        if (sampleDesign) data.append("files", sampleDesign);
        if (floorDesign) data.append("files", floorDesign);
        if (graphicLogo) data.append("files", graphicLogo);

        let uploadedFiles = [];
        try {
            if (sampleDesign || floorDesign || graphicLogo) {
                const uploadRes = await axios.post("https://cms.xessevents.com/api/upload", data);
                if (!uploadRes.data || !Array.isArray(uploadRes.data) || uploadRes.data.length === 0) {
                    throw new Error("File upload failed: No files were uploaded.");
                }
                uploadedFiles = uploadRes.data;
            }

            const sampleDesignId = uploadedFiles?.[0]?.id || null;
            const floorDesignId = uploadedFiles?.[1]?.id || null;
            const graphicLogoId = uploadedFiles?.[2]?.id || null;

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
                    spaceType: formData.spaceType,
                    meetingAreaType: formData.meetingAreaType,
                    meetingArea: formData.meetingArea,
                    length: formData.length,
                    width: formData.width,
                    area: formData.area,
                    budget: formData.budget,
                    message: formData.message,
                    sampleDesign: sampleDesignId ? [sampleDesignId] : [],
                    floorDesign: floorDesignId ? [floorDesignId] : [],
                    graphicsLogo: graphicLogoId ? [graphicLogoId] : [],
                },
            };

            const response = await axios.post("https://cms.xessevents.com/api/free-designs", payload, {
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                setStatusMessage({ type: "success", text: "Quotation submitted successfully!" });
                setSampleDesign(null);
                setFloorDesign(null);
                setGraphicLogo(null);
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
                    spaceType: "Two Slide F & L",
                    meetingAreaType: "Closed",
                    meetingArea: "Hanging Structure",
                    budget: "",
                    length: 0,
                    width: 0,
                    area: 0,
                    message: "",
                    sampleDesign: null,
                    floorDesign: null,
                    graphicLogo: null,
                });
                setTimeout(() => setIsSubmitting(false), 3000);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Quotation submitted successfully!",
                });
            } else {
                setStatusMessage({ type: "error", text: "Failed to submit. Please try again." });
                setIsSubmitting(false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to submit. Please try again.",
                });
            }
        } catch (error: unknown) {
            console.error('Error during form submission:', error);
            setStatusMessage({ type: "error", text: "Something went wrong. Try again later." });
            setIsSubmitting(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Try again later.",
            });
        }
    };

    return (
        <>

            <section className="relative w-full lg:h-[120px] h-[100px] md:h-[130px] bg-black"></section>

            <section className="flex items-center justify-center text-center bg-white ">
                <div className="w-full mb-5 border-b-2 border-black lg:mx-44 mx-14 3xl:mx-72">
                    <div className="mt-10 mb-5 lg:mt-20 lg:mb-16 md:mt-16 md:mb-8">
                        <h1 className="font-sans text-2xl font-semibold text-black uppercase lg:text-5xl md:text-4xl">Get <span className="text-[#FF0000]">free</span> design</h1>
                        <div className="flex items-center justify-center pt-2 text-xs text-center text-black md:text-sm md:pt-5">
                            <Link href="/" className="px-4 uppercase">Home</Link>
                            /
                            <Link href="/free-design" className="uppercase px-4 text-[#EA2127]">get free design</Link>
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
                            <div className="grid gap-2 mt-5 lg:grid-cols-2 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label htmlFor="companyName" className="text-black ms-3">Your company name <span className="text-[#EA2127]">*</span></label>
                                    <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name *" className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {fieldErrors.companyName && <span className="text-xs text-red-500">{fieldErrors.companyName}</span>}
                                </div>
                                <div className="space-y-3 ">
                                    <label htmlFor="phoneNumber" className="text-black ms-3">Phone Number<span className="text-[#EA2127]">*</span></label>
                                    <input id="phoneNumber" type="text" name="phoneNumber" placeholder="Phone Number *" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {fieldErrors.phoneNumber && <span className="text-xs text-red-500">{fieldErrors.phoneNumber}</span>}
                                </div>
                                <div className="space-y-3 lg:mt-5">
                                    <label htmlFor="website" className="text-black ms-3">Your Web Site Name</label>
                                    <input id="website" type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-3 lg:mt-5">
                                    <label htmlFor="userName" className="text-black ms-3">Contact Person<span className="text-[#EA2127]">*</span></label>
                                    <input id="userName" type="text" name="userName" placeholder="Contact Person *" value={formData.userName} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {fieldErrors.userName && <span className="text-xs text-red-500">{fieldErrors.userName}</span>}
                                </div>
                                <div className="space-y-3 lg:mt-5">
                                    <label htmlFor="emailAddress" className="text-black ms-3">Email<span className="text-[#EA2127]">*</span></label>
                                    <input id="emailAddress" type="email" name="emailAddress" placeholder="Email ID" value={formData.emailAddress} onChange={handleChange} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {fieldErrors.emailAddress && <span className="text-xs text-red-500">{fieldErrors.emailAddress}</span>}
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
                                    {fieldErrors.eventName && <span className="text-xs text-red-500">{fieldErrors.eventName}</span>}
                                </div>
                                <div className="space-y-3 ">
                                    <label htmlFor="Country" className="text-black ms-3">Select your country<span className="text-[#EA2127]">*</span></label>
                                    <Select options={options} placeholder="Select Country" onChange={handleCountryChange} className="w-full text-black" isSearchable />
                                    {fieldErrors.country && <span className="text-xs text-red-500">{fieldErrors.country}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">Stand dimensions & size</p>
                            </div>
                            <div className="grid gap-2 mt-5 lg:grid-cols-2">
                                <div className="grid grid-cols-9">
                                    <div className="col-span-2 space-y-3">
                                        <label htmlFor="Stand Size" className="text-black lg:ms-8">Length(m)</label>
                                        <input type="number" step={0.00} id="length" name="length" value={formData.length} onChange={handleChange} placeholder="Length*" className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex items-center justify-center col-span-1 space-y-3 mt-9">
                                        <label htmlFor="X" className="text-black">X</label>
                                    </div>
                                    <div className="col-span-2 space-y-3">
                                        <label htmlFor="Width" className="text-black lg:ms-8">Width(m)</label>
                                        <input type="number" step={0.00} id="width" name="width" value={formData.width} onChange={handleChange} placeholder="Width*" className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex items-center justify-center col-span-1 space-y-3 mt-9">
                                        <label htmlFor="=" className="text-black">=</label>
                                    </div>
                                    <div className="col-span-2 space-y-3">
                                        <label htmlFor="Area" className="text-black lg:ms-8">Area</label>
                                        <input type="number" step={0.00} id="area" name="area" value={formData.area} onChange={handleChange} placeholder="Area*" className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex items-center justify-center col-span-1 space-y-3 mt-9">
                                        <label htmlFor="SQM" className="text-black">SQM</label>
                                    </div>
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
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">your space is</p>
                            </div>
                            <div className="grid gap-2 mt-5 lg:grid-cols-5 md:grid-cols-2">
                                <div className="mt-4">
                                    <input type="radio" name="spaceType" value="One Silde Open" checked={formData.spaceType === "One Silde Open"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300 " />
                                    <Image src="/images/space1.png" alt="spaces" className="lg:mt-3" width={100} height={100} />
                                    {/* <img src="/images/space1.png" alt="spaces" className="lg:mt-3" /> */}
                                </div>
                                <div className="mt-4">
                                    <input type="radio" name="spaceType" value="Two Slide F & L" checked={formData.spaceType === "Two Slide F & L"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <Image src="/images/space2.png" alt="spaces" className="lg:mt-3" width={100} height={100} />
                                    {/* <img src="/images/space2.png" alt="spaces" className="lg:mt-3" /> */}
                                </div>
                                <div className="mt-4">
                                    <input type="radio" name="spaceType" value="Two Slide F & R" checked={formData.spaceType === "Two Slide F & R"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <Image src="/images/space3.png" alt="spaces" className="lg:mt-3" width={100} height={100} />
                                    {/* <img src="/images/space3.png" alt="spaces" className="lg:mt-3" /> */}
                                </div>
                                <div className="mt-4">
                                    <input type="radio" name="spaceType" value="Two Slide Open" checked={formData.spaceType === "Two Slide Open"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <Image src="/images/space4.png" alt="spaces" className="lg:mt-3" width={100} height={100} />
                                    {/* <img src="/images/space4.png" alt="spaces" className="lg:mt-3" /> */}
                                </div>
                                <div className="mt-4">
                                    <input type="radio" name="spaceType" value="Island" checked={formData.spaceType === "Island"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <Image src="/images/space5.png" alt="spaces" className="lg:mt-3" width={100} height={100} />
                                    {/* <img src="/images/space5.png" alt="spaces" className="lg:mt-3" /> */}
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">Meeting area</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pb-5 mt-5 border-b-2 lg:grid-cols-4 md:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="meetingAreaType" value="Closed" checked={formData.meetingAreaType === "Closed"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300 " />
                                    <label htmlFor="Closed" className="text-black">Closed</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="meetingAreaType" value="Semi Closed" checked={formData.meetingAreaType === "Semi Closed"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Semi Closed" className="text-black">Semi Closed</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="meetingAreaType" value="Open" checked={formData.meetingAreaType === "Open"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Open" className="text-black">Open</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="meetingAreaType" value="Not Required" checked={formData.meetingAreaType === "Not Required"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Not Required" className="text-black">Not Required</label>
                                </div>
                            </div>
                            <div className="grid gap-2 pb-5 mt-10 border-b-2 lg:grid-cols-5 md:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="meetingArea" value="Hanging Structure" checked={formData.meetingArea === "Hanging Structure"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300 " />
                                    <label htmlFor="Hanging" className="text-black">Hanging Structure</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="meetingArea" value="Storage Room" checked={formData.meetingArea === "Storage Room"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Storage" className="text-black">Storage Room</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="meetingArea" value="Refreshment Area" checked={formData.meetingArea === "Refreshment Area"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Refreshment" className="text-black">Refreshment Area</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="meetingArea" value="Reception" checked={formData.meetingArea === "Reception"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Reception" className="text-black">Reception</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="meetingArea" value="Audio/Video" checked={formData.meetingArea === "Audio/Video"} onChange={handleChange} className="w-5 h-5 text-black border-2 border-gray-300" />
                                    <label htmlFor="Audio / Video" className="text-black">Audio / Video</label>
                                </div>
                            </div>
                        </div>

                        <div className="pb-10">
                            <div className="grid gap-2 lg:grid-cols-2 md:grid-cols-2">
                                <div className="mt-5 space-y-3">
                                    <label htmlFor="Sample Design" className="text-black ms-3">Sample Design</label>
                                    <input type="file" name="sampleDesign" onChange={(e) => handleFileChange(e, setSampleDesign)} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="mt-5 space-y-3">
                                    <label htmlFor="Floor Design" className="text-black ms-3">Floor Design</label>
                                    <input type="file" name="sampleDesign" onChange={(e) => handleFileChange(e, setFloorDesign)} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="mt-5 space-y-3">
                                    <label htmlFor="Graphics Logo" className="text-black ms-3">Graphics Logo</label>
                                    <input type="file" name="sampleDesign" onChange={(e) => handleFileChange(e, setGraphicLogo)} className="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                    {fieldErrors.budget && <span className="text-xs text-red-500">{fieldErrors.budget}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 pb-10">
                            <div className="pt-5 pb-4 border-b-2 border-black border-opacity-40">
                                <p className="uppercase text-[#EA2127] md:text-base text-sm">Enter the text</p>
                            </div>
                            <div className="mt-5">
                                <div className="space-y-3">
                                    <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className="w-full px-4 py-6 text-black border-2 border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5}></textarea>
                                    {fieldErrors.message && <span className="text-xs text-red-500">{fieldErrors.message}</span>}
                                </div>
                            </div>
                        </div>

                        {statusMessage.text && (
                            <p className={`text-center mt-2 ${statusMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
                                {statusMessage.text}
                            </p>
                        )}

                        <div className="flex justify-center">
                            <button type="submit" className="w-full px-3 py-3 text-white bg-[#EA2127] hover:bg-[#D31D22] uppercase" disabled={isSubmitting}> {isSubmitting ? "Submitting..." : "Send us"}</button>
                        </div>
                    </div>
                </form>
            </section>

            <section className="bg-white ">
                <div className="mx-10 lg:mx-44 lg:pb-12 md:mx-16 3xl:mx-72">
                    <h3 className="lg:text-2xl text-base uppercase text-[#EA2127]">COST-FREE DESIGN & QUOTATION</h3>
                    <p className="pb-5 my-2 text-sm text-black md:text-base">You&apos;ll get thorough 3D makes of your event stand principle enabling you to bring your idea to life and see first-hand what your event stand will appear like before your event.</p>
                    <h3 className="lg:text-2xl text-base uppercase text-[#EA2127]">distribution build & breakdown</h3>
                    <p className="pb-5 my-2 text-sm text-black md:text-base">Every action of the setup and failure will be taken care of. Our stand service providers will certainly construct your display stand in the days leading up to your occasion & deconstruct it once the show has actually ended.</p>
                    <h3 className="lg:text-2xl text-base uppercase text-[#EA2127]">stress-free exhibition</h3>
                    <p className="pb-5 my-2 text-sm text-black md:text-base">Merely show up to your exhibition and also make an impact. Our specialized task supervisor will take care of everything from your Stand, to the event development schedule and also whatever in between..</p>
                    <h3 className="lg:text-2xl text-base uppercase text-[#EA2127]">COntact us today</h3>
                    <p className="pb-8 text-sm text-black md:text-base">If you would certainly such as any more details regarding our XESS exhibition stands in Dubai or our exhibit hire solution, our group is on hand to aid. Connect with our professional stand layout group today to review your exhibit stand requirements here in Dubai/Abu Dhabi.</p>
                </div>
            </section>

            <section className="relative hidden w-full lg:block">
                <ContactForm />
            </section>
        </>
    );
}