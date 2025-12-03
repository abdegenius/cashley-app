"use client";
import React from "react";
import Slider from "react-slick";
import { services } from "@/utils/string";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ServicesSlider() {
    const sliderServices = services.filter((s) => s.featured && s.slider);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
        centerMode: true,
        centerPadding: "20px",
        responsive: [
            { breakpoint: 640, settings: { slidesToShow: 1, centerPadding: "10px" } },
            { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "20px" } },
            { breakpoint: 1280, settings: { slidesToShow: 3, centerPadding: "30px" } },
        ],
    };

    return (
        <div className="w-full rounded-2xl">
            <Slider {...settings}>
                {sliderServices.map((service) => {
                    const { title, subtitle } = service.slider!;
                    const Icon = service.icon;

                    return (
                        <div key={service.id} className="py-3 px-1">
                            <div className="rounded-2xl p-6 bg-purple-900 text-purple-200 shadow-lg flex flex-col gap-4 h-full border border-purple-800">

                                {/* Icon + Title */}
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-purple-800 text-purple-200 flex items-center justify-center">
                                        <Icon size={26} />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold text-purple-100">{title}</span>
                                        <span className="text-sm text-purple-400">{subtitle}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}
