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
    storageState: getStorageState(pickle.name),
    recordVideo: {
      dir: "test-result/videos",
    },
  });
  const page = await context.newPage();
  pageFixture.page = page;
  pageFixture.logger = createLogger(options(scenarioName));
});

AfterStep(async function ({ pickle, result }) {
  let img: Buffer;
  img = await pageFixture.page.screenshot({
    path: `./test-result/screenshots/${pickle.name}.png`,
    type: "png",
  });
  await this.attach(img, "image/png");
});

After(async function ({ pickle, result }) {
  console.log(result);
  let videoPath: string;
  let img: Buffer;
  if (result?.status == Status.PASSED) {
    img = await pageFixture.page.screenshot({
      path: `./test-result/screenshots/${pickle.name}.png`,
      type: "png",
    });
    videoPath = await pageFixture.page.video().path();
  }

  await pageFixture.page.close();
  await context.close();
  if (result?.status == Status.PASSED) {
    await this.attach(img, "image/png");
    await this.attach(fs.readFileSync(videoPath), "video/webm");
  }
});
AfterAll(async function () {
  await browser.close();
});
function getStorageState(user: string):
  | string
  | {
      cookies: {
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
      }[];
      origins: {
        origin: string;
        localStorage: { name: string; value: string }[];
      }[];
    } {
  if (user.endsWith("admin")) return "src/helper/auth/admin.json";
  else if (user.endsWith("leadrole")) return "src/helper/auth/leadrole.json";
}
