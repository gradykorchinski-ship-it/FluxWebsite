/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3C6EB4', // Fedora-ish blue
                    hover: '#294172',
                    light: '#5E8ACA',
                },
                secondary: {
                    DEFAULT: '#22cc99', // A fresh accent color (minty green for "Flux")
                    hover: '#1aa87d',
                },
                dark: {
                    DEFAULT: '#0f172a', // Slate 900
                    lighter: '#1e293b', // Slate 800
                    card: '#1e293b',
                },
                light: {
                    DEFAULT: '#ffffff',
                    gray: '#f8fafc',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    darkMode: 'media', // or 'class'
    plugins: [],
}
