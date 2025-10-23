"use client";
import { useSelector } from "react-redux";
import { GET_CONTACT_DATA } from "@/lib/queries";
import { RootState } from "@/redux/store";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

const ContactForm: React.FC = () => {

  const { locale } = useSelector((state: RootState) => state.locale);
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API || "https://cms.xessevents.com/api/contacts";
  const { data } = useQuery(GET_CONTACT_DATA, { variables: { locale }, });
  const contactSec = data?.contactSec?.data?.attributes || {};

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      setStatusMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid phone number.",
      });
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
        setStatusMessage({
          type: "success",
          text: "Message sent successfully!",
        });
        setFormData({
          companyName: "",
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatusMessage({
        type: "error",
        text: "An error occurred while sending the message.",
      });
    }
  };

  const isFormValid =
    formData.companyName.trim() !== "" &&
    formData.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    /^[0-9+\-\s()]{7,15}$/.test(formData.phone) &&
    formData.message.trim() !== "";

  return (
    <section className="w-full" id="contactForm">
      <div className="relative w-full py-5 3xl:py-20 lg:py-14 md:py-10">
        <Image src="/images/about.jpg" alt="About Us Background" layout="fill" objectFit="cover" quality={30} priority className="-z-10" />
        <div className="relative flex flex-col items-center justify-center h-full p-4 lg:flex-row lg:gap-20">
          <div className="p-6 bg-[#faf7f7] bg-opacity-90 rounded-lg w-full max-w-lg">
            <div className="flex flex-col md:justify-between md:flex-row">
              <div className="border-l-4 border-[#e21f2c]">
                <p className="text-3xl font-light text-black ps-4">Ready?</p>
                <p className="text-2xl font-bold text-black ps-4">Let&apos;s talk</p>
              </div>
              <div className="flex gap-5 mt-5 md:mt-0">
                <a href="https://wa.me/971553721525" target="_blank" rel="noopener noreferrer" >
                  <div className="relative w-8 h-8 mt-2 transition-transform duration-300 ease-in-out md:w-12 md:h-12 md:mt-0 hover:scale-110">
                    <Image src="/images/whatsapp-icon.png" alt="WhatsApp icon" layout="fill" objectFit="cover" priority quality={30} />
                  </div>
                </a>

                <div>
                  <p className="text-[#17171B]">or contact us </p>
                  <span className="text-black">to</span>{" "}
                  <Link href="mailto:info@xessevents.com" className="text-black underline hover:text-[#D10003]" >
                    info@xessevents.com
                  </Link>
                </div>
              </div>
            </div>
            <p className="text-left lg:text-[20px] md:text-lg py-2 text-gray font-sans text-black ps-4">
              Get your <span className="text-[#e21f2c] font-bold">FREE</span> 3D design & consultation
            </p>
            <div className="py-5 md:py-10 lg:p-3">
              <form onSubmit={handleSubmit} className="text-black">
                <div>
                  <input type="text" id="companyName" value={formData.companyName} onChange={handleChange} className="bg-[#faf8f8] w-full p-2 mt-2 border-b-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e21f2c]" placeholder={contactSec.compnyNameLbl || "Company Name*"} />
                </div>
                <div>
                  <input type="text" id="name" value={formData.name} onChange={handleChange} className="bg-[#faf8f8] w-full p-2 mt-2 border-b-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e21f2c]" placeholder={contactSec.nameLbl || "Name*"} />
                </div>
                <div>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} className="bg-[#faf8f8] w-full p-2 mt-2 border-b-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e21f2c]" placeholder={contactSec.emailLbl || "Official Email Id*"} />
                </div>
                <div>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="bg-[#faf8f8] w-full p-2 mt-2 border-b-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e21f2c]" placeholder={contactSec.contactLbl || "Contact No*"} />
                </div>
                <div>
                  <textarea id="message" value={formData.message} onChange={handleChange} aria-label={contactSec.messageLbl || "Your Message"} className="bg-[#faf8f8] w-full p-2 mt-2 border-b-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e21f2c]"
                    placeholder={contactSec.messageLbl || "Type Your Message Here!"} rows={4} />
                </div>
                {statusMessage.text && (
                  <p className={`text-center mt-2 ${statusMessage.type === "success" ? "text-green-500" : "text-red-500"}`} >
                    {statusMessage.text}
                  </p>
                )}
                <div className="flex justify-center items-left">
                  <button type="submit" disabled={!isFormValid} className={`w-1/2 py-2 mt-4 rounded-md transition-all duration-200 ${isFormValid ? "bg-[#e21f2c] text-white hover:bg-gray-300 hover:text-black cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} >
                    {contactSec.btnlabel || "Schedule a call"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="relative lg:h-[35rem] flex justify-center items-center overflow-hidden mt-5 md:mt-10 lg:mt-0">
            <video autoPlay loop muted playsInline className="w-[22rem] md:w-[35rem] lg:w-[40rem] 3xl:w-[50rem] h-full object-cover rounded-lg shadow-lg" >
              <source src="/videos/Xess_Exhibitions_And_Stands.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <meta itemProp="name" content="Xess Exhibitions And Stands" />
            <meta itemProp="description" content="Watch our video showcasing Xess Exhibitions and Stands." />
            <meta itemProp="thumbnailUrl" content="/images/video-thumbnail.jpg" />
            <meta itemProp="uploadDate" content="2023-10-01" />
            <meta itemProp="contentUrl" content="/videos/Xess_Exhibitions_And_Stands.mp4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
