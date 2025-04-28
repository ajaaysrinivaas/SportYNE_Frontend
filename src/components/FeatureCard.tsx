// src/components/FeatureCard.tsx
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="feature-card">
    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
      {title}
    </h2>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default FeatureCard;
