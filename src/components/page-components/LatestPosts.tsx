"use client";
import React, { useRef, useEffect } from "react";
import { Post } from "../../models/topics";
import { Icon } from "@iconify/react";

type LatestPostsProps = {
  latestPosts: Post[];
  loading: boolean;
  onFileClick: (postId: string) => void;
};

export default function LatestPosts({
  latestPosts,
  loading,
  onFileClick,
}: LatestPostsProps) {
  const postsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && postsRef.current) {
      import("gsap").then(({ gsap }) => {
        if (postsRef.current?.children) {
          gsap.fromTo(
            postsRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: "power1.out",
            }
          );
        }
      });
    }
  }, [loading, latestPosts]);

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-transparent p-2">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 shadow-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && latestPosts.length === 0) {
    return (
      <p className="text-gray-400 text-center text-sm">
        No recent posts available.
      </p>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-transparent p-2">
      <div ref={postsRef} className="grid grid-cols-1 gap-4">
        {latestPosts.map((post) => (
          <div
            key={post.id}
            className="
              bg-gray-700 dark:bg-gray-800
              rounded-lg p-3 shadow-md hover:shadow-lg 
              transition-shadow duration-300 cursor-pointer flex items-center gap-2
              transform hover:scale-105 active:scale-95 transition-transform
            "
            onClick={() => onFileClick(post.id)}
          >
            <Icon
              icon="mdi:document-text"
              className="w-4 h-4 text-indigo-400 flex-shrink-0"
            />
            <h3 className="text-base sm:text-lg font-semibold text-gray-100">
              {post.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
