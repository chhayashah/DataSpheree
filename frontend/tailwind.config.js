/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1120",
          soft: "#131B2E",
          border: "#1F2A44",
        },
        canvas: "#F6F7FB",
        border: "#E4E7EE",
        accent: {
          DEFAULT: "#3B5BFD",
          soft: "#EEF1FF",
          hover: "#2F4BE0",
        },
        success: { DEFAULT: "#16A34A", soft: "#EAFBF1" },
        warning: { DEFAULT: "#D97706", soft: "#FEF6E7" },
        danger: { DEFAULT: "#DC2626", soft: "#FDEDED" },
        data: { teal: "#0EA5A4", violet: "#7C6CF6", amber: "#F0A93A" },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 6px rgba(15, 23, 42, 0.04)",
        popover: "0 8px 24px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
        toastIn: {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
        "toast-in": "toastIn 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
