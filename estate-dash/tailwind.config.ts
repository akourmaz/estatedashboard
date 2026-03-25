import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elevation System — green-black tinted (Mintlify style)
        canvas: "#0B0F0E",
        surface: "#111916",
        elevated: "#1A2420",
        overlay: "#222E2A",
        hover: "#162018",
        active: "#1D2A25",

        // Card backgrounds — teal-tinted
        card: {
          DEFAULT: "#0E1A1A",
          hover: "#112220",
        },

        // Accent — Single neon green / mint (NO secondary accent)
        accent: {
          primary: "#00FFB2",
          "primary-hover": "#00E6A0",
          "primary-muted": "rgba(0, 255, 178, 0.12)",
          "primary-subtle": "rgba(0, 255, 178, 0.06)",
        },

        // Semantic Colors (unchanged)
        semantic: {
          success: "#10B981",
          "success-muted": "rgba(16, 185, 129, 0.15)",
          warning: "#F59E0B",
          "warning-muted": "rgba(245, 158, 11, 0.15)",
          danger: "#EF4444",
          "danger-muted": "rgba(239, 68, 68, 0.15)",
          info: "#06B6D4",
          "info-muted": "rgba(6, 182, 212, 0.15)",
        },

        // Text Colors
        "text-primary": "#EAEAEA",
        "text-secondary": "#9AA3A0",
        "text-tertiary": "#5C6A7E",
        "text-disabled": "#3D4654",
        "text-inverse": "#0B0F0E",

        // Border Colors
        "border-subtle": "rgba(255, 255, 255, 0.05)",
        "border-default": "rgba(255, 255, 255, 0.08)",
        "border-strong": "rgba(255, 255, 255, 0.14)",
        "border-accent": "rgba(0, 255, 178, 0.30)",
        "border-card": "rgba(0, 255, 178, 0.12)",

        // Badge Colors — Finishing Types
        "badge-bf": "#94A3B8",
        "badge-bf-bg": "rgba(148, 163, 184, 0.15)",
        "badge-wf": "#E2E8F0",
        "badge-wf-bg": "rgba(226, 232, 240, 0.12)",
        "badge-gf": "#A78BFA",
        "badge-gf-bg": "rgba(167, 139, 250, 0.15)",
        "badge-turnkey": "#34D399",
        "badge-turnkey-bg": "rgba(52, 211, 153, 0.15)",

        // Badge Colors — Property Types
        "badge-apartment": "#60A5FA",
        "badge-apartment-bg": "rgba(96, 165, 250, 0.15)",
        "badge-residential": "#34D399",
        "badge-residential-bg": "rgba(52, 211, 153, 0.15)",
        "badge-villa": "#FBBF24",
        "badge-villa-bg": "rgba(251, 191, 36, 0.15)",
        "badge-townhouse": "#F87171",
        "badge-townhouse-bg": "rgba(248, 113, 113, 0.15)",

        // WhatsApp green
        whatsapp: "#25D366",
      },

      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },

      fontSize: {
        display: [
          "28px",
          {
            lineHeight: "1.2",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          },
        ],
        h1: [
          "22px",
          {
            lineHeight: "1.3",
            fontWeight: "600",
            letterSpacing: "-0.01em",
          },
        ],
        h2: [
          "18px",
          {
            lineHeight: "1.35",
            fontWeight: "600",
            letterSpacing: "-0.01em",
          },
        ],
        h3: [
          "15px",
          {
            lineHeight: "1.4",
            fontWeight: "600",
          },
        ],
        body: [
          "14px",
          {
            lineHeight: "1.5",
            fontWeight: "400",
          },
        ],
        "body-medium": [
          "14px",
          {
            lineHeight: "1.5",
            fontWeight: "500",
          },
        ],
        small: [
          "12px",
          {
            lineHeight: "1.5",
            fontWeight: "400",
            letterSpacing: "0.01em",
          },
        ],
        xs: [
          "11px",
          {
            lineHeight: "1.4",
            fontWeight: "500",
            letterSpacing: "0.02em",
          },
        ],
      },

      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
        md: "0 4px 12px rgba(0, 0, 0, 0.4)",
        lg: "0 8px 30px rgba(0, 0, 0, 0.5)",
        xl: "0 16px 48px rgba(0, 0, 0, 0.6)",
        "focus-ring":
          "0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--accent-primary)",
        "accent-glow": "0 0 0 3px rgba(0, 255, 178, 0.15)",
        "glow-sm": "0 0 10px rgba(0, 255, 178, 0.06)",
        "glow-md": "0 0 20px rgba(0, 255, 178, 0.08), 0 0 40px rgba(0, 255, 178, 0.04)",
        "glow-lg": "0 0 30px rgba(0, 255, 178, 0.10), 0 0 60px rgba(0, 255, 178, 0.05)",
      },

      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
      },

      maxWidth: {
        dashboard: "1440px",
      },

      height: {
        header: "64px",
        "search-bar": "48px",
      },

      backdropBlur: {
        header: "12px",
      },

      animation: {
        "slide-down": "slideDown 250ms ease-out",
        "slide-up": "slideUp 200ms ease-in",
        "fade-in": "fadeIn 200ms ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "count-up": "countUp 500ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
        "slide-out-right": "slideOutRight 200ms ease-in",
      },

      keyframes: {
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-8px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
      },

      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        layout: "250ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
