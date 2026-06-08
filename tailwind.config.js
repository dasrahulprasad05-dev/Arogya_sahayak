/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        number: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        'breath-478': 'breath-478 19s infinite ease-in-out',
        'breath-box': 'breath-box 16s infinite ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'bounce-wave': 'bounce-wave 2s infinite ease-in-out',
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
        'mesh-move': 'mesh-move 20s infinite linear',
      },
      keyframes: {
        'breath-478': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '21.05%': { transform: 'scale(1.5)', opacity: '1' }, // 4s inhale / 19s
          '57.89%': { transform: 'scale(1.5)', opacity: '1' }, // +7s hold / 19s
          '100%': { transform: 'scale(1)', opacity: '0.4' },   // +8s exhale / 19s
        },
        'breath-box': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '25%': { transform: 'scale(1.5)', opacity: '1' },   // 4s inhale / 16s
          '50%': { transform: 'scale(1.5)', opacity: '1' },   // 4s hold / 16s
          '75%': { transform: 'scale(1)', opacity: '0.4' },    // 4s exhale / 16s
          '100%': { transform: 'scale(1)', opacity: '0.4' },  // 4s hold / 16s
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'bounce-wave': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.2), 0 0 10px rgba(139, 92, 246, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.3)' },
        },
        'mesh-move': {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -50px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
          '100%': { transform: 'translate(0px, 0px) rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
