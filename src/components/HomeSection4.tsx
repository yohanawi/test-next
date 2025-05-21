"use client";

import { GET_HOME_PAGE_DATA } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/legacy/image";
import { useState } from "react";

export default function HomeSection4() {

  const [, setHoveredIndex] = useState<number | null>(null);
  const { locale } = useSelector((state: RootState) => state.locale);
  const { data } = useQuery(GET_HOME_PAGE_DATA, { variables: { locale }, });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
  const homesection2 = data?.homePages?.data?.[0]?.attributes || {};
  const { HomeSec3 } = homesection2 || {};
  const { image1, image2, image3, image4 } = HomeSec3 || {};

  const images = [
    image1?.data?.attributes?.url ? `${baseUrl}${image1.data.attributes.url}` : "/images/H02.jpg",
    image2?.data?.attributes?.url ? `${baseUrl}${image2.data.attributes.url}` : "/images/H03.jpg",
    image3?.data?.attributes?.url ? `${baseUrl}${image3.data.attributes.url}` : "/images/H07.jpg",
    image4?.data?.attributes?.url ? `${baseUrl}${image4.data.attributes.url}` : "/images/H08.jpg",
  ];

  return (
    <section className="py-8 bg-white lg:py-20 md:py-10">
      <div className="container px-6 mx-auto">
        <h2 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20 font-bold font-sans">
          {homesection2?.HomeSec2?.title || "Your Trusted Partner for"}
        </h2>
        <p className="mt-2 font-sans text-xl font-bold text-center text-black capitalize md:text-3xl lg:text-3xl md:mx-20">
          {homesection2?.HomeSec2?.subTitle || "Exhibition Stands & Event Production in Dubai since 2010"}
        </p>
        <div className="lg:mx-48 3xl:mx-[6rem] md:mx-20 mx-10 3xl:py-2 text-center pb-8 md:pb-12 lg:pb-20">
          <p className="mt-4 text-xs text-gray-700 md:text-lg lg:text-base" dangerouslySetInnerHTML={{
            __html: homesection2?.HomeSec2?.description || "XESS Exhibitions & Events takes pride in bringing your exhibition ideas into stunning and unique exhibition stands that creates a positive impact while making your brand stand out within the industry. We prioritize meeting your expectations ensuring client satisfaction throughout our exhibition stands. We are an exhibition stand and event production company based in Dubai since 2010 serving our clientele with the best skills our team of experts consist of. ",
          }} />
        </div>
      </div>
      <div className="lg:mx-48 mx-10 md:mx-20 3xl:mx-[17rem] 3xl:pt-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-black text-2xl md:text-4xl lg:text-5xl font-bold font-sans text-center lg:text-left lg:max-w-[30rem]"
                dangerouslySetInnerHTML={{
                  __html: homesection2?.HomeSec3?.title || "XESS Exhibition Services in <span style='color: #EA2127;'>Dubai</span>",
                }}>
              </h2>
              <div className="lg:py-8 py-5 text-sm text-[#3E444A] 3xl:text-base">
                <p>
                  {homesection2?.HomeSec3?.description || "We create your ideas into world-class exhibits, adhering to details precisely to ensure that every aspect of the exhibition stand design aligns perfectly with your brand identity. We offer turnkey exhibition stands across Dubai, from concept to dismantling we handle everything in-house, crafting bespoke exhibition stands for various industries and brands offering custom stands, modular stands, country pavilions, and trade show booths."}
                </p>
                <p className="mt-4"
                  dangerouslySetInnerHTML={{
                    __html: homesection2?.HomeSec3?.description2 || "XESS Exhibitions & Events is also a trusted partner in event production services including corporate events, weddings, launch events, sports events, and more. Bringing ideas to life, we craft unique stages, backdrops, and display stands taking your event to the pinnacle on your special days.<br/><br/> Stand out at every exhibition! Make your exhibition or event a show- stopping experience where we bring your imagination to reality.",
                  }} />
              </div>
              <div className="grid gap-4 text-xs text-black md:grid-cols-2 3xl:text-sm">
                {(homesection2?.HomeSec3?.ExhiList?.length > 0 ? homesection2?.HomeSec3?.ExhiList : [
                  { lable: "EXHIBITION STAND DESIGN" },
                  { lable: "STORAGE & REBUILDING" },
                  { lable: "EXHIBITION STAND BUILDING" },
                  { lable: "RETAIL KIOSKS" },
                ]
                ).map((item: { lable: string }, index: number) => (
                  <div key={index} className="flex items-center gap-6">
                    <Image src="/images/correct-icon.png" alt="Correct Icon" width={17} height={17} layout="fixed" priority quality={30} />
                    {item.lable}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 max-w-[900px] w-full p-5">
              {images.map((src, index) => (
                <div key={index} className="block w-full overflow-hidden scaling-image" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} >
                  <div className="overflow-hidden transition-transform transform scale-100 frame duration-350 aspect-square hover:scale-95">
                    <div className="relative w-full overflow-hidden shadow-md group">
                      <Image src={src} alt={`Exhibition ${index + 1}`} width={800} height={800} layout="responsive" objectFit="cover" priority={index === 0} quality={30} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="transition-transform transform scale-100 duration-350 hover:scale-110" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
