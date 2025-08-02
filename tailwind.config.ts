import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#335c67', // dark_slate_gray
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          foreground: '#fff3b0', // vanilla
        },
        // blue: {
        //   DEFAULT: '#335c67', // dark_slate_gray
        //   50: '#eff6ff',
        //   100: '#dbeafe',
        //   200: '#bfdbfe',
        //   300: '#93c5fd',
        //   400: '#60a5fa',
        //   500: '#3b82f6',
        //   600: '#2563eb',
        //   700: '#1d4ed8',
        //   800: '#1e40af',
        //   900: '#1e3a8a',
        //   950: '#172554',
        // },        
        secondary: {
          DEFAULT: '#fff3b0', // vanilla
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          foreground: '#335c67', // dark_slate_gray
        },
        accent: {
          DEFAULT: '#e09f3e', // hunyadi_yellow
          100: '#312108',
          200: '#624110',
          300: '#936218',
          400: '#c48320',
          500: '#e09f3e',
          600: '#e6b265',
          700: '#ecc58b',
          800: '#f2d9b2',
          900: '#f9ecd8',
          foreground: '#335c67', // dark_slate_gray
        },
        destructive: {
          DEFAULT: '#9e2a2b', // auburn
          100: '#1f0809',
          200: '#3f1111',
          300: '#5e191a',
          400: '#7e2123',
          500: '#9e2a2b',
          600: '#cb3a3d',
          700: '#d86c6d',
          800: '#e59d9e',
          900: '#f2cece',
          foreground: '#fff3b0', // vanilla
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        dark_slate_gray: {
          DEFAULT: '#335c67',
          100: '#0a1215',
          200: '#142429',
          300: '#1e373e',
          400: '#284952',
          500: '#335c67',
          600: '#4a8696',
          700: '#6fa9b8',
          800: '#9fc5d0',
          900: '#cfe2e7',
        },
        vanilla: {
          DEFAULT: '#fff3b0',
          100: '#574a00',
          200: '#ad9300',
          300: '#ffda05',
          400: '#ffe75c',
          500: '#fff3b0',
          600: '#fff6c2',
          700: '#fff8d1',
          800: '#fffae0',
          900: '#fffdf0',
        },
        hunyadi_yellow: {
          DEFAULT: '#e09f3e',
          100: '#312108',
          200: '#624110',
          300: '#936218',
          400: '#c48320',
          500: '#e09f3e',
          600: '#e6b265',
          700: '#ecc58b',
          800: '#f2d9b2',
          900: '#f9ecd8',
        },
        auburn: {
          DEFAULT: '#9e2a2b',
          100: '#1f0809',
          200: '#3f1111',
          300: '#5e191a',
          400: '#7e2123',
          500: '#9e2a2b',
          600: '#cb3a3d',
          700: '#d86c6d',
          800: '#e59d9e',
          900: '#f2cece',
        },
        chocolate_cosmos: {
          DEFAULT: '#540b0e',
          100: '#110203',
          200: '#220405',
          300: '#330708',
          400: '#45090b',
          500: '#540b0e',
          600: '#9f1519',
          700: '#e2242a',
          800: '#ec6d71',
          900: '#f5b6b8',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
