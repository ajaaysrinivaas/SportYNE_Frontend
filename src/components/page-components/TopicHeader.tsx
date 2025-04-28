"use client";
import React, { useEffect, useRef, JSX } from "react";
import { Icon } from "@iconify/react";

type TopicHeaderProps = {
  title: string;
  subtitle: string;
};

export default function TopicHeader({
  title,
  subtitle,
}: TopicHeaderProps): JSX.Element {
  const headerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power1.out" } });
      if (iconRef.current) {
        tl.from(iconRef.current, { y: -20, opacity: 0 });
      }
      if (headerRef.current) {
        tl.from(headerRef.current, { opacity: 0, y: -20 }, "-=0.3");
      }
    });
  }, []);

  return (
    <div ref={headerRef} className="text-center mb-6">
      <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 flex justify-center items-center gap-2">
        <span ref={iconRef} aria-hidden="true">
          <Icon icon="mdi:book" className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
        </span>
        {title}
      </h1>
      <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
