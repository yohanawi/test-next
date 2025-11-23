"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function AccordionClient({
    title,
    items,
}: {
    title: string;
    items: { question: string; answers: string }[];
}) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="bg-[#D8DDE0] py-10">
            <h2 className="max-w-[4.2rem] text-lg text-left font-normal uppercase text-black lg:mx-[12rem] 3xl:mx-[19rem] md:mx-32 mx-14 bg-white rounded-full px-4 py-1"
                dangerouslySetInnerHTML={{ __html: title }}
            />

            <div className="grid lg:grid-cols-2 lg:mx-48 md:mx-32 3xl:mx-56">
                <div className="pt-8 mx-14 md:mx-0 3xl:mx-20">
                    <h2 className="text-xl text-black md:text-3xl lg:text-5xl">
                        Partner with the best exhibition stand contractors in Dubai
                    </h2>
                </div>
                <div className="w-full mt-5 space-y-2 lg:-mt-8 md:mt-10 md:mx-0 px-9 md:px-0">
                    {items.map((item, i) => {
                        const isOpen = open === i;

                        return (
                            <div key={i} className="border-[#00000056] text-black bg-white rounded-3xl">
                                <button className="flex items-center justify-between w-full p-1 text-lg font-medium text-left md:p-2 lg:p-4"
                                    onClick={() => setOpen(isOpen ? null : i)}>
                                    <span className="flex items-center gap-2 lg:gap-10 3xl:gap-16 md:text-lg text-xs lg:text-base ps-4 md:ps-7 font-bold lg:max-w-[30rem]">{item.question}</span>
                                    <motion.div animate={{ rotate: isOpen ? 360 : 0 }} transition={{ duration: 0.5 }}
                                        className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full" >
                                        {isOpen ? (
                                            <ArrowUp className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <ArrowDown className="w-5 h-5 text-gray-600" />
                                        )}
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="overflow-hidden" >
                                            <div className="p-4 border-t-2 bg-gray-50 rounded-b-3xl"
                                                dangerouslySetInnerHTML={{ __html: item.answers }}
                                            />
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
