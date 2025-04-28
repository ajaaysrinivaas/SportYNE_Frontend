"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  JSX,
  startTransition,
} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Topic, SubTopic, Post } from "@/models/topics";
import { TopicService } from "@/services/topicService";
import SubtopicList from "../../components/page-components/SubtopicList";
import LatestPosts from "../../components/page-components/LatestPosts";
import BreadcrumbNavigation from "../../components/page-components/BreadcrumbNavigation";
import { useGsapAnimation } from "@/hooks/useGsapAnimation";
import ScrollToTopButton from "../../components/ScrollToTopButton";

// Dynamically import SubtopicModal to keep the initial bundle lightweight
const SubtopicModal = dynamic(
  () => import("../../components/page-components/SubtopicModal"),
  {
    ssr: false,
    loading: () => <div>Loading modal...</div>,
  }
);

export default function AnatomyPage(): JSX.Element {
  const [subtopics, setSubtopics] = useState<Topic["subTopics"]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const topicService = TopicService.getInstance();

  // Refs for GSAP animations on the breadcrumb, hero, and content sections
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);

  // Apply GSAP animations (ensure cleanup within the hook if needed)
  useGsapAnimation({
    breadcrumb: breadcrumbRef,
    hero: heroContentRef,
    content: contentSectionRef,
  });

  // Memoize static breadcrumbs to avoid unnecessary re-renders
  const breadcrumbs = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Anatomy", href: "/anatomy" },
    ],
    []
  );

  // Fetch subtopics and latest posts concurrently
  const fetchFreshData = useCallback(async () => {
    try {
      const [subTopics, latest] = await Promise.all([
        topicService.GetSubTopics("anatomy"),
        topicService.GetLatestPosts("anatomy", 4),
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
    router.prefetch(`/anatomy/posts/${postId}`);
    startTransition(() => {
      router.push(`/anatomy/posts/${postId}`);
    });
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/anatomy.webp"
          alt="Anatomy Background"
          fill
          priority
          className="object-cover filter blur-sm"
          style={{
            mixBlendMode: "overlay",
            backgroundColor: "rgba(245,240,235,1)",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(20,20,20,0.6)] pointer-events-none"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <header ref={breadcrumbRef} className="mx-4 sm:mx-6 lg:mx-16 mt-6">
        <BreadcrumbNavigation crumbs={breadcrumbs} />
      </header>

      {/* Main content card */}
      <main className="relative z-10 mx-4 sm:mx-6 lg:mx-16 my-6 p-4 sm:p-6 lg:p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-[20px] sm:rounded-[30px] shadow-lg">
        {/* Hero Section */}
        <section
          className="flex flex-col items-center text-center py-4 sm:py-6 mb-6"
          ref={heroContentRef}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white">
            Anatomy Uncovered
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-xl">
            Explore the fascinating world of human anatomy with our in-depth subtopics and the latest research.
          </p>
        </section>

        {/* Content Grid */}
        <section
          className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-4 sm:gap-6"
          ref={contentSectionRef}
        >
          {/* Left Column: Subtopics */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                Explore Subtopics
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                Dive into different areas of anatomy to broaden your understanding.
              </p>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-2">
                {/* Simple skeleton loader for subtopics */}
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ) : subtopics.length > 0 ? (
              <SubtopicList
                subtopics={subtopics}
                loading={loading}
                onSubtopicClick={handleSubtopicClick}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No subtopics available.</p>
            )}
          </div>

          {/* Right Column: Latest Posts */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                Latest Posts
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                Stay informed with recent discoveries and insights.
              </p>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-2">
                {/* Simple skeleton loader for latest posts */}
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ) : latestPosts.length > 0 ? (
              <LatestPosts
                latestPosts={latestPosts}
                loading={loading}
                onFileClick={handleFileClick}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No posts available.</p>
            )}
          </div>
        </section>

        {/* Subtopic Modal */}
        <SubtopicModal
          selectedSubtopic={selectedSubtopic}
          onClose={closeSubtopic}
          onFileClick={handleFileClick}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 dark:text-red-400 mt-4 text-center text-sm sm:text-base">
            Error: {error}
          </p>
        )}
      </main>

      {/* Scroll-to-Top Button (consider adding aria-label for accessibility) */}
      <ScrollToTopButton aria-label="Scroll to top" />
    </div>
  );
}
