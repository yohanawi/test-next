"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider({ images }: { images: string[] }) {
    if (!images || images.length === 0) return null;
    return (
        <Swiper
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.1}
            className="w-full h-auto"
        >
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <div className="relative w-full h-full overflow-hidden rounded-lg">
                        <Image
                            src={src}
                            alt={`Wedding ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
