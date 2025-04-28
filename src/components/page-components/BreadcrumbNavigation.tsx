"use client";
import React, { useEffect, useRef, JSX } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbNavigationProps = {
  crumbs: Crumb[];
};

export default function BreadcrumbNavigation({
  crumbs,
}: BreadcrumbNavigationProps): JSX.Element {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power1.out" }
        );
      }
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "power1.out",
          }
        );
      }
    });
  }, []);

  return (
    <nav
      ref={navRef}
      className="mb-3 text-gray-600 dark:text-gray-300 text-xs sm:text-sm flex items-center"
      aria-label="Breadcrumb"
    >
      <ul ref={listRef} className="flex space-x-1 items-center">
        {crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index === 0 && crumb.label === "Home" ? (
              <li>
                <Link
                  href={crumb.href || "#"}
                  className="flex items-center hover:underline text-blue-500 transition-colors duration-200"
                >
                  <Icon icon="mdi:home" className="w-3 h-3 mr-1" />
                  {crumb.label}
                </Link>
              </li>
            ) : crumb.href ? (
              <li>
                <Link
                  href={crumb.href}
                  className="hover:underline text-blue-500 transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              </li>
            ) : (
              <li>
                <span className="text-gray-800 dark:text-gray-100">
                  {crumb.label}
                </span>
              </li>
            )}
            {index < crumbs.length - 1 && (
              <li>
                <span className="mx-1">/</span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}
