import { defineConfig } from 'vitest/config'
import baseConfig from '../../vitest.config.base.mjs'

export default defineConfig({
    test: {
        ...baseConfig.test,
        /**
         * these tests hit real network/binaries/browsers, default 5s is too short
         */
        testTimeout: 60_000,
        /**
         * test files use real, shared system resources (network ports, driver
         * binaries) and must not run concurrently against each other
         */
        fileParallelism: false
    }
})
