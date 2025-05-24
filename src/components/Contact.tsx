"use client";

import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  return (
    <div className="fixed h-5 lg:-right-[114px] -right-[4.3rem] lg:top-8 lg:bottom-28 bottom-[4.5rem] lg:flex flex-col items-center z-[999] hidden">
      <div className="relative">
        <div className="bg-[#939ba0] text-white py-6 lg:px-[108px] px-[4rem] cursor-pointer -rotate-90">
          <span className="font-sans text-sm font-normal tracking-wider rotate-90">
            LET&apos;S TALK
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden -rotate-90 group lg:top-8">
          <div className="absolute bottom-0 left-0 w-full h-full transition-transform duration-500 ease-in-out transform translate-y-full bg-gray-800 group-hover:translate-y-0">
            <div className="flex flex-col items-center justify-center h-full text-white rotate-90 ">
              <Link href="contact-us">
                <div className="text-sm font-semibold bg-[#636260] py-3 px-1 uppercase hover:text-[#D10003]">
                  CONTACT
                </div>
              </Link>
              <div>
                <Link href="tel:+971553721525">
                  <div className="px-6 py-5 cursor-pointer relative hover:bg-[#939ba0d7] w-full">
                    <Image src="/images/tele.png" alt="tele icon" width={40} height={40} className="w-5 transition-transform duration-300 ease-in-out brightness-100 group-hover:invert group-hover:brightness-0" />
                  </div>
                </Link>
              </div>
              <div>
                <Link href="mailto:info@xessevents.com">
                  <div className="px-6 py-5 cursor-pointer relative hover:bg-[#939ba0d7] w-full">
                    <Image src="/images/message.png" alt="message icon" width={40} height={40} className="w-5 transition-transform duration-300 ease-in-out brightness-100 group-hover:invert group-hover:brightness-0" />
                  </div>
                </Link>
              </div>
              <Link href="#contactForm" passHref>
                <div className="bg-[#b21620] text-white px-3 py-2 text-sm uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#ee626c] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#ee626c] focus:ring-opacity-50 inline-block text-center cursor-pointer">
                  GRAB <br /> OFFER
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Link href="https://wa.me/+971553721525" target="_blank" rel="noopener noreferrer" className="absolute top-44 right-[114px] bg-[#6c757d] p-5 shadow-lg hover:bg-green-600 transition duration-300 hidden lg:block" >
        <Image src="/images/whatsapp.png" alt="WhatsApp" width={40} height={40} className="w-8 h-8 transition-transform duration-300 ease-in-out transform hover:scale-125" />
      </Link>
    </div>
  );
}
