"use client";
import React, { useEffect, useRef, JSX } from "react";
import { SubTopic } from "../../models/topics";
import { Icon } from "@iconify/react";

type SubtopicListProps = {
  subtopics: SubTopic[];
  loading: boolean;
  onSubtopicClick: (subtopic: SubTopic) => void;
};

export default function SubtopicList({
  subtopics,
  loading,
  onSubtopicClick,
}: SubtopicListProps): JSX.Element {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && listRef.current) {
      import("gsap").then(({ gsap }) => {
        if (listRef.current) {
          gsap.fromTo(
            listRef.current.children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power1.out" }
          );
        }
      });
    }
  }, [loading, subtopics]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-700 shadow rounded-lg p-3 h-20 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!loading && subtopics.length === 0) {
    return <p className="text-gray-400 text-center text-sm">No subtopics available.</p>;
  }

  return (
    <div
      ref={listRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {subtopics.map((subtopic) => (
        <div
          key={subtopic.id}
          className="bg-white dark:bg-gray-700 shadow rounded-lg p-3 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 flex items-center gap-2"
          onClick={() => onSubtopicClick(subtopic)}
        >
          <Icon
            icon="mdi:book-open-page-variant"
            className="text-teal-500 w-5 h-5 flex-shrink-0"
          />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
              {subtopic.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {subtopic.posts.length} posts available
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
