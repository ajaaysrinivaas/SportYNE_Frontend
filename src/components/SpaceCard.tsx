"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Space } from "../types/space"; // It's best to define the type in a shared file (see below)

interface SpaceCardProps {
  space: Space;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  // Convert spaces to kebab-case for URL path
  const slug = space.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/${slug}`}>
      {/* In Next.js 13 (pages directory) you can use legacyBehavior if you want an <a> tag */}
      <a>
        <div className="space-card p-4 hover:shadow-lg transition-shadow">
          {space.icon}
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {space.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {space.description}
          </p>
        </div>
      </a>
    </Link>
  );
};

export default memo(SpaceCard);
