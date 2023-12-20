import { BeforeAll, AfterAll, Before, After } from "@cucumber/cucumber";
import { pageFixture } from "./pageFixture";
import { Browser, Page, chromium } from "@playwright/test";
let browser: Browser;
let page: Page;
Before(async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  pageFixture.page = page;
});

After(async function () {
  await page.close();
  await browser.close();
});
