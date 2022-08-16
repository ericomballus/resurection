const NodeCache = require("node-cache");

// stdTTL: time to live in seconds for every generated cache element.
const cache = new NodeCache({ stdTTL: 30 });

function getUrlFromRequest(req) {
  const url = req.protocol + "://" + req.headers.host + req.originalUrl;
  return url;
}

function set(req, res, next) {
  console.log("je garde dans le cache");
  const url = getUrlFromRequest(req);
  //  cache.set(url, res.locals.data)
  cache.set(url, { products: images });
  return next();
}

function get(req, res, next) {
  console.log("depuis le cache");
  const url = getUrlFromRequest(req);
  const content = cache.get(url);
  if (content) {
    return res.status(200).json(content);
  }
  return next();
}

module.exports = { get, set };
