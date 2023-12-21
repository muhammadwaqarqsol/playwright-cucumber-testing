const fs = require("fs-extra");

try {
  fs.ensureDir("test-result");
  fs.emptyDir("test-result");
} catch (error) {
  console.log("Folder not Created!" + error);
}
