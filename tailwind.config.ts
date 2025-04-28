// tailwind.config.ts

import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}", // Include the App Directory if used
  ],
  theme: {
    extend: {
      colors: {
        // Core Colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",

        // New Custom Light Background Color
        'custom-light': 'rgba(245, 240, 235, 0.95)', // Subtle mix of red, white, beige, and gray

        // Gradients and Accents
        accent: "var(--accent)",
        'primary-gradient-start': "var(--primary-gradient-start)",
        'primary-gradient-end': "var(--primary-gradient-end)",
        'secondary-gradient-start': "var(--secondary-gradient-start)",
        'secondary-gradient-end': "var(--secondary-gradient-end)",
      },
      borderRadius: {
        custom: "var(--border-radius)",
      },
      boxShadow: {
        custom: "var(--box-shadow)",
        'md-dark': "0 4px 6px rgba(0, 0, 0, 0.5)", // Dark mode-specific shadow
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"), // Ensure 'foreground' exists in the colors section
            a: {
              color: theme("colors.primary"), // Ensure 'primary' exists in the colors section
              "&:hover": {
                color: theme("colors.secondary"), // Ensure 'secondary' exists in the colors section
              },
            },
            blockquote: {
              borderLeftColor: theme("colors.muted"), // Ensure 'muted' exists in the colors section
              color: theme("colors.muted"),
            },
            h1: { color: theme("colors.foreground") },
            h2: { color: theme("colors.foreground") },
            h3: { color: theme("colors.foreground") },
          },
        },
        dark: {
          css: {
            color: theme("colors.foreground"),
            a: {
              color: theme("colors.secondary"),
              "&:hover": {
                color: theme("colors.primary"),
              },
            },
            blockquote: {
              borderLeftColor: theme("colors.muted"),
              color: theme("colors.muted"),
            },
            h1: { color: theme("colors.foreground") },
            h2: { color: theme("colors.foreground") },
            h3: { color: theme("colors.foreground") },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
    forms,
    // Add additional plugins here if needed
  ],
};

export default config;
