import { test, expect } from 'vitest'

import * as pkgExports from '../src/index.js'

test('exports', () => {
    expect(typeof pkgExports.download).toBe('function')
    expect(typeof pkgExports.findEdgePath).toBe('function')
    expect(typeof pkgExports.start).toBe('function')
})
