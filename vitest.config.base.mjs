import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [
            'dist', '.idea', '.git', '.cache',
            '**/node_modules/**',
        ]
    }
})
