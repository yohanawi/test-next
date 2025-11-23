"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Check, Minus, Plus } from "lucide-react";

type AccordionItem = {
    question: string;
    answers: string;
};

export default function AccordionClient({
    title,
    items,
}: {
    title: string;
    items: { question: string; answers: string }[];
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };
    return (
        <section className="bg-[#d8dde0] py-10">
            <h2 className="lg:text-4xl md:text-3xl text-xl text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[17rem] md:mx-24 mx-14 lg:pb-8"
                dangerouslySetInnerHTML={{ __html: title || "FAQ's", }}>
            </h2>
            <div className="flex items-center justify-center py-5 lg:py-0 lg:pb-10 md:py-8">
                <div className="w-full lg:max-w-6xl md:max-w-xl 3xl:max-w-[85rem] max-w-xs space-y-2">
                    {items.map((item: AccordionItem, index: number) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index} className="border-b-2 border-[#00000056] text-black" >
                                <button className="flex items-center justify-between w-full p-4 text-lg font-medium text-left" onClick={() => toggleAccordion(index)} >
                                    <div className="flex items-center gap-2 text-base lg:gap-10 3xl:gap-16 lg:text-lg">
                                        <Check className="text-black" />
                                        {item.question}
                                    </div>
                                    {isOpen ? (
                                        <Minus className="text-gray-600" />
                                    ) : (
                                        <Plus className="text-gray-600" />
                                    )}
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden" >
                                            <div className="p-4 bg-[#d8dde0]">
                                                <div className="lg:ms-10 ms-5">
                                                    {item.answers.split("\n").map((answer: string, i: number) => (
                                                        <p key={i} className="pl-5 list-disc" dangerouslySetInnerHTML={{ __html: answer }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
