// src/app/[locale]/_components/FeaturedHackathons.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { hackathonService } from "@/services/hackathon.service";
import { Hackathon } from "@/types/entities/hackathon";
import { useTranslations } from "@/hooks/useTranslations";
import HackathonCard from "@/components/HackathonCard";

const RecentHackathons = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("hackathonCard");

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const { data } = await hackathonService.getAllHackathons();

        // Sort hackathons by startDate (newest first) and take the first 6
        const sortedHackathons = data
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
          .slice(0, 6);

        setHackathons(sortedHackathons);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
        setError("Failed to load hackathons");
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Adjusted to match card width
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

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 relative">
              Recent Hackathons
              <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
            </h2>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="animate-pulse flex space-x-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[320px] bg-gray-200 rounded-lg h-64"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 relative">
              Recent Hackathons
              <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
            </h2>
          </div>
          <div className="mt-8 text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (hackathons.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 relative">
              Recent Hackathons
              <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
            </h2>
          </div>
          <div className="mt-8 text-center text-gray-500">
            No hackathons available at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with "View All" Link */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 relative">
            Recent Hackathons
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
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md p-3 rounded-full z-10 hidden md:flex hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-gray-700 dark:text-gray-200" />
          </button>

          {/* Scrollable Card Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          >
            {hackathons.map((hackathon, index) => (
              <div
                key={hackathon.id}
                className="min-w-[280px] md:min-w-[320px] flex-shrink-0"
              >
                <HackathonCard hackathon={hackathon} />
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md p-3 rounded-full z-10 hidden md:flex hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-4">
          {hackathons.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full transition ${
                index === currentIndex
                  ? "bg-blue-500 w-3"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentHackathons;
