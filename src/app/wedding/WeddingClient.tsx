import Image from "next/image";
import Link from "next/link";
import HeroSlider from "../../components/wedding/HeroSlider";
import ServicesSlider from "../../components/wedding/ServicesSlider";
import ContactForm from "@/components/Contactform";
import AccordionClient from "../../components/wedding/_AccordionClient";
import Counters from "../../components/wedding/Counters";

interface WeddingClientProps {
    mainWedding: any;
}

export default function WeddingClient({ mainWedding }: WeddingClientProps) {
    const { Header } = mainWedding || {};
    const accordion = mainWedding?.WeddingFaq?.ConFaq || [];
    const WeddingSec3 = mainWedding?.WeddingSec3;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";
    const bannerImage = Header?.image?.data?.attributes?.url ? `${baseUrl}${Header.image.data.attributes.url}` : "/images/Banner.jpg";
    const stats = mainWedding?.WeddingSec2?.NumberBox?.map(
        (item: { count: number; label: string }) => ({
            value: item.count,
            label: item.label,
        })
    ) || [];

    const portfolioImages = mainWedding?.WeddingPort?.InterGallery?.map(
        (item: { image: { data: { attributes: { url: string } } } }) => ({
            src: item?.image?.data?.attributes?.url
                ? `${baseUrl}${item.image.data.attributes.url}`
                : "",
        })
    ) || [];

    const wedSlides: string[] = mainWedding?.WeddingSec2?.WedSlider?.map(
        (item: { image: { data: { attributes: { url: string } } } }) =>
            `${baseUrl}${item.image.data.attributes.url}`
    ) || [];

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src={bannerImage} alt="Banner" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70" />
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-xl font-semibold text-white uppercase lg:text-5xl md:text-3xl">
                        {Header?.heading || "Wedding Events"}
                    </h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href={Header?.breadcrumb?.link1 || "/"} className="px-4 uppercase">
                            Home
                        </Link>
                        /
                        <Link href={Header?.breadcrumb?.link2 || "/wedding"} className="px-4 uppercase">
                            {Header?.breadcrumb?.SubHead2 || "wedding events"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-8 py-8 lg:py-10 bg-[url('/images/about.jpg')] bg-cover bg-center">
                <div className="lg:ms-[10rem] ms-5 md:ms-20 3xl:mx-[15rem]">
                    <div className="container mx-auto">
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="lg:text-6xl md:text-[50px] text-[32px] font-bold leading-none text-black max-w-[800px]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            mainWedding?.WeddingSec2?.Heading ||
                                            "Wedding Event <span style='color: #EA2127;'>Contractors</span>",
                                    }}
                                />
                                <p className="text-black font-light lg:text-[24px] md:text-[18px] max-w-[550px] pt-4 lg:pt-0">
                                    {mainWedding?.WeddingSec2?.SubHeading}
                                </p>
                                <Counters counters={stats} />
                            </div>

                            <div className="flex lg:w-full lg:my-10">
                                <HeroSlider images={wedSlides} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServicesSlider baseUrl={baseUrl} section={WeddingSec3} />

            <section className="py-10 bg-white lg:py-14">
                <div className="text-center">
                    <h2 className="pb-2 text-xl text-black lg:text-4xl md:text-3xl">
                        {mainWedding?.WeddingPort?.heading || "Take a look at some of our work"}
                    </h2>
                    <span className="text-[#E42D39] text-xs md:text-base">
                        {mainWedding?.WeddingPort?.SubHeading || "Lorem Ipsum is simply dummy text of the printing"}
                    </span>
                </div>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4 lg:pt-10 lg:pb-10 pb-10 pt-10 lg:mx-60 mx-8 md:mx-20 3xl:mx-[18rem]">
                    {portfolioImages.map((item: { src: string }, index: number) => (
                        <div key={index} className="relative w-full h-[10rem] md:h-[12rem] lg:h-[20rem] group overflow-hidden">
                            <Image
                                src={item.src}
                                alt={`Portfolio ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <Link
                        href="/portfolio"
                        className="uppercase border border-[#E21F2C] hover:border-[#000] text-[#E21F2C] hover:bg-[#E21F2C] hover:text-white text-xs md:text-xs md:px-3 py-2 px-3 rounded-md shadow-lg lg:text-xs font-extrabold mt-1 transition-all"
                    >
                        {mainWedding?.WeddingPort?.BtnLabel || "view our portfolio"}
                    </Link>
                </div>
            </section>

            <AccordionClient title={mainWedding?.WeddingFaq?.FaqTitle || "FAQ's"} items={accordion} />

            <section className="relative w-full">
                <ContactForm />
            </section>
        </>
    );
}
