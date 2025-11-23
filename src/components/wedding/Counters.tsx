"use client";

import { useEffect, useState } from "react";

const Counter = ({ value }: { value: number }) => {
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
        <span className="text-2xl font-bold text-red-600 md:text-4xl">
            {count}+
        </span>
    );
};

export default function Counters({ counters }: { counters?: { label: string; value: number }[] }) {

    if (!counters || counters.length === 0) {
        return null;
    }
    return (
        <div className="grid grid-cols-2 gap-8 py-5 text-left md:py-10" style={{ fontFamily: "Sora, sans-serif" }} >
            {counters.map((stat: { value: number; label: string }, i: number) => (
                <div key={i} className="flex flex-col text-left">
                    <Counter value={stat.value} />
                    <span className="text-xs tracking-wide text-black md:text-sm">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
}