import { copyFileSync } from 'node:fs'

copyFileSync('src/cjs/package.json', 'dist/cjs/package.json')
