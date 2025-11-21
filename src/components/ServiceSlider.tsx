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
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "20px",
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 640, settings: { slidesToShow: 1, centerPadding: "10px" } },
            { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "20px" } },
            { breakpoint: 1280, settings: { slidesToShow: 3, centerPadding: "30px" } },
        ],
    };

    return (
        <div className="w-full mt-2 relative">
            {/* <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow-lg">
                Quick Services
            </h2> */}
            <Slider {...settings}>
                {sliderServices.map((service) => {
                    const { title, subtitle, tagline, color } = service.slider!;
                    const Icon = service.icon;

                    return (
                        <div key={service.id} className="py-3 relative">
                            <div
                                className={`rounded-3xl p-6 flex flex-col justify-between text-white shadow-xl hover:shadow-2xl ${color} hover:scale-105 transition-transform duration-300 relative overflow-hidden`}
                            >
                                {/* Animated Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-20 animate-[shimmer_5s_linear_infinite] pointer-events-none rounded-3xl"></div>

                                {/* Icon + Service Name */}
                                <div className="flex items-start justify-start gap-4 mb-2">
                                    <div className="bg-white/20 p-3 rounded-full flex items-center justify-center shadow-inner transition-transform duration-500 hover:scale-110">
                                        <Icon size={30} className="transition-transform duration-500 hover:animate-bounce" />
                                    </div>
                                    {/* <h3 className="text-lg sm:text-xl font-bold drop-shadow-md">{service.name}</h3> */}
                                    {/* Slider Content */}
                                    <div className="flex flex-col gap-1 mb-2">
                                        <span className="text-lg sm:text-xl font-semibold">{title}</span>
                                        <span className="text-sm sm:text-md text-white/80">{subtitle}</span>
                                        <span className="text-sm sm:text-md text-white/70 italic">{tagline}</span>
                                    </div>
                                </div>


                                {/* Explore Button */}
                                {/* {service.link && (
                                    <div className="flex justify-end mt-auto">
                                        <a
                                            href={service.link}
                                            className="bg-white/25 hover:bg-white/40 px-4 py-2 rounded-full text-sm sm:text-md font-semibold text-white backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            Explore
                                        </a>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    );
                })}
            </Slider>

            {/* Shimmer animation keyframes */}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-[shimmer_5s_linear_infinite] {
          animation: shimmer 5s linear infinite;
        }
      `}</style>
        </div>
    );
}
