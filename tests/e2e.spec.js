const puppeteer = require('puppeteer')
const mocha = require('mocha')
const { setTimeout } = require('node:timers/promises')
const expect = require('expect.js')
const LoginPage = require('../pages/LoginPage')

describe('e2e test', () => {
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

  it('Eshop flow', async () => {
    let loginPage = new LoginPage(page)

    await loginPage.open()
    //await page.goto('https://www.saucedemo.com/')
    //await page.waitForSelector('.login_container')

    // Submit login form
    await loginPage.login('standard_user', 'secret_sauce')
    // await page.type('#user-name', 'standard_user', { delay: 100 })
    // await page.type('#password', 'secret_sauce', { delay: 100 })
    // await page.click('#login-button')

    // open product detail
    await page.click('#item_4_title_link')

    // Add to cart
    await page.click('#add-to-cart')

    // Go to cart
    await page.click('.shopping_cart_link')
    await page.waitForSelector('.cart_desc_label')

    // Go to checkout
    await page.click('#checkout')

    //Fill the info
    await page.waitForSelector('.form_group')
    await page.type('#first-name', 'narender', { delay: 100 })
    await page.type('#last-name', 'saharan', { delay: 100 })
    await page.type('#postal-code', '335512', { delay: 100 })
    await page.click('#continue')
    await page.click('#finish')

    // Assertion
    await page.waitForSelector('.complete-header')
    await page.waitForSelector('#back-to-products')
  })
})
