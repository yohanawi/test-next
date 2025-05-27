"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomeSection5() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const refElement = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (refElement) {
      observer.observe(refElement);
    }

    return () => {
      if (refElement) {
        observer.disconnect();
      }
    };
  }, []);

  const Counter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);

      const interval = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(interval);
    }, [value]);

    return <span className="font-bold">${count.toLocaleString()}</span>;
  };

  return (
    <section id="home-section-5" ref={sectionRef} className="relative py-10 md:py-16 lg:py-20 aspect-[16/9] md:aspect-[21/9] lg:aspect-[4/1]" >
      <Image src="/images/exhibition-stand-builder-hero1.webp" alt="Exhibition Stand" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw" priority quality={40} style={{ objectFit: "cover", zIndex: 0 }} />

      <div className="relative z-10">
        <div className="bg-[#E5E5E5] bg-opacity-75 mx-5 md:mx-20 lg:mx-40 3xl:mx-64 rounded-3xl ">
          <div className="grid gap-10 p-8 lg:grid-cols-2">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-sans text-2xl font-bold text-gray-800 md:text-4xl">Pricing Guide</h2>
              <p className="mt-4 text-sm text-black md:mt-5 lg:mt-2 3xl:text-base">
                Our all-inclusive service package covers everything from free design to approval, stand design and construction, installation, and dismantling.
              </p>
              <p className="mt-4 text-sm text-black 3xl:text-base">
                Generally, our exhibition stand prices vary according to its
                size and other specifications. Smaller stands typically range
                from approx. $2,500 to $5,500, while medium-sized stands fall
                between approx. $6,000 and $16,000, and larger stands start at
                approx. $16,000 and can range up to $35,000, depending on its
                specifications.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center p-2 bg-white rounded-full">
                  <Image src="/images/clock-cion.png" alt="Clock icon" title="Clock icon" className="w-10" width={30} height={30} priority />
                  <p className="text-gray-700 ps-2 md:ps-5">
                    <strong className="text-[#d93d41]">70%</strong> Faster with our in-house production team
                  </p>
                </div>
                <div className="flex items-center p-2 bg-white rounded-full">
                  <Image src="/images/money-icon.png" alt="Money icon" title="Money icon" className="w-10" width={30} height={30} priority />
                  <p className="text-gray-700 ps-2 md:ps-5">
                    <strong className="text-[#d93d41]">100%</strong> Savings on stand design
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/request-quotation" className="text-black font-semibold flex items-center underline-offset-4 hover:text-[#d93d41] hover:underline">
                  Request an Accurate Estimate ➔
                </Link>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="p-4 bg-white rounded-lg shadow-lg md:p-8">
                <h3 className="text-xl font-bold text-gray-800 uppercase">
                  Stand Dimensions
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Choose the perfect size for your exhibition needs. Our custom stands are designed to maximize your brand presence regardless of dimensions.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="px-4 py-2 bg-[#262626] text-white rounded-full flex flex-col md:justify-between max-w-[12rem] md:max-w-[24rem] md:flex-row md:items-center leading-none">
                    <p className="font-semibold">
                      SMALL STAND <br />
                      <span className="text-xs">(6 Sqm to 16 Sqm)</span>
                    </p>
                    <span className="font-bold">
                      <Counter value={2500} /> - <Counter value={5500} />
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-gray-400 text-white rounded-full flex md:justify-between md:max-w-[28rem] max-w-[15rem] md:items-center leading-none flex-col md:flex-row">
                    <p className="font-semibold">
                      MEDIUM STAND <br />
                      <span className="text-xs">(18 Sqm to 50 Sqm)</span>
                    </p>
                    <span className="font-bold">
                      <Counter value={6000} /> - <Counter value={16000} />
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-red-600 text-white rounded-full flex md:justify-between max-w-[35rem] md:items-center leading-none flex-col md:flex-row">
                    <p className="font-semibold">
                      LARGE STAND <br />
                      <span className="text-xs">(50 Sqm to 100 Sqm)</span>
                    </p>
                    <span className="font-bold">
                      <Counter value={16000} /> - <Counter value={35000} />
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                * Prices are approximate and may vary based on specific requirements, location, and exhibition specifications. Contact us for a personalized quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
