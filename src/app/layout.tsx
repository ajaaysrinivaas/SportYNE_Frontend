// src/app/layout.tsx

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/globals.css";
import DarkModeProvider from "@/components/DarkModeProvider"; // New Client Component

export const metadata = {
  title: "Sportyne - Your Next Evolution",
  description: "High-quality sports science resources and tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {/* DarkModeProvider wraps the application to provide dark mode context */}
        <DarkModeProvider>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}
