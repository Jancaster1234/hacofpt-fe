// src/app/[locale]/_components/Services.tsx
"use client";
import { useRef } from "react";

const services = [
  {
    illustration: "/images/service/manage.png", // Replace with actual icons
    title: "Manage Registrations",
    subtitle: "Easy registration and progress tracking",
  },
  {
    illustration: "/images/service/organization.png",
    title: "Efficient Organization",
    subtitle: "Tools for scheduling and notifications",
  },
  {
    illustration: "/images/service/collaboration.png",
    title: "Team Collaboration",
    subtitle: "Seamless communication for teams",
  },
  {
    illustration: "/images/service/insights.png",
    title: "Real-time Insights",
    subtitle: "Track hackathon progress with analytics",
  },
];

const Services = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="md:w-1/3 text-center md:text-left">
          <h2 className="text-sm font-semibold text-pink-500 tracking-wide">
            SERVICES
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            A platform for managing hackathon competitions exclusively for FPTU
            students.
          </p>
        </div>

        {/* Right Cards with Slider */}
        <div className="md:w-2/3 relative">
          {/* Slider Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="min-w-[280px] bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center snap-center text-center"
              >
                <div className="w-16 h-16 flex justify-center items-center mb-4">
                  <img
                    src={service.illustration}
                    alt={service.title}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {service.title.split(" ")[0]} <br />{" "}
                  {service.title.split(" ").slice(1).join(" ")}
                </h3>
                <p className="text-gray-500 text-sm mt-2">{service.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hidden md:block"
          >
            ◀
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hidden md:block"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
