// components/Icon.tsx
import React, { JSX } from "react";

// Define the props for the Icon component
interface IconProps {
  name: string;
  className?: string;
}

// Define your SVG icons here
const icons: { [key: string]: JSX.Element } = {
  run: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* Replace the path below with your actual "run" SVG path */}
      <path d="M5 20h14v-2H5v2zm0-5h14v-2H5v2zm0-5h14v-2H5v2z" />
    </svg>
  ),
  brain: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* Replace the path below with your actual "brain" SVG path */}
      <path d="M12 2C8.13401 2 5 5.13401 5 9c0 3.866 3.13401 7 7 7s7-3.134 7-7c0-3.866-3.134-7-7-7zm0 12c-2.76143 0-5-2.23857-5-5s2.23857-5 5-5 5 2.23857 5 5-2.23857 5-5 5z" />
    </svg>
  ),
  // Add more icons as needed
  // Example:
  armFlex: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* Replace with actual "arm-flex" SVG path */}
      <path d="M12 12l4 4H8l4-4z" />
    </svg>
  ),
  // ... add other icons similarly
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return (
    <div className={`w-12 h-12 ${className}`}>
      {icons[name] || null}
    </div>
  );
};

export default Icon;
