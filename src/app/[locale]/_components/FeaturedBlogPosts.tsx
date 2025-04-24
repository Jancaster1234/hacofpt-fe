// src/app/[locale]/_components/FeaturedBlogPosts.tsx
"use client";
import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const blogPosts = [
  {
    title: "Hackathon là gì?",
    description:
      "Trong thế giới số hiện nay, Hackathon là một thuật ngữ phổ biến bắt nguồn từ việc kết hợp 'hack' và 'marathon'...",
    image: "/images/featuredBlogPosts/blog1.png",
    link: "/blog/hackathon-la-gi",
  },
  {
    title: "Hướng dẫn tham gia hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog2.png",
    link: "/blog/huong-dan-tham-gia-hackathon",
  },
  {
    title: "Quy chế thi Hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog3.png",
    link: "/blog/quy-che-thi-hackathon",
  },
];

const FeaturedBlogPosts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setCurrentIndex((prev) => {
        const newIndex =
          direction === "left"
            ? Math.max(prev - 1, 0)
            : Math.min(prev + 1, blogPosts.length - 1);
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
            Featured Blog Posts
            <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
          </h2>
          <a href="/blog" className="text-blue-500 text-sm hover:underline">
            View All &rarr;
          </a>
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
            {blogPosts.map((post, index) => (
              <a
                href={post.link}
                key={index}
                className="min-w-[280px] md:min-w-[320px] bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </a>
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
          {blogPosts.map((_, index) => (
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

export default FeaturedBlogPosts;
