"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo & Description */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start space-x-2"
          >
            <Image
              src="/images/logo.png"
              alt="SportYNE Logo"
              className="h-10 w-auto"
              width={40}
              height={40}
              priority
            />
            {/* Explicitly set the site title to white */}
            <h2 className="text-2xl font-bold text-white">SportYNE</h2>
          </Link>
          <p className="mt-2 text-gray-400">
            Empowering athletes and enthusiasts with cutting-edge sports science
            insights and tools.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:space-x-6 mb-6 md:mb-0 text-center">
          <Link
            href="/"
            className="hover:text-teal-400 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-teal-400 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-teal-400 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="hover:text-teal-400 transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors duration-300"
            aria-label="Facebook"
          >
            <Icon icon="mdi:facebook" className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors duration-300"
            aria-label="Twitter"
          >
            <Icon icon="mdi:twitter" className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors duration-300"
            aria-label="Instagram"
          >
            <Icon icon="mdi:instagram" className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} SportYNE. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
