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
        fileParallelism: false,
        /**
         * these tests spawn real child processes (driver binaries, which in
         * turn spawn a real browser). vitest's default 'forks' pool runs
         * tests in a forked child process, and nested subprocess spawning
         * from inside that fork can crash the fork's IPC channel ("Worker
         * exited unexpectedly"). Worker threads don't have that conflict.
         */
        pool: 'threads'
    }
})
