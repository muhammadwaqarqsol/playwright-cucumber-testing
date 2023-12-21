const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "test-result",
  reportPath: "./",
  reportName: "Playwright Automation Report",
  pageTitle: "BookCart App test Report",
  displayDuration:true,
  metadata: {
    browser: {
      name: "chromium",
      version: "120.0.6099.110",
    },
    device: "Waqars-laptop",
    platform: {
      name: "windows",
      version: "10",
    },
  },
  customData: {
    title: "Test Info",
    data: [
      { label: "Project", value: "Book Cart Application project" },
      { label: "Release", value: "1.2.3" },
      { label: "Cycle", value: "smoke-1" },
    ],
  },
});
