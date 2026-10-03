/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--sans)"],
        mono: ["var(--mono)"],
      },
      colors: {
        border: "var(--line)",
        input: "var(--line)",
        ring: "var(--amber)",
        background: "var(--bg)",
        foreground: "var(--ink)",
        primary: { DEFAULT: "var(--signal)", foreground: "var(--on-signal)" },
        secondary: { DEFAULT: "var(--raised)", foreground: "var(--ink)" },
        muted: { DEFAULT: "var(--raised)", foreground: "var(--ink-muted)" },
        accent: { DEFAULT: "var(--raised)", foreground: "var(--ink)" },
        popover: { DEFAULT: "var(--surface)", foreground: "var(--ink)" },
        card: { DEFAULT: "var(--surface)", foreground: "var(--ink)" },
      },
      borderRadius: { lg: "16px", md: "12px", sm: "8px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
