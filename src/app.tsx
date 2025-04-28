// src/app.tsx

"use client";

import React, { useContext } from "react";
import { DarkModeProvider, DarkModeContext } from "./context/DarkModeContext";
import "./styles/globals.css"; // Ensure this path is correct

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <MainApp />
    </DarkModeProvider>
  );
};

const MainApp: React.FC = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Dark Mode Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            // Sun Icon for Light Mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 000 14a7 7 0 000-14z"
              />
            </svg>
          ) : (
            // Moon Icon for Dark Mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Application Content */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center py-8">Food Search App</h1>
        {/* You can add more components here */}
        {/* Example: <SearchBar /> */}
      </div>
    </div>
  );
};

export default App;
