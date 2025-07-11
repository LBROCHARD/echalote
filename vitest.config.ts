import path from "path";
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vitest/config";


export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setup',
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})