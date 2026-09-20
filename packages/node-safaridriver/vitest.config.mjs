import { defineConfig } from 'vitest/config'
import baseConfig from '../../vitest.config.base.mjs'

export default defineConfig({
    test: {
        ...baseConfig.test,
        exclude: [
            ...baseConfig.test.exclude,
            /**
             * this is a plain Node script (run via the `test:interop` script),
             * not a vitest test
             */
            'tests/interop/**',
        ]
    }
})
