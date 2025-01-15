const compression = require("compression");

const compressionConfig = { filter: shouldCompress };
function shouldCompress(req, res) {
  const encoding = req.headers["accept-encoding"] ?? "";
  if (!encoding.includes("gzip")) {
    console.log("does not accept gzip encoding");
    return false;
  }
  return compression.filter(req, res);
}

module.exports.enableGZipCompression = (app) => {
  app.use(compression(compressionConfig));
  console.log("gzip compression enabled");
};
