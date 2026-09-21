/**
 * a top-level `import type` here would emit a trailing `export {}` marker,
 * breaking this file's CommonJS interop (see dist/cjs/package.json)
 */
// oxlint-disable-next-line typescript/consistent-type-imports
async function start (params: import('../types.js').EdgedriverParameters) {
    const esmPkg = await import('../index.js')
    return esmPkg.start(params)
}

async function download (edgeVersion?: string, cacheDir?: string) {
    const esmPkg = await import('../index.js')
    return esmPkg.download(edgeVersion, cacheDir)
}

exports.start = start
exports.download = download
module.exports = { start, download }
