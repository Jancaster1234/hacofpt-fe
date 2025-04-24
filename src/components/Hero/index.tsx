// src/components/Hero/index.tsx
"use client";
import { useTranslations } from "@/hooks/useTranslations";

const Hero = () => {
  const t = useTranslations("hero");

  return (
    <section className="relative bg-white dark:bg-gray-900 pt-12 pb-16 md:py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 gap-8 md:gap-12 lg:gap-16">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          {/* Explore Hackathon Button */}
          <span className="bg-gray-900 dark:bg-gray-800 text-yellow-400 font-bold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm inline-block mb-4 shadow-sm">
            {t("exploreHackathon")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
          <button className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full font-medium transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
            {t("getStarted")}
          </button>
        </div>

        {/* Right Images & Background SVG */}
        <div className="w-full md:w-1/2 flex justify-center relative mt-8 md:mt-0">
          {/* Background World SVG */}
          <div className="absolute inset-0 flex justify-center items-center -z-10">
            <img
              src="/images/hero/world-map.svg"
              className="w-64 sm:w-80 opacity-10 dark:opacity-5"
              alt={t("worldBackgroundAlt")}
            />
          </div>

          {/* Image Layout: 2-Column Grid */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center w-full max-w-md md:max-w-lg">
            {/* Left Column (6/12 width) */}
            <div className="col-span-6 flex flex-col gap-2 sm:gap-4">
              <img
                src="/images/hero/hackathon1.png"
                className="w-full rounded-lg shadow-lg"
                alt={t("hackathon1Alt")}
              />
              <img
                src="/images/hero/hackathon2.png"
                className="w-full rounded-lg shadow-lg"
                alt={t("hackathon2Alt")}
              />
            </div>

            {/* Right Column (6/12 width, Centered Image) */}
            <div className="col-span-6 flex justify-center">
              <img
                src="/images/hero/hackathon3.png"
                className="w-full rounded-lg shadow-lg"
                alt={t("hackathon3Alt")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Mobile Only */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full -ml-12 -mb-12 md:hidden opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 rounded-full -mr-16 -mt-16 md:hidden opacity-40"></div>
    </section>
  );
};

export default Hero;
