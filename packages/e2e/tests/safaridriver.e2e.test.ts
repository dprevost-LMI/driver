import waitPort from 'wait-port'
import { remote } from 'webdriverio'
import { describe, it } from 'vitest'

import { start, stop } from 'safaridriver'

describe.skipIf(process.platform !== 'darwin')('Safaridriver E2E Tests', () => {
    it('start safaridriver manually', async () => {
        const port = 4444
        start({ port })

        try {
            await waitPort({ port })
            const browser = await remote({
                automationProtocol: 'webdriver',
                port,
                capabilities: {
                    browserName: 'safari'
                }
            })
            await browser.url('https://guinea-pig.webdriver.io/')
            await browser.deleteSession()
        } finally {
            stop()
        }
    })
})
