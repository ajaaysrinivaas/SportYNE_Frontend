// components/FindSpaces.tsx
import React, { memo, useRef, useEffect, JSX } from "react";
import Link from "next/link";
import { gsap } from "gsap";

// Type definitions
interface Space {
  title: string;
  description: string;
  icon: JSX.Element;
  category: string;
}

interface FindSpacesProps {
  allSpaces: Space[];
}

// Memoized FindSpaces component
const FindSpaces: React.FC<FindSpacesProps> = memo(({ allSpaces }) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate the space cards on mount
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2, // Stagger the animations for each card
        ease: "power3.out",
      }
    );

    // Hover animations
    cardRefs.current.forEach((card) => {
      if (card) {
        gsap.set(card, { transformOrigin: "center center" });
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
            ease: "power3.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power3.out",
          });
        });
      }
    });
  }, []);

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allSpaces.map((space, index) => (
          <Link
            key={space.title}
            href={`/${space.title.toLowerCase().replace(/ /g, "-")}`}
            passHref
          >
            
              <div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }} // Attach refs to cards
                className="space-card bg-white dark:bg-gray-700 shadow-lg rounded-[30px] p-6 cursor-pointer flex flex-col items-center"
              >
                {space.icon}
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  {space.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {space.description}
                </p>
              </div>
            
          </Link>
        ))}
      </div>
    </div>
  );
});

FindSpaces.displayName = "FindSpaces";

export default FindSpaces;
