"use client";
import React, { useEffect, useRef, JSX } from "react";
import { SubTopic, Post } from "../../models/topics";
import { gsap } from "gsap";
import { Icon } from "@iconify/react";

type SubtopicModalProps = {
  selectedSubtopic: SubTopic | null;
  onClose: () => void;
  onFileClick: (postId: string) => void;
};

export default function SubtopicModal({
  selectedSubtopic,
  onClose,
  onFileClick,
}: SubtopicModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (selectedSubtopic && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power1.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, delay: 0.1, ease: "power1.out" }
      );
      contentRef.current?.focus();
    }
  }, [selectedSubtopic]);

  if (!selectedSubtopic) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl relative outline-none"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <Icon icon="mdi:close" />
        </button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Files in {selectedSubtopic.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {selectedSubtopic.posts.map((post: Post) => (
            <div
              key={post.id}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md"
              onClick={() => onFileClick(post.id)}
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
                {post.name}
              </h3>
            </div>
          ))}
          {selectedSubtopic.posts.length === 0 && (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-300 text-xs sm:text-sm">
              No files available in this subtopic.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
