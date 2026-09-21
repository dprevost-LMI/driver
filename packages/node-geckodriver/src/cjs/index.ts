/**
 * a top-level `import type` here would emit a trailing `export {}` marker,
 * breaking this file's CommonJS interop (see dist/cjs/package.json)
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
exports.start = async function start (params: import('../types.js').GeckodriverParameters) {
    const esmPkg = await import('../index.js')
    return esmPkg.start(params)
}

exports.download = async function download (geckodriverVersion?: string, cacheDir?: string) {
    const esmPkg = await import('../index.js')
    return esmPkg.download(geckodriverVersion, cacheDir)
}
