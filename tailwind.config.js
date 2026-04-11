/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)', // black
        foreground: 'var(--color-foreground)', // white
        primary: {
          DEFAULT: 'var(--color-primary)', // red-600
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // near-black
          foreground: 'var(--color-secondary-foreground)', // white
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // red-600
          foreground: 'var(--color-accent-foreground)', // white
        },
        card: {
          DEFAULT: 'var(--color-card)', // near-black
          foreground: 'var(--color-card-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-900
          foreground: 'var(--color-muted-foreground)', // gray-500
        },
        border: 'var(--color-border)', // dark border
        input: 'var(--color-input)', // dark input
        ring: 'var(--color-ring)', // red focus ring
        popover: {
          DEFAULT: 'var(--color-popover)', // dark
          foreground: 'var(--color-popover-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-400
          foreground: 'var(--color-destructive-foreground)', // white
        },
        success: {
          DEFAULT: 'var(--color-success)', // green-500
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-500
          foreground: 'var(--color-warning-foreground)', // black
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-500
          foreground: 'var(--color-error-foreground)', // white
        },
        surface: 'var(--color-surface)', // very dark surface
        gold: 'var(--color-gold)', // warm gold
      },
      fontFamily: {
        display: ['The Seasons', 'Fraunces', 'serif'],
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
        header: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(3rem, 9vw, 8rem)',
        'hero-sm': 'clamp(2rem, 6vw, 5rem)',
        'display': 'clamp(1.75rem, 4.5vw, 3.5rem)',
        'xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        'sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '500' }],
        'base': ['0.9375rem', { lineHeight: '1.6', fontWeight: '500' }],
      },
      letterSpacing: {
        'widest-2': '0.3em',
        'widest-3': '0.4em',
        'widest-4': '0.5em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};