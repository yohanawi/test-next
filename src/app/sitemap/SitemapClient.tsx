import Link from "next/link";

const SiteMap = () => {
    return (
        <>

            <div className="min-h-screen p-8 py-20 bg-white md:py-36">
                <main className="max-w-4xl px-4 py-10 mx-auto">
                    <h1 className="mb-8 text-3xl font-bold text-black">HTML Sitemap</h1>
                    <section className="mb-10">
                        <h2 className="mb-2 text-xl font-semibold text-black">Main Pages</h2>
                        <ul className="pl-5 space-y-1 list-disc">
                            <li><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
                            <li><Link href="/about-us" className="text-blue-600 hover:underline">About Us</Link></li>
                            <li><Link href="/event-production" className="text-blue-600 hover:underline">Event Services</Link></li>
                            <li><Link href="/exhibition-calendar" className="text-blue-600 hover:underline">Exhibition Calendar</Link></li>
                            <li><Link href="/portfolio" className="text-blue-600 hover:underline">Portfolio</Link></li>
                            <li><Link href="/exhibition" className="text-blue-600 hover:underline">Exhibition Stand Services</Link></li>
                            <li><Link href="/contact-us" className="text-blue-600 hover:underline">Contact Us</Link></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-2 text-xl font-semibold text-black">Legal Pages</h2>
                        <ul className="pl-5 space-y-1 list-disc">
                            <li><Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link></li>
                        </ul>
                    </section>
                </main>
            </div>
        </>
    );
};

export default SiteMap;
