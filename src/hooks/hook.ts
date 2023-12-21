import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  AfterStep,
  Status,
} from "@cucumber/cucumber";
import { pageFixture } from "./pageFixture";
import { Browser, BrowserContext } from "@playwright/test";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/utils/logger";
let browser: Browser;
let context: BrowserContext;

const fs = require("fs-extra");

BeforeAll(async function () {
  getEnv();
  browser = await invokeBrowser();
});

Before(async function ({ pickle }) {
  const scenarioName = pickle.name + pickle.id;
  context = await browser.newContext({
    recordVideo: {
      dir: "test-result/videos",
    },
  });
  const page = await context.newPage();
  pageFixture.page = page;
  pageFixture.logger = createLogger(options(scenarioName));
});

AfterStep(async function ({ pickle, result }) {
  const img = await pageFixture.page.screenshot({
    path: `./test-result/screenshots/`,
    type: "png",
  });
  await this.attach(img, "image/png");
});

After(async function ({ pickle, result }) {
  console.log(result);
  let videoPath: () => Promise<string>;
  let img: Buffer;
  if (result?.status == Status.FAILED) {
    const img = await pageFixture.page.screenshot({
      path: `./test-result/screenshots/${pickle.name}.png`,
      type: "png",
    });
    videoPath = await pageFixture.page.video().path;
  }
  //screenshot

  await pageFixture.page.close();
  await context.close();
  if (result?.status == Status.FAILED) {
    await this.attach(img, "image/png");
    await this.attach(fs.readFileSync(videoPath), "video/webm");
  }
});

AfterAll(async function () {
  await browser.close();
});
