"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDarkMode } from "./DarkModeProvider";
import { Icon } from "@iconify/react";

// Define navigation items (used for both desktop & mobile)
const navItems = [
  "Anatomy",
  "Physiology",
  "Biomechanics",
  "Nutrition",
  "Exercise Physiology",
  "Sports Psychology",
  "Environmental Physiology",
  "Injury Prevention and Recovery",
  "Strength and Conditioning",
  "Case Studies",
  "Need Analysis",
  "Program Designing",
];

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Desktop dropdown state for "Find Spaces"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Mobile menu & dropdown state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Ref for mobile menu container
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // --- Desktop Dropdown Handlers (Hover) ---
  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ensure mobile dropdown is closed when the mobile menu is closed
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileDropdownOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside of it
  useEffect(() => {
    function handleMobileClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleMobileClickOutside);
    } else {
      document.removeEventListener("mousedown", handleMobileClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleMobileClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white dark:bg-gray-900 py-4 px-6 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo & Site Title */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/images/logo.png"
            alt="SportYNE Logo"
            className="h-10 w-auto border border-transparent dark:border-white rounded"
            width={40}
            height={40}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            SportYNE
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Icon
                icon="mdi:weather-sunny"
                className="text-yellow-400 w-5 h-5"
              />
            ) : (
              <Icon
                icon="mdi:moon-waning-crescent"
                className="text-gray-800 w-5 h-5"
              />
            )}
          </button>

          {/* "Find Spaces" Dropdown (Desktop) */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              Find Spaces <span className="ml-1">&#x25BC;</span>
            </button>
            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10"
                role="menu"
                aria-label="Find Spaces Dropdown"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
                  {navItems.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* About Link */}
          <Link
            href="/about"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
          >
            About
          </Link>
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="md:hidden flex items-center">
          {/* Dark Mode Toggle (always visible on mobile) */}
          <button
            onClick={toggleDarkMode}
            className="p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Icon
                icon="mdi:weather-sunny"
                className="text-yellow-400 w-5 h-5"
              />
            ) : (
              <Icon
                icon="mdi:moon-waning-crescent"
                className="text-gray-800 w-5 h-5"
              />
            )}
          </button>
          {/* Hamburger / Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <Icon
                icon="mdi:close"
                className="w-6 h-6 text-gray-800 dark:text-white"
              />
            ) : (
              <Icon
                icon="mdi:menu"
                className="w-6 h-6 text-gray-800 dark:text-white"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef}>
          <nav className="md:hidden mt-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <button
                  onClick={() =>
                    setIsMobileDropdownOpen(!isMobileDropdownOpen)
                  }
                  className="w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isMobileDropdownOpen}
                >
                  Find Spaces <span className="ml-1">&#x25BC;</span>
                </button>
                {isMobileDropdownOpen && (
                  <ul className="mt-2 pl-4 border-l border-gray-300 dark:border-gray-700">
                    {navItems.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
