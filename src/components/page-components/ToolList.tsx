"use client";
import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface Tool {
  name: string;
  route: string;
}

interface ToolsListProps {
  title: string;
  description: string;
  tools: Tool[];
}

const ToolsList: React.FC<ToolsListProps> = ({ title, description, tools }) => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleToolClick = (route: string) => {
    router.push(route);
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (sectionEl && sectionEl.children) {
      import("gsap").then(({ gsap }) => {
        gsap.fromTo(
          sectionEl.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power1.out",
          }
        );
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="mb-6 px-4">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="bg-white dark:bg-gray-700 shadow rounded-lg p-3 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 flex items-center gap-2"
            onClick={() => handleToolClick(tool.route)}
          >
            <Icon
              icon="mdi:toolbox"
              className="text-teal-500 w-5 h-5 flex-shrink-0"
            />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                {tool.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Access the <span className="font-medium">{tool.name}</span> for detailed insights.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsList;
