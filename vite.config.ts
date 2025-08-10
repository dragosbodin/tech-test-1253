import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { BASE_PATH } from './src/constants'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        base: BASE_PATH,
        root: '',
        resolve: {
            alias: {
                styles: path.resolve(__dirname, 'src/styles'),
            },
        },
        plugins: [react(), tsconfigPaths(), visualizer({ open: true })],
        build: {
            manifest: true,
            rollupOptions: {
                input: ['./index.html', './src/main.tsx'],
            },
            target: 'esnext',
            sourcemap: true,
        },
        test: {
            clearMocks: true,
            coverage: {
                enabled: true,
                provider: 'v8',
                reportsDirectory: 'coverage',
                reporter: ['lcov', 'html', 'text', 'text-summary'],
                include: ['src/**/*'],
            },
            reporters: ['default', ['junit', { outputFile: 'junit.xml' }]],
            exclude: ['./dist'],
        },
    }
})
