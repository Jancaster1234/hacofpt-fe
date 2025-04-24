// src/app/[locale]/_components/Services.tsx
"use client";
import { useRef } from "react";
import { useTranslations } from "@/hooks/useTranslations";

const Services = () => {
  const t = useTranslations("services");
  const scrollRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      illustration: "/images/service/manage.png",
      title: t("service1.title"),
      subtitle: t("service1.subtitle"),
    },
    {
      illustration: "/images/service/organization.png",
      title: t("service2.title"),
      subtitle: t("service2.subtitle"),
    },
    {
      illustration: "/images/service/collaboration.png",
      title: t("service3.title"),
      subtitle: t("service3.subtitle"),
    },
    {
      illustration: "/images/service/insights.png",
      title: t("service4.title"),
      subtitle: t("service4.subtitle"),
    },
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-10">
        {/* Left Content */}
        <div className="w-full md:w-1/3 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-sm font-semibold text-pink-500 dark:text-pink-400 tracking-wide uppercase">
            {t("sectionTitle")}
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {t("sectionDescription")}
          </p>
        </div>

        {/* Right Cards with Slider */}
        <div className="w-full md:w-2/3 relative">
          {/* Slider Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="min-w-[260px] sm:min-w-[280px] bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center snap-center text-center transition-colors duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex justify-center items-center mb-4">
                  <img
                    src={service.illustration}
                    alt={service.title}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {service.title.split(" ")[0]} <br />{" "}
                  {service.title.split(" ").slice(1).join(" ")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {service.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hidden md:block hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hidden md:block hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Mobile Scroll Indicators */}
          <div className="flex justify-center space-x-2 mt-4 md:hidden">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-6 h-1 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="w-6 h-1 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
