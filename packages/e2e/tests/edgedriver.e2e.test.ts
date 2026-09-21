import waitPort from 'wait-port'
import { execSync } from 'node:child_process'
import { remote } from 'webdriverio'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { beforeEach, afterEach, describe, it } from 'vitest'

import { start, download, findEdgePath } from 'edgedriver'

describe('Edgedriver E2E Tests', () => {
    /**
     * Give every test its own driver cache dir instead of the shared default
     * (EDGEDRIVER_CACHE_DIR or os.tmpdir()). Tests used to all download into
     * the same /tmp/msedgedriver and delete-then-redownload it between tests,
     * which raced against whatever process the previous test hadn't fully
     * torn down yet.
     */
    let cacheDir = ''

    beforeEach(async () => {
        cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'edgedriver-e2e-'))

        /**
         * Force-kill any leftover msedgedriver/Edge processes from a previous test.
         * cp.kill() below isn't guaranteed to have fully torn down the Edge browser
         * process it spawned by the time the next test starts; a lingering instance
         * here can push memory over the CI runner's limit and get OOM-killed
         * (surfaces as a bare "Killed" + exit 137 in the next test).
         */
        for (const pattern of ['msedgedriver', 'microsoft-edge']) {
            try {
                execSync(`pkill -9 -f ${pattern}`)
            } catch {
                // no matching process running, nothing to clean up
            }
        }
    })

    afterEach(async () => {
        await fs.rm(cacheDir, { recursive: true, force: true })
    })

    it('start edgedriver manually', async () => {
        const port = 4444
        const cp = await start({ port, cacheDir })

        try {
            await waitPort({ port: 4444 })
            const browser = await remote({
                port,
                capabilities: {
                    browserName: 'MicrosoftEdge',
                    'ms:edgeOptions': {
                        binary: findEdgePath(),
                        args: [
                            'no-sandbox',
                            'headless'
                        ]
                    }
                }
            })
            await browser.url('https://guinea-pig.webdriver.io/')
            await browser.deleteSession()
        } finally {
            cp.kill()
            await new Promise((resolve) => cp.once('exit', resolve))
        }
    })

    it('start specific edgedriver', async () => {
        const binary = await download(undefined, cacheDir)

        const browser = await remote({
            automationProtocol: 'webdriver',
            capabilities: {
                browserName: 'edge',
                'ms:edgeOptions': {
                    args: ['no-sandbox', 'headless']
                },
                'wdio:edgedriverOptions': {
                    binary
                }
            }
        })
        await browser.url('https://guinea-pig.webdriver.io/')
        await browser.deleteSession()
    })

    it('start with missing architecture', async () => {
        const binary = await download('152.0.4191.77', cacheDir)

        const browser = await remote({
            automationProtocol: 'webdriver',
            capabilities: {
                browserName: 'edge',
                'ms:edgeOptions': {
                    args: ['no-sandbox', 'headless']
                },
                'wdio:edgedriverOptions': {
                    binary
                }
            }
        })
        await browser.url('https://guinea-pig.webdriver.io/')
        await browser.deleteSession()
    })
})
