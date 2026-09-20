import waitPort from 'wait-port'
import { remote } from 'webdriverio'
import { describe, it } from 'vitest'

import { download, start } from 'geckodriver'

describe('Geckodriver E2E Tests', () => {
    let firefoxBinary: string | undefined

    it('start geckodriver automatically', async () => {
        const browser = await remote({
            automationProtocol: 'webdriver',
            capabilities: {
                browserName: 'firefox',
                'moz:firefoxOptions': {
                    args: ['-headless']
                }
            }
        })
        await browser.url('https://webdriver.io')
        await browser.deleteSession()
    })

    it('start specific geckodriver', async () => {
        const binary = await download()

        const browser = await remote({
            automationProtocol: 'webdriver',
            capabilities: {
                browserName: 'firefox',
                'moz:firefoxOptions': {
                    args: ['-headless']
                },
                'wdio:geckodriverOptions': {
                    binary
                }
            }
        })

        /**
         * reuse downloaded Firefox for next test
         */
        firefoxBinary = browser.requestedCapabilities['moz:firefoxOptions'].binary

        await browser.url('https://webdriver.io')
        await browser.deleteSession()
    })

    it('start geckodriver manually', async () => {
        const port = 4444
        const cp = await start({ port })

        try {
            await waitPort({ port })
            const browser = await remote({
                automationProtocol: 'webdriver',
                hostname: '0.0.0.0',
                port, // must set port or wdio will automatically start geckodriver
                capabilities: {
                    browserName: 'firefox',
                    'moz:firefoxOptions': {
                        binary: firefoxBinary,
                        args: ['-headless']
                    }
                }
            })
            await browser.url('https://webdriver.io')
            await browser.deleteSession()
        } finally {
            cp.kill()
        }
    })
})
