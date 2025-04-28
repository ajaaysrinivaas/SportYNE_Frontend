"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { TopicService } from "@/services/topicService";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import Image from "next/image";

interface PageParams {
  postId: string;
  searchParams?: Record<string, string>;
}

export default function FileContentPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  // Unwrap the promised params.
  const { postId } = use(params);

  // State variables
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [lineHeight, setLineHeight] = useState(1.6);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const router = useRouter();
  const topicService = TopicService.getInstance();

  // Refs
  const progressBarRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch file content using the unique postId.
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const html = await topicService.GetPostContent("anatomy", postId);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;

        // Apply custom styling to all elements if not already set.
        body.querySelectorAll("*").forEach((node) => {
          const element = node as HTMLElement;
          if (!element.style.color) {
            element.style.color = "#222222";
          }
          element.style.backgroundColor = "transparent";
          element.style.fontSize = `${fontSize}px`;
          element.style.fontFamily = fontFamily;
          element.style.lineHeight = `${lineHeight}`;
        });

        setContent(body.innerHTML);
      } catch (err) {
        console.error("Error fetching file content:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [postId, fontSize, fontFamily, lineHeight, topicService]);

  // Update reading progress on scroll.
  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = Math.round((scrollTop / scrollHeight) * 100);
    setReadingProgress(progress);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate progress bar with GSAP.
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${readingProgress}%`,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [readingProgress]);

  // Animate article appearance on load.
  useEffect(() => {
    if (!loading && !error && articleRef.current) {
      gsap.from(articleRef.current, {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: "power2.out",
      });
    }
  }, [loading, error]);

  // Refined text-to-speech toggle function.
  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      utteranceRef.current = null;
    } else {
      const plainText = content.replace(/<[^>]*>/g, " ");
      const utterance = new SpeechSynthesisUtterance(plainText);

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.name.includes("Google US English")) || voices[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsReadingAloud(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReadingAloud(true);
    }
  };

  // Font and line controls.
  const increaseFontSize = () =>
    setFontSize((size) => Math.min(size + 2, 24));
  const decreaseFontSize = () =>
    setFontSize((size) => Math.max(size - 2, 12));
  const increaseLineHeight = () =>
    setLineHeight((lh) => Math.min(lh + 0.2, 2));
  const decreaseLineHeight = () =>
    setLineHeight((lh) => Math.max(lh - 0.2, 1.2));
  const changeFontFamily = (family: string) => setFontFamily(family);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800 transition-colors duration-500">
        <div className="text-gray-600 animate-pulse">Loading content...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800 transition-colors duration-500">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  // Calculate reading time (assuming 200 words per minute).
  const calculateReadingTime = (text: string) => {
    const words = text.replace(/<[^>]*>/g, "").split(" ").filter(Boolean).length;
    return Math.ceil(words / 200);
  };

  return (
    <div className="w-full py-16 px-6 transition-colors duration-500 bg-gray-50 text-gray-800 min-h-screen relative">
      {/* SportYNE Logo Watermark - Fixed and centered */}
      <div className="fixed inset-0 flex justify-center items-center pointer-events-none opacity-10 z-0">
        <Image
          src="/images/logo.png"
          alt="SportYNE Logo"
          className="w-72 h-72 object-contain"
          width={288}
          height={288}
        />
      </div>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-1 transition-all duration-200 z-50 bg-teal-600"
      ></div>

      {/* Top Controls */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 relative z-10">
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center text-blue-600 hover:underline transition-colors duration-200"
            onClick={() => router.back()}
            aria-label="Go Back"
          >
            <Icon icon="mdi:arrow-left" className="mr-2" width="24" height="24" />
            Back
          </button>
          <button
            className="flex items-center text-blue-600 hover:underline transition-colors duration-200"
            onClick={() => window.print()}
            aria-label="Print Document"
          >
            <Icon icon="mdi:printer" className="mr-2" width="24" height="24" />
            Print
          </button>
          <button
            className="flex items-center text-blue-600 hover:underline transition-colors duration-200"
            onClick={toggleReadAloud}
            aria-label="Toggle Read Aloud"
          >
            <Icon
              icon={isReadingAloud ? "mdi:pause-circle" : "mdi:play-circle"}
              className="mr-2"
              width="24"
              height="24"
            />
            {isReadingAloud ? "Stop Reading" : "Read Aloud"}
          </button>
        </div>

        <div className="flex flex-wrap items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
              onClick={decreaseFontSize}
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
              onClick={increaseFontSize}
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
              onClick={decreaseLineHeight}
              aria-label="Decrease line height"
            >
              <Icon icon="mdi:format-line-spacing" width="20" height="20" />
            </button>
            <button
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
              onClick={increaseLineHeight}
              aria-label="Increase line height"
            >
              <Icon
                icon="mdi:format-line-spacing"
                width="20"
                height="20"
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <Icon icon="mdi:format-font-size" className="text-gray-500" width="24" height="24" />
            <select
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => changeFontFamily(e.target.value)}
              value={fontFamily}
              aria-label="Select font family"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article
        ref={articleRef}
        className="prose transition-colors duration-500 mx-auto text-center relative z-10"
        style={{ fontSize: `${fontSize}px`, fontFamily, lineHeight }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>

      <footer className="mt-8 text-center relative z-10">
        <p className="text-sm text-gray-500">
          Estimated Reading Time: {calculateReadingTime(content)} minutes
        </p>
      </footer>

      {/* Fixed Scroll-to-Top Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        ↑ Top
      </button>
    </div>
  );
}
