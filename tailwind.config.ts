import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        frontend: {
          bg: "#0F172A",
          card: "#1E293B",
          accent: "#2DD4BF",
          muted: "#94A3B8"
        },
        admin: {
          sidebar: "#1E293B",
          bg: "#F8FAFC",
          logo: "#F97316",
          action: {
            article: "#F97316",
            epaper: "#10B981",
            highlight: "#334155",
            notification: "#FBBF24"
          }
        },
        pastel: {
          peach: "#FDE68A",
          mint: "#A7F3D0",
          sky: "#BAE6FD",
          lilac: "#DDD6FE"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        "admin-glow":
          "radial-gradient(circle at top right, rgba(249,115,22,0.14), transparent 35%), radial-gradient(circle at left center, rgba(45,212,191,0.08), transparent 28%)",
        "portal-grid":
          "linear-gradient(135deg, rgba(45,212,191,0.14), transparent 42%), radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 26%)"
      }
    }
  },
  plugins: []
};

export default config;
