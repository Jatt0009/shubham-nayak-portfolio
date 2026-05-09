import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F5F2",
        foreground: "#1C1C1C",
        accent: {
          light: "#B6FF00",
          DEFAULT: "#B6FF00",
          dark: "#8FBF00",
          ink: "#4D6F00",
        },
        secondary: "#6B6B6B",
        divider: "#E5E5E5",
        white: {
          5: "rgba(255, 255, 255, 0.05)",
          10: "rgba(255, 255, 255, 0.1)",
          20: "rgba(255, 255, 255, 0.2)",
        },
        dark: {
          900: "#0a0a0a",
          800: "#171717",
          700: "#262626",
        }
      },
      fontFamily: {
        heading: ["Clash Display", "sans-serif"],
        body: ["Cabinet Grotesk", "sans-serif"],
        satoshi: ["Satoshi", "system-ui", "sans-serif"],
      },
      fontSize: {
        'heading-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading-md': ['2.25rem', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
};
export default config;
