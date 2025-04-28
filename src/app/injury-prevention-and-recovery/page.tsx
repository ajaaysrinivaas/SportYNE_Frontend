"use client";

import React, { useState, useEffect, useCallback, useRef, JSX } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SubTopic, Post } from "@/models/topics";
import { TopicService } from "@/services/topicService";
import BreadcrumbNavigation from "@/components/page-components/BreadcrumbNavigation";
import SubtopicList from "@/components/page-components/SubtopicList";
import LatestPosts from "@/components/page-components/LatestPosts";
import ToolsList from "@/components/page-components/ToolList";
import { useGsapAnimation } from "@/hooks/useGsapAnimation";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// Dynamically import SubtopicModal for a lightweight bundle
const SubtopicModal = dynamic(
  () => import("@/components/page-components/SubtopicModal"),
  { ssr: false, loading: () => <div>Loading...</div> }
);

// Injury Prevention and Recovery calculators array
const calculators = [
  { name: "Injury Risk Assessment Tool", route: "/injury-prevention-recovery/calculator/injury-risk" },
  { name: "Recovery Time Estimator", route: "/injury-prevention-recovery/calculator/recovery-time" },
  { name: "Strength Imbalance Detector", route: "/injury-prevention-recovery/calculator/strength-imbalance" },
  { name: "Load Management Calculator", route: "/injury-prevention-recovery/calculator/load-management" },
  { name: "Flexibility and Mobility Score", route: "/injury-prevention-recovery/calculator/flexibility-mobility" },
];

export default function InjuryPreventionRecoveryPage(): JSX.Element {
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const topicService = TopicService.getInstance();

  // Setup GSAP animation refs
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  useGsapAnimation({
    breadcrumb: breadcrumbRef,
    hero: heroContentRef,
    content: contentSectionRef,
  });

  // Fetch data via TopicService using the "injury-prevention-recovery" topic
  const fetchFreshData = useCallback(async () => {
    try {
      const subTopics = await topicService.GetSubTopics("injury-prevention-recovery");
      const latest = await topicService.GetLatestPosts("injury-prevention-recovery", 5);
      setSubtopics(subTopics);
      setLatestPosts(latest);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [topicService]);

  useEffect(() => {
    fetchFreshData();
  }, [fetchFreshData]);

  const handleSubtopicClick = useCallback((subtopic: SubTopic): void => {
    setSelectedSubtopic(subtopic);
  }, []);

  const closeSubtopic = useCallback((): void => {
    setSelectedSubtopic(null);
  }, []);

  const handleFileClick = useCallback((fileId: string): void => {
    router.prefetch(`/injury-prevention-recovery/file/${fileId}`);
    router.push(`/injury-prevention-recovery/file/${fileId}`);
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/injury-prevention-recovery.webp"
          alt="Injury Prevention and Recovery Background"
          fill
          priority
          className="object-cover filter blur-sm"
          style={{ mixBlendMode: "overlay", backgroundColor: "rgba(245,240,235,1)" }}
        />
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(20,20,20,0.6)] pointer-events-none"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <header ref={breadcrumbRef} className="mx-4 sm:mx-6 lg:mx-16 mt-6">
        <BreadcrumbNavigation
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Injury Prevention and Recovery", href: "/injury-prevention-recovery" },
          ]}
        />
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 mx-4 sm:mx-6 lg:mx-16 my-6 p-4 sm:p-6 lg:p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-[20px] sm:rounded-[30px] shadow-lg">
        {/* Hero Section */}
        <section ref={heroContentRef} className="flex flex-col items-center text-center py-4 sm:py-6 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white">
            Injury Prevention and Recovery
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-xl">
            Explore tools and strategies to minimize risks and optimize recovery.
          </p>
        </section>

        {/* Content Grid */}
        <section ref={contentSectionRef} className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-4 sm:gap-6">
          {/* Left Column: Subtopics & Calculators */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                Explore Subtopics
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                Browse various subtopics to discover in-depth content.
              </p>
              <SubtopicList subtopics={subtopics} loading={loading} onSubtopicClick={handleSubtopicClick} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                Calculators
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                Utilize our specialized calculators for personalized insights.
              </p>
              <ToolsList title="" description="" tools={calculators} />
            </div>
          </div>

          {/* Right Column: Latest Posts */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
              Latest Posts
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
              Stay updated with the latest research and insights.
            </p>
            <LatestPosts latestPosts={latestPosts} loading={loading} onFileClick={handleFileClick} />
          </div>
        </section>

        <SubtopicModal
          selectedSubtopic={selectedSubtopic}
          onClose={closeSubtopic}
          onFileClick={handleFileClick}
        />

        {error && (
          <p className="text-red-500 dark:text-red-400 mt-4 text-center text-sm sm:text-base">
            Error: {error}
          </p>
        )}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
