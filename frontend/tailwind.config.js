/** @type {import('tailwindcss').Config} */
export const content = [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const darkMode = 'class';
export const theme = {
    extend: {
        colors: {
            primary: {
                DEFAULT: '#2563eb',
                50: '#eef6ff',
                100: '#dbeeff',
                200: '#b6ddff',
                300: '#8acbff',
                400: '#57b4ff',
                500: '#1e90ff',
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1a3ab0',
                900: '#153087',
            },
            accent: '#7c3aed',
            surface: {
                DEFAULT: '#0b0b0b',
                50: '#ffffff',
            },
            muted: '#6b7280',
            success: '#16a34a',
            destructive: '#dc2626',
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
