// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    // base: '/example/',
    build: {
        rollupOptions: {
            input: {
                nested: resolve(__dirname, 'example'),
            },
        },
    },
})