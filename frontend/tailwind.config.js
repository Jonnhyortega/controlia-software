/** @type {import('tailwindcss').Config} */
export const content = [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const darkMode = 'class';
export const theme = {
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
                50: '#eef6ff',
                100: '#dbeeff',
                200: '#b6ddff',
                300: '#8acbff',
                400: '#57b4ff',
                500: '#1e90ff',
                600: "hsl(var(--primary))", // Linked to main primary
                700: '#1d4ed8',
                800: '#1a3ab0',
                900: '#153087',
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
            surface: {
                DEFAULT: '#0b0b0b',
                50: '#ffffff',
            },
            success: '#16a34a',
        },
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Inter Tight', 'system-ui', 'sans-serif'],
        },
        borderRadius: {
            lg: '14px',
            xl: '18px',
            pill: '9999px',
        },
        boxShadow: {
            card: '0 6px 18px rgba(2,6,23,0.35)',
            soft: '0 3px 10px rgba(2,6,23,0.15)',
        },
    }
};
export const plugins = [];
