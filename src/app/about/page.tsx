"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import BreadcrumbNavigation from "@/components/page-components/BreadcrumbNavigation";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function AboutPage() {
  // Refs for potential animations or future enhancements
  const topSectionRef = useRef<HTMLElement>(null);
  const contentSectionRef = useRef<HTMLElement>(null);
  const visionSectionRef = useRef<HTMLElement>(null);
  const missionSectionRef = useRef<HTMLElement>(null);
  const teamSectionRef = useRef<HTMLElement>(null);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/about-bg.webp" // Provide a suitable background image for About page
          alt="About Background"
          fill
          priority
          className="object-cover filter blur-sm"
          style={{
            mixBlendMode: "overlay",
            backgroundColor: "rgba(245,240,235,1)",
          }}
        />
        <div className="absolute inset-0 
                        bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(20,20,20,0.6)]
                        pointer-events-none"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <header className="mx-4 sm:mx-6 lg:mx-16 mt-6">
        <BreadcrumbNavigation
          crumbs={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]}
        />
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 mx-4 sm:mx-6 lg:mx-16 my-6 p-4 sm:p-6 lg:p-8 
                         bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm 
                         rounded-[20px] sm:rounded-[30px] shadow-lg">
        {/* Top Section */}
        <section ref={topSectionRef} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Who We Are
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 italic">
            Your Next Evolution in Sports Science
          </p>
        </section>

        {/* "Who We Are" Content */}
        <section ref={contentSectionRef} className="mb-16">
          <div className="flex flex-col lg:flex-row items-center 
                          bg-gray-50 dark:bg-gray-800 rounded-[30px] shadow-lg p-8 
                          transition-colors duration-300">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <Image
                src="/images/about-us.png"
                alt="About SportYNE"
                width={600}
                height={400}
                className="rounded-lg object-cover shadow-md"
              />
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Bridging Science and Performance
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                At SportYNE, we bridge the gap between science and performance. Built on a foundation of curiosity, innovation, and expertise, we empower athletes, enthusiasts, and professionals with cutting-edge insights in sports science, biomechanics, physiology, and beyond.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our team is dedicated to advancing the understanding of human potential, ensuring that every individual can achieve their peak performance while maintaining optimal health and wellness.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section ref={visionSectionRef} className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white mb-6">
            Our Vision
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            To revolutionize how sports science is understood, applied, and shared—paving the way for optimized performance, injury prevention, and lifelong wellness.
          </p>
        </section>

        {/* Mission Section */}
        <section ref={missionSectionRef} className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-[30px] mx-4 lg:mx-16 shadow-lg transition-colors duration-300 mb-16">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white mb-12">
            Our Mission
          </h2>
          <div className="space-y-8 max-w-4xl mx-auto text-left">
            {[
              {
                icon: <Icon icon="mdi:check-circle" className="text-teal-400 w-8 h-8" />,
                title: "Innovate",
                description:
                  "Explore the latest advancements in science and technology to push the boundaries of human performance.",
              },
              {
                icon: <Icon icon="mdi:rocket" className="text-teal-400 w-8 h-8" />,
                title: "Empower",
                description:
                  "Provide actionable knowledge that helps individuals and teams achieve their full potential.",
              },
              {
                icon: <Icon icon="mdi:book-open-variant" className="text-teal-400 w-8 h-8" />,
                title: "Educate",
                description:
                  "Deliver evidence-based information in an accessible and engaging format.",
              },
            ].map((item, index) => (
              <div key={index} className="mission-item flex items-start space-x-4 p-4 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-700">
                {item.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team Section */}
        <section ref={teamSectionRef} className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white mb-6">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Ajaay Srinivaas R",
                role: "Founder",
                image: "/images/team/ajaay.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="team-item bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Image
                  src={member.image}
                  alt={`${member.name}'s photo`}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Scroll-to-Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
