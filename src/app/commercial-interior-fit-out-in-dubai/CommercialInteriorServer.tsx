import ContactForm from "@/components/Contactform";
import CommercialInteriorClient from "./CommercialInteriorClient";
import Image from "next/image";
import Link from "next/link";

export default function CommercialInteriorServer({ mainFitOut }: { mainFitOut: any }) {
    const { FitOutHead } = mainFitOut;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = FitOutHead?.image?.data?.attributes?.url ? `${baseUrl}${FitOutHead.image.data.attributes.url}` : "/images/Banner.jpg";

    const portfolioImages = mainFitOut?.FitOutPort?.InterGallery?.map(
        (item: { image: { data: { attributes: { url: string } } } }) => ({
            src: item?.image?.data?.attributes?.url ? `${baseUrl}${item.image.data.attributes.url}` : "",
        })
    ) || [];

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {FitOutHead?.heading || "Commercial interior fit-out"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={FitOutHead?.breadcrumb?.link1 || "/"} className="px-4 uppercase" >
                            {FitOutHead?.breadcrumb?.SubHead1 || "Home"}
                        </Link>
                        /
                        <Link href={FitOutHead?.breadcrumb?.link2 || "/commercial-interior-fit-out-in-dubai"} className="px-4 uppercase" >
                            {FitOutHead?.breadcrumb?.SubHead2 || "Commercial interior fit-out"}
                        </Link>
                    </div>
                </div>
            </section>

            <CommercialInteriorClient mainFitOut={mainFitOut} />

            <section className="bg-[#f6f6f6] text-center lg:py-16 md:py-16 py-10">
                <div className="container px-6 mx-auto">
                    <h2 className="text-[#EA2127] text-center text-xl md:text-3xl lg:text-4xl md:mx-20">
                        {mainFitOut?.topic || "GET YOUR OWN"}
                    </h2>
                    <p className="text-xl text-center text-black uppercase md:text-2xl lg:text-3xl md:mx-20">
                        {mainFitOut?.SubTopic || "CUSTOM EXHIBITION STAND Builders"}
                    </p>
                    <div className=" lg:mx-44 md:mx-20 3xl:mx-[6rem] mx-10 3xl:py-5">
                        <p className="mt-4 text-xs text-gray-700 md:text-base" dangerouslySetInnerHTML={{ __html: mainFitOut?.description }}></p>
                    </div>
                </div>
            </section>

            <section className="py-10 bg-white lg:pb-10 lg:pt-10">
                <div className="mx-20 text-center md:mx-0">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                        {mainFitOut?.FitOutPort?.heading || "Take a look at some of our work"}
                    </h2>
                    <span className="text-[#E42D39] text-xs md:text-base">
                        {mainFitOut?.FitOutPort?.SubHeading || "Lorem Ipsum is simply dummy text of the printing"}
                    </span>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 lg:pt-10 lg:pb-5 md:pb-16 pb-10 pt-10 lg:mx-60 mx-8 md:mx-40 3xl:mx-[18rem]">
                    {portfolioImages.map((item: { src: string }, index: number) => (
                        <div key={index} className="relative w-full h-[18rem] md:h-[14rem] lg:h-[20rem] group overflow-hidden" >
                            <Image src={item.src} alt={`Portfolio ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/portfolio" className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all" >
                        {mainFitOut?.FitOutPort?.BtnLabel || "view more portfolio"}
                    </Link>
                </div>
            </section>

            <section className="pt-5 pb-10 bg-white md:pb-20">
                <h2 className="lg:text-4xl md:text-3xl text-xl text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[17rem] md:mx-24 mx-14 lg:pb-8"
                    dangerouslySetInnerHTML={{
                        __html: mainFitOut?.FitOutFaq?.FaqTitle || "How Can you build <span style='color: #EA2127;'>your stand</span>",
                    }}>
                </h2>
                <CommercialInteriorClient mainFitOut={mainFitOut} isAccordion={true} />
            </section>

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}