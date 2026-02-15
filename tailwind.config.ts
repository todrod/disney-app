import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ========================================
         LANDIO COLOR SYSTEM
         ======================================== */
      colors: {
        /* Backgrounds - Dark mode (default) */
        bg: {
          DEFAULT: 'var(--color-bg)',
          dark: '#0a0e17',
          light: '#f8fafc',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          dark: '#121827',
          light: '#ffffff',
        },
        surface2: {
          DEFAULT: 'var(--color-surface2)',
          dark: '#1a2335',
          light: '#f1f5f9',
        },
        surface3: {
          DEFAULT: 'var(--color-surface3)',
          dark: '#243045',
          light: '#e2e8f0',
        },

        /* Borders */
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
          focus: '#4f63ff',
        },

        /* Typography - WCAG AA compliant */
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          faint: 'var(--color-text-faint)',
        },

        /* Accents */
        accent: {
          DEFAULT: '#4f63ff',
          hover: '#6b7bff',
        },
        accent2: {
          DEFAULT: '#a855f7',
          hover: '#c084fc',
        },

        /* Semantic colors */
        danger: {
          DEFAULT: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        success: {
          DEFAULT: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        info: {
          DEFAULT: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.1)',
        },

        /* ========================================
           DISNEY PARKS THEME COLORS (Preserved)
           ======================================== */
        disney: {
          blue: "#0063B2",
          purple: "#5B2E8C",
          gold: "#F5A623",
        },
        magic: {
          kingdom: "#0078D4",
        },
        epcot: {
          primary: "#7C3AED",
        },
        hollywood: {
          primary: "#DC2626",
        },
        animal: {
          primary: "#16A34A",
        },
      },

      /* ========================================
         LANDIO TYPOGRAPHY
         ======================================== */
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },

      fontSize: {
        /* Display scale */
        'display-xs': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'display-sm': ['0.875rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'display-base': ['1rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'display-md': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-lg': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-2xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-3xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
      },

      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },

      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },

      lineHeight: {
        tight: '1.2',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },

      /* ========================================
         LANDIO SPACING & BORDERS
         ======================================== */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      /* ========================================
         LANDIO SHADOWS
         ======================================== */
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        med: '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        '3xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'lg-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'xl-inner': 'inset 0 4px 6px 0 rgba(0, 0, 0, 0.08)',
        /* Disney shadows preserved */
        magical: '0 0 20px rgba(0, 99, 178, 0.3), 0 0 40px rgba(91, 46, 140, 0.2)',
        glow: '0 0 15px rgba(245, 166, 35, 0.4), 0 0 30px rgba(245, 166, 35, 0.2)',
      },

      /* ========================================
         LANDIO TRANSITIONS & ANIMATIONS
         ======================================== */
      transitionDuration: {
        '150': '150ms',
        '350': '350ms',
      },

      animation: {
        'fade-in': 'fadeIn 150ms ease',
        'slide-up': 'slideUp 250ms ease',
        'scale-in': 'scaleIn 150ms ease',
        /* Disney animations preserved */
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },

      keyframes: {
        /* Landio animations */
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        /* Disney animations preserved */
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
