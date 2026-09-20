import wdioEslint from '@wdio/eslint'

export default wdioEslint.config([
    {
        ignores: ['**/dist/**']
    },
    /**
     * files outside each package's build tsconfig (bin shims, tests) still
     * get linted, just without full type-aware project checking
     */
    {
        files: [
            'packages/node-*/bin/**/*.js', 'packages/node-*/tests/**/*', 'packages/node-*/vitest.config.mjs',
            'vitest.config.base.mjs', 'eslint.config.mjs', 'scripts/*.mjs', 'packages/e2e/vitest.config.mjs'
        ],
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        'packages/node-*/bin/*.js',
                        'packages/node-*/tests/*.ts',
                        'packages/node-*/tests/interop/*.ts',
                        'packages/node-*/tests/interop/*.js',
                        'packages/node-*/vitest.config.mjs',
                        'vitest.config.base.mjs',
                        'eslint.config.mjs',
                        'scripts/*.mjs',
                        'packages/e2e/vitest.config.mjs'
                    ]
                },
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    /**
     * custom test configuration
     */
    {
        files: ['packages/node-*/tests/**/*'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
])
