"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            About HaCoF
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
            Empowering communities through innovation, cooperation, and
            sustainable development
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-16 transition-colors">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src="https://img.freepik.com/premium-photo/businessman-clicks-virtual-screen-mission_1085052-765.jpg?semt=ais_hybrid&w=740"
                  alt="HaCoF Mission"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                At HaCoF, we are dedicated to creating a positive impact through
                collaborative approaches to social and environmental challenges.
                Our mission is to build bridges between communities,
                organizations, and resources to foster sustainable growth and
                development.
              </p>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                We believe in the power of cooperation and innovation to
                transform lives and create lasting positive change in
                communities around the world.
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 transition-colors">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <span className="text-blue-600 dark:text-blue-300 text-2xl transition-colors">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Community Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Programs designed to strengthen local communities through
                education, infrastructure, and economic opportunities.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <span className="text-blue-600 dark:text-blue-300 text-2xl transition-colors">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Sustainability Initiatives
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Projects focused on environmental conservation, renewable
                energy, and sustainable resource management.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <span className="text-blue-600 dark:text-blue-300 text-2xl transition-colors">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Educational Programs
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Access to quality education and training to empower individuals
                with skills for the future.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <span className="text-blue-600 dark:text-blue-300 text-2xl transition-colors">
                  4
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Health & Wellness
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Promoting better health outcomes through accessible healthcare
                services and wellness education.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <span className="text-blue-600 dark:text-blue-300 text-2xl transition-colors">
                  5
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Partnership Network
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Building connections between organizations, businesses, and
                communities to amplify impact.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <span className="text-blue-600 dark:text-blue-300 text-2xl transition-colors">
                  6
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Innovation Hub
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Supporting creative solutions to address complex social and
                environmental challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-16 transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors">
            Our Story
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Founded in 2015, HaCoF began as a small initiative by a group of
              passionate individuals who believed in the power of community
              action. What started as local volunteering projects quickly grew
              into a structured organization with a vision for sustainable
              community development.
            </p>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Over the years, we have expanded our reach and impact, working
              with communities across multiple regions and developing
              partnerships with organizations that share our commitment to
              positive change. Through collaboration and innovative approaches,
              we have successfully implemented numerous projects that have
              improved lives and environments.
            </p>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Today, HaCoF stands as a testament to what can be achieved when
              people come together with purpose and dedication. As we continue
              to grow, we remain rooted in our founding principles of
              cooperation, sustainability, and community empowerment.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 transition-colors">
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors">
              <div className="w-32 h-32 mx-auto relative mb-4">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl text-gray-500 dark:text-gray-400">
                      1
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 transition-colors">
                Sarah Johnson
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-3 transition-colors">
                Executive Director
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                With over 15 years in nonprofit leadership, Sarah brings vision
                and strategic direction to our organization.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors">
              <div className="w-32 h-32 mx-auto relative mb-4">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl text-gray-500 dark:text-gray-400">
                      2
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 transition-colors">
                Michael Chen
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-3 transition-colors">
                Program Director
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Michael oversees our project implementation and ensures our
                programs create meaningful impact.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors">
              <div className="w-32 h-32 mx-auto relative mb-4">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl text-gray-500 dark:text-gray-400">
                      3
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 transition-colors">
                Dr. Amara Okafor
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-3 transition-colors">
                Research Lead
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Amara leads our research initiatives, ensuring our approaches
                are evidence-based and innovative.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors">
              <div className="w-32 h-32 mx-auto relative mb-4">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl text-gray-500 dark:text-gray-400">
                      4
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 transition-colors">
                Carlos Rodriguez
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-3 transition-colors">
                Community Engagement Specialist
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Carlos builds relationships with communities and partners to
                amplify our collaborative efforts.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center transition-colors">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Get In Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto transition-colors">
            Have questions or want to learn more about our work? We'd love to
            hear from you. Reach out to our team for information about our
            programs, partnership opportunities, or ways to get involved.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
