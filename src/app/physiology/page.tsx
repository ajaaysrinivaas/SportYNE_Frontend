"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  JSX,
  startTransition,
} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SubTopic, Post } from "@/models/topics";
import { TopicService } from "@/services/topicService";
import SubtopicList from "@/components/page-components/SubtopicList";
import LatestPosts from "@/components/page-components/LatestPosts";
import BreadcrumbNavigation from "@/components/page-components/BreadcrumbNavigation";
import { useGsapAnimation } from "@/hooks/useGsapAnimation";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// Dynamically import SubtopicModal to keep the bundle light
const SubtopicModal = dynamic(
  () => import("@/components/page-components/SubtopicModal"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function PhysiologyPage(): JSX.Element {
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const topicService = TopicService.getInstance();

  // Refs for GSAP animations
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);

  // Apply shared GSAP animations (as defined in your custom hook)
  useGsapAnimation({
    breadcrumb: breadcrumbRef,
    hero: heroContentRef,
    content: contentSectionRef,
  });

  // Fetch subtopics and latest posts concurrently
  const fetchFreshData = useCallback(async () => {
    try {
      const [subTopics, latest] = await Promise.all([
        topicService.GetSubTopics("physiology"),
        topicService.GetLatestPosts("physiology", 4),
      ]);
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

  const handleFileClick = useCallback((postId: string): void => {
    if (!postId) {
      console.error("Post ID is undefined. Navigation aborted.");
      return;
    }
    router.prefetch(`/physiology/posts/${postId}`);
    startTransition(() => {
      router.push(`/physiology/posts/${postId}`);
    });
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/physiology.webp"
          alt="Physiology Background"
          fill
          priority
          className="object-cover filter blur-sm"
          style={{
            mixBlendMode: "overlay",
            backgroundColor: "rgba(245,240,235,1)",
          }}
        />
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(20,20,20,0.6)] pointer-events-none"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <header ref={breadcrumbRef} className="mx-4 sm:mx-6 lg:mx-16 mt-6">
        <BreadcrumbNavigation
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Physiology", href: "/physiology" },
          ]}
        />
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 mx-4 sm:mx-6 lg:mx-16 my-6 p-4 sm:p-6 lg:p-8 
                         bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm 
                         rounded-[20px] sm:rounded-[30px] shadow-lg">
        {/* Hero Section */}
        <section ref={heroContentRef} className="flex flex-col items-center text-center py-4 sm:py-6 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white">
            Physiology Unlocked
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-xl">
            Discover how the body functions under various conditions and physical demands through our comprehensive subtopics and latest insights.
          </p>
        </section>

        {/* Content Grid */}
        <section ref={contentSectionRef} className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-4 sm:gap-6">
          {/* Left Column: Subtopics */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                Explore Subtopics
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                Delve into various aspects of human physiology to understand its complexities.
              </p>
            </div>
            <SubtopicList
              subtopics={subtopics}
              loading={loading}
              onSubtopicClick={handleSubtopicClick}
            />
          </div>

          {/* Right Column: Latest Posts */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                Latest Posts
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                Stay updated with recent discoveries and insights in physiology.
              </p>
            </div>
            <LatestPosts
              latestPosts={latestPosts}
              loading={loading}
              onFileClick={handleFileClick}
            />
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

      {/* Scroll-to-Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
