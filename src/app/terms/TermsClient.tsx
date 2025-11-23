import Image from "next/image";
import Link from "next/link";

export default function TermsClient({ termsData }: { termsData: { title?: string; description?: string } }) {
    const { title, description } = termsData || {};

    const sanitizeHtml = (html: string) => {
        return html?.replace(/font-family:[^;"]*;?/gi, "");
    };

    return (
        <>
            <section className="relative w-full lg:h-[400px] h-[300px] flex items-center text-center justify-center">
                <Image src="/images/Banner.jpg" layout="fill" objectFit="cover" alt="Banner" />
                <div className="absolute inset-0 bg-[#5a5a5a] opacity-70"></div>
                <div className="absolute mt-32 lg:mt-40">
                    <h1 className="mb-2 font-sans text-3xl font-semibold text-white uppercase lg:text-5xl">Terms & Condition</h1>
                    <div className="flex items-center justify-center py-2 text-xs text-center text-white lg:text-sm lg:py-5">
                        <Link href="/" className="px-4 uppercase">Home</Link>
                        /
                        <Link href="/terms" className="px-4 uppercase">Terms & Condition</Link>
                    </div>
                </div>
            </section>
            <section className="bg-[#f6f6f6] py-12">
                <div className="max-w-3xl px-4 mx-auto">
                    <h2 className="mb-6 text-3xl font-bold text-black">{title || "Terms & Condition"}</h2>
                    <p className="mb-4 font-medium text-black content-styled" dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || ""), }}></p>
                </div>
            </section>
        </>
    );
}
