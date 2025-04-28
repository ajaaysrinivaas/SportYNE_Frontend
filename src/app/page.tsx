"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";

// Dynamically import the FindSpaces component (client only)
const FindSpaces = dynamic(() => import("../components/FindSpaces"), {
  ssr: false,
});

export interface Space {
  title: string;
  description: string;
  icon: React.ReactElement;
  category: string;
}

const Home: React.FC = () => {
  // Refs for GSAP animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // State and ref for Scroll-to-Top button
  const [showScroll, setShowScroll] = useState(false);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);

  // GSAP animation effect
  useEffect(() => {
    let timeline: gsap.core.Timeline | undefined;

    (async () => {
      try {
        const gsapModule = await import("gsap");
        const { gsap } = gsapModule;
        const scrollTriggerModule = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

        timeline = gsap.timeline({
          defaults: { duration: 0.8, ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });

        if (sectionRef.current) {
          timeline.from(sectionRef.current, { opacity: 0, y: 50 });
        }
        if (heroRef.current) {
          timeline.from(heroRef.current, { opacity: 0, y: -50 }, "-=0.5");
        }
        if (imageRef.current) {
          timeline.from(imageRef.current, { opacity: 0, y: 50 }, "-=0.5");
        }
        if (ctaRef.current) {
          timeline.from(ctaRef.current, { opacity: 0, y: 50 }, "-=0.5");
        }
      } catch (error) {
        console.error("GSAP failed to load:", error);
      }
    })();

    // Cleanup on unmount
    return () => {
      timeline?.kill();
    };
  }, []);

  // Removed SWR prefetching – Next.js Link components already prefetch pages.
  // (Also, fetching full HTML pages as JSON was causing JSON parse errors.)

  // Scroll-to-top button logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allSpaces: Space[] = [
    {
      title: "Anatomy",
      description: "Understand the structural foundation of the human body.",
      icon: (
        <Icon
          icon="mdi:run"
          className="text-teal-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Human Biology",
    },
    {
      title: "Physiology",
      description:
        "Explore how the body functions under various physical demands and conditions.",
      icon: (
        <Icon
          icon="mdi:brain"
          className="text-blue-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Human Biology",
    },
    {
      title: "Biomechanics",
      description:
        "Analyze movement and mechanics to enhance performance and prevent injuries.",
      icon: (
        <Icon
          icon="mdi:arm-flex"
          className="text-red-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Science",
    },
    {
      title: "Nutrition",
      description:
        "Discover strategies to fuel the body for peak performance and recovery.",
      icon: (
        <Icon
          icon="mdi:food-apple"
          className="text-green-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Nutrition",
    },
    {
      title: "Exercise Physiology",
      description:
        "Dive into the science of how exercise impacts body systems and optimizes health.",
      icon: (
        <Icon
          icon="mdi:run"
          className="text-yellow-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Training",
    },
    {
      title: "Sports Psychology",
      description:
        "Understand the mental aspects of performance, motivation, and recovery.",
      icon: (
        <Icon
          icon="mdi:brain"
          className="text-purple-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Psychology",
    },
    {
      title: "Environmental Physiology",
      description:
        "Learn how different environments affect physical performance and adaptation.",
      icon: (
        <Icon
          icon="mdi:plus-circle-outline"
          className="text-indigo-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Science",
    },
    {
      title: "Injury Prevention and Recovery",
      description:
        "Innovative approaches to minimize risks and accelerate recovery.",
      icon: (
        <Icon
          icon="mdi:heart-pulse"
          className="text-pink-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Health",
    },
    {
      title: "Strength and Conditioning",
      description:
        "Develop strength, power, and endurance tailored to individual athletic goals.",
      icon: (
        <Icon
          icon="mdi:weight-lifter"
          className="text-orange-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Training",
    },
    {
      title: "Case Studies",
      description:
        "Real-world examples and insights into effective sports science practices.",
      icon: (
        <Icon
          icon="mdi:flask"
          className="text-gray-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Science",
    },
    {
      title: "Need Analysis",
      description:
        "Tailored assessments to identify specific performance and recovery needs.",
      icon: (
        <Icon
          icon="mdi:clover"
          className="text-teal-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Health",
    },
    {
      title: "Program Designing",
      description:
        "Customized training plans based on science and individual goals.",
      icon: (
        <Icon
          icon="mdi:soccer"
          className="text-blue-500 w-12 h-12 mx-auto mb-4"
        />
      ),
      category: "Training",
    },
  ];

  return (
    <div className="font-sans">
      {/* Main Section */}
      <div
        ref={sectionRef}
        className="bg-gray-50 dark:bg-gray-800 py-16 px-6 rounded-[30px] mx-4 lg:mx-16 shadow-lg transition-colors duration-300"
      >
        {/* Hero Content */}
        <div ref={heroRef} className="text-center mb-16">
          <h1 className="text-5xl font-welcoming mb-6 leading-tight text-gray-800 dark:text-gray-100">
            Your Next Evolution: <br /> Where Science Meets Performance
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A dive into the synergy of knowledge and performance, crafted for
            athletes, enthusiasts, and professionals alike.
          </p>
        </div>

        {/* Hero Image */}
        <div ref={imageRef} className="flex justify-center mb-16">
          <Image
            src="/images/soccer-field.png"
            alt="Soccer Field"
            className="rounded-[30px] shadow-lg w-full max-w-4xl object-cover"
            width={1200}
            height={400}
          />
        </div>

        {/* Find Spaces Intro */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Find Spaces to Explore
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dive into the intersection of science and movement. Let’s uncover
            insights, strategies, and innovations designed to empower
            performance and deepen your understanding of human potential.
          </p>
        </div>

        {/* Render the FindSpaces component */}
        <FindSpaces allSpaces={allSpaces} />
      </div>

      {/* Call-to-Action Section */}
      <div
        ref={ctaRef}
        className="py-16 bg-gradient-to-r from-teal-300 via-blue-400 to-blue-600 dark:from-teal-500 dark:via-blue-500 dark:to-blue-700 text-white text-center rounded-[30px] mx-4 lg:mx-16 shadow-lg mt-16 mb-12 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6 tracking-wide">
            Join the Movement Today
          </h2>
          <p className="text-lg mb-8">
            Let’s embark on a journey of growth, discovery, and performance.
            Together, we’ll take your passion for sports science to the next
            level.
          </p>
          <Link
            href="#get-started"
            className="inline-block px-6 py-3 bg-white text-blue-600 dark:text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button
          ref={scrollBtnRef}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Scroll to top"
        >
          <Icon icon="mdi:arrow-up" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Home;
