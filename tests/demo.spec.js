const puppeteer = require('puppeteer')
const mocha = require('mocha')
const { setTimeout } = require('node:timers/promises')
const expect = require('expect.js')

describe('puppeteer demo', () => {
  let browser
  let page

  let browserOptions = {
    headless: false,
    timeout: 15000,
    devtools: false,
  }

  let viewportOptions = {
    width: 1200,
    height: 720,
  }

  beforeEach(async () => {
    browser = await puppeteer.launch(browserOptions)
    page = await browser.newPage()
    await page.setViewport(viewportOptions)
  })

  afterEach(async () => {
    await browser.close()
  })

  it('Browser Actions', async () => {
    await page.goto('https://example.com/')
    await setTimeout(2000)

    const pageTitle = await page.title()
    const pageUrl = await page.url()

    // await page.evaluate(() => {
    //   debugger
    // })

    expect(pageTitle).to.contain('Example Domain')
    expect(pageUrl).to.contain('example.com')

    await page.waitForSelector('h1')
  })

  it('Web Elements - inputs, Buttons', async () => {
    await page.goto('https://www.saucedemo.com/')
    await page.waitForSelector('form')

    await page.type('input[placeholder="Username"]', 'username', { delay: 500 })
    await page.type('#password', 'password')
    await page.click('[data-test="login-button"]')

    await page.waitForSelector('.error')

    await setTimeout(3000)
  })

  it('Multimedia', async () => {
    await page.goto('https://www.saucedemo.com/')
    await page.waitForSelector('form')

    await page.screenshot({ path: 'my-screenshot.png' })
    await page.pdf({ path: 'my-pdf.pdf' })
  })

  it('Device Emulation', async () => {
    const { KnownDevices } = require('puppeteer')
    const iPhone = KnownDevices['iPhone 15 Pro']

    await page.emulate(iPhone)
    await page.goto('https://www.saucedemo.com/')
    console.log(KnownDevices['iPhone 15 Pro'])

    await setTimeout(2000)
  })

  it.only('File Upload', async () => {
    await page.goto('https://qa-automation-practice.netlify.app')
    await page.click('#file-upload-item')

    const fileInput = await page.$('input[type="file"]')
    const fileToUpload = 'text.txt'

    await fileInput.uploadFile(fileToUpload)

    await page.click('button[type="submit"]')

    await page.waitForSelector('#file_upload_response')

    await logTitle(page)
  })
})

async function logTitle(page) {
  console.log('Log from custom function: ' + (await page.title()))
}
