const { writeFileSync } = require("fs");
const path = require("path");
const localLogPath = path.join(path.dirname(__dirname), "logs", "local-logs");
console.log({ localLogPath });
function saveLogInFile(fileName, data) {
  // const isDevENV = process?.env?.NODE_ENV === "development";
  //   if (!isDevENV) return;
  try {
    writeFileSync(
      path.join(localLogPath, `${Date.now()}-${fileName}`),
      typeof data !== "string" ? JSON.stringify(data, null, 2) : data,
      "utf-8"
    );
  } catch (ignoreError) {}
}

module.exports = { saveLogInFile };
