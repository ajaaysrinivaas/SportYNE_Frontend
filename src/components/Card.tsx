// src/components/Card.tsx
import Link from "next/link";
import React from "react";

interface CardProps {
  href: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ href, title, description }) => (
  <Link href={href} passHref legacyBehavior>
    <a>
      <div className="card">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </a>
  </Link>
);

export default Card;
