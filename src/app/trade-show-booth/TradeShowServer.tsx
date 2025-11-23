import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/Contactform";
import HomeEventSection from "@/components/HomeEventSection";
import AccordionClient from "./_AccordionClient";

export default function TradeShowServer({ data }: { data: any }) {

    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://cms.xessevents.com";

    const {
        TradeHead,
        TradeShowSec2,
        TradeProcess,
        TradeFaq,
        BannerCard,
        Image: TradeMainImage,
        Banner,
    } = data || {};

    const bannerImage = TradeHead?.image?.data?.attributes?.url ? `${base}${TradeHead.image.data.attributes.url}` : "/images/Banner.jpg";
    const processImage = TradeMainImage?.data?.attributes?.url ? `${base}${TradeMainImage.data.attributes.url}` : "/images/trade4.png";
    const banner2Image = Banner?.data?.attributes?.url ? `${base}${Banner.data.attributes.url}` : "/images/Rectangle 7.png";

    const cardList = TradeShowSec2?.TradeCard?.map((item: any) => ({
        title: item?.label,
        image: item?.Image?.data?.attributes?.url ? `${base}${item.Image.data.attributes.url}` : "/images/default-card.jpg",
    })) || [];

    const accordionList = TradeFaq?.ConFaq || [];

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center justify-center">
                <Image src={bannerImage} alt="Banner" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 text-center lg:mt-40">
                    <h1 className="text-xl font-semibold text-white uppercase md:text-3xl lg:text-5xl">
                        {TradeHead?.heading}
                    </h1>
                    <div className="flex justify-center gap-2 py-3 text-xs text-white uppercase lg:text-sm">
                        <Link href={TradeHead?.breadcrumb?.link1 || "/"}>
                            {TradeHead?.breadcrumb?.SubHead1}
                        </Link>
                        /
                        <Link href={TradeHead?.breadcrumb?.link2 || "/trade-show-booth"}>
                            {TradeHead?.breadcrumb?.SubHead2}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#f6f6f6] text-center py-10 md:py-14">
                <div className="container px-6 mx-auto">
                    <h2 className="max-w-lg mx-auto text-xl font-semibold text-black md:text-3xl lg:text-4xl"
                        dangerouslySetInnerHTML={{
                            __html: TradeShowSec2?.Heading,
                        }} />

                    <div className="grid gap-6 mt-10 lg:grid-cols-3 lg:mx-52 md:mx-40">
                        {cardList.map((c: any, i: number) => (
                            <div key={i} className="overflow-hidden rounded-lg shadow-lg group">
                                <Image src={c.image} alt={c.title} width={500} height={500} className="w-full transition-transform group-hover:scale-105" />
                                <div className="bg-[#fafafa] p-3 text-sm md:text-base group-hover:text-[#E21F2C] font-bold text-black">
                                    {c.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/free-design">
                        <button className="mt-10 uppercase bg-white border border-[#E21F2C] text-[#E21F2C] px-5 py-2 text-xs font-semibold rounded-md hover:bg-[#E21F2C] hover:text-white transition">
                            Get a Quote
                        </button>
                    </Link>
                </div>
            </section>

            <section className="bg-[#f6f6f6] font-sans">
                <div className="container px-6 py-6 mx-auto lg:py-20 md:py-10">
                    <div className="mx-6 lg:mx-52 md:mx-24">
                        <h2 className="text-xl font-normal text-center text-gray-900 lg:text-4xl md:text-3xl"
                            dangerouslySetInnerHTML={{ __html: data?.Heading }} />
                        <p className="mt-4 text-xs text-center text-gray-700 md:text-base"
                            dangerouslySetInnerHTML={{
                                __html: data?.description1,
                            }} />
                    </div>
                </div>

                <div className="mt-10 bg-[#D8DDE0]">
                    <div className="grid items-stretch lg:grid-cols-2">
                        <div className="flex items-center justify-center lg:justify-end">
                            <div className="relative w-[300px] md:w-[500px] h-[250px] md:h-[450px]">
                                <Image src={processImage} alt="Trade Image" fill className="object-cover" />
                            </div>
                        </div>

                        <div className="p-8 lg:mr-40">
                            <h2 className="text-lg text-black uppercase md:text-2xl"
                                dangerouslySetInnerHTML={{ __html: data?.heading2 }} />
                            <p className="mt-4 text-sm text-black"
                                dangerouslySetInnerHTML={{ __html: data?.description2 }} />
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-white">
                <div className="relative w-full lg:h-[400px] h-[150px] md:h-[200px]">
                    <div className="relative w-full h-full">
                        <Image src={banner2Image} layout="fill" objectFit="cover" alt="Banner" objectPosition="bottom" />
                    </div>
                </div>
            </section>

            <section className="bg-[#41474D] text-white lg:py-20 md:py-12 py-10 px-6 md:px-32 lg:px-56 3xl:px-[25rem]">
                <div className="grid lg:grid-cols-2 lg:gap-20">
                    <div>
                        <h2 className="text-xl font-bold md:text-3xl lg:text-4xl">{TradeProcess?.title}</h2>
                        <h5 className="py-4 md:text-lg text-[#EA2127]">{TradeProcess?.subtitle}</h5>
                        <p
                            className="text-gray-300"
                            dangerouslySetInnerHTML={{
                                __html: TradeProcess?.description,
                            }}
                        />
                    </div>
                    <div className="relative w-full lg:w-[40rem] md:h-[20rem] h-[12rem] lg:h-96">
                        <Image src="/images/XESS-Process-Road-map.png" layout="fill" alt="Event 1" />
                    </div>
                </div>
            </section>

            <HomeEventSection />

            <section className="bg-[#f6f6f6] md:py-10 py-4">
                <div className="relative h-[170px] md:h-[150px] lg:h-[140px] lg:px-56 md:px-32 lg:mx-8 px-10 3xl:px-[350px]">
                    <div className="relative w-full h-full">
                        <Image src="/images/Group 11.png" alt="Exhibition Stand" layout="fill" objectFit="cover" className="rounded-md" />
                        <div className="absolute inset-0 flex flex-col items-center px-6 py-2 my-4 lg:justify-between md:px-12 lg:px-20 lg:flex-row md:my-4">
                            <div className="text-center text-white lg:text-left">
                                <h2 className="text-sm font-semibold md:text-base lg:text-xl">
                                    {BannerCard?.lable1}
                                </h2>
                                <p className="py-2 text-xs md:text-sm">{BannerCard?.lable2}  </p>
                            </div>

                            {BannerCard?.button?.[0] && (
                                <Link href={BannerCard.button[0].link || "/free-design"}>
                                    <button className="bg-white text-black text-xs md:px-4 py-2 rounded-md shadow-lg hover:bg-[#EA2127] hover:text-white font-bold">
                                        {BannerCard.button[0].label}
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <AccordionClient title={TradeFaq?.FaqTitle} items={accordionList} />

            <ContactForm />
        </>
    );
}
