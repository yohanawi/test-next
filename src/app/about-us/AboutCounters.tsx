"use client";

import { useEffect, useState } from "react";
import type { CounterItem } from "@/types/about";

interface AboutCountersProps {
    counters?: CounterItem[];
}

function AnimatedCounter({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
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

    return (
        <span className="text-xl md:text-2xl lg:text-3xl text-[#D13239]">
            {count}+
        </span>
    );
}

export default function AboutCounters({ counters = [] }: AboutCountersProps) {
    if (!counters.length) {
        return null;
    }

    return (
        <section className="relative bg-[#f6f6f6] lg:pt-16 pt-10">
            <div className="grid items-center justify-center grid-cols-2 gap-4 mx-10 font-sans font-normal lg:grid-cols-4 lg:p-4 lg:mx-52 md:mx-40">
                {counters.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="flex flex-col items-start justify-start w-48 p-4 text-left border-t-2">
                        <AnimatedCounter value={item.count} />
                        <span className="text-sm lg:text-[16px] py-2 lg:py-5 text-[#080B0F]">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
