// src/app/[locale]/_components/FeaturedHackathons.tsx
"use client";
import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
//TODO: {lv1} maybe change react-icons/fa to another approach, to minimize bundle size
const hackathons = [
  {
    title: "HACKCOVY - Online Hackathon",
    startDate: "24/04/2024",
    endDate: "26/04/2024",
    description:
      "HACKCOVY is an online hackathon designed to foster innovation.",
    image: "/images/featuredHackathons/hackathon1.png",
  },
  {
    title: "Hackathon 2024",
    startDate: "25/04/2024",
    endDate: "27/04/2024",
    description:
      "Join the most exciting hackathon of the year with top mentors!",
    image: "/images/featuredHackathons/hackathon2.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon3.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon4.png",
  },
];

const FeaturedHackathons = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Update active dot indicator
      setCurrentIndex((prev) => {
        const newIndex =
          direction === "left"
            ? Math.max(prev - 1, 0)
            : Math.min(prev + 1, hackathons.length - 1);
        return newIndex;
      });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with "View All" Link */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 relative">
            Featured Hackathons
            <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
          </h2>
          <Link
            href="/hackathon"
            className="text-blue-500 text-sm hover:underline"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="relative mt-8">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full z-10 hidden md:flex hover:bg-gray-200 transition"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          {/* Scrollable Card Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          >
            {hackathons.map((hack, index) => (
              <div
                key={index}
                className="min-w-[280px] md:min-w-[320px] bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={hack.image}
                  alt={hack.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {hack.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    From: {hack.startDate} &nbsp;&nbsp; To: {hack.endDate}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {hack.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full z-10 hidden md:flex hover:bg-gray-200 transition"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-4">
          {hackathons.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full transition ${
                index === currentIndex ? "bg-blue-500 w-3" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHackathons;
