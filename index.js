const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const crypto = require('crypto');
const router = require("./src/routers");

function getSignature(buf) {
  let hmac = crypto.createHmac("sha1", process.env.FB_PAGE_ACCESS_TOKEN);
  hmac.update(buf, "utf-8");
  return "sha1=" + hmac.digest("hex");
}
function getSignature2(buf) {
  let hmac = crypto.createHmac("sha1", process.env.FB_APP_SECRET);
  hmac.update(buf, "utf-8");
  return "sha1=" + hmac.digest("hex");
}

function verifyRequest(req, res, buf, encoding) {
  const expected = req.headers['x-hub-signature'];
  let buf2 = buf
  let calculated = getSignature(buf);
  let calculated2 = getSignature2(buf2);
  // console.log("X-Hub-Signature:", expected, "Content:", "-" + buf.toString('utf8') + "-");
  console.log("X-Hub-Signature:", expected);
  console.log("same1? ", calculated)
  console.log("same2? ", calculated2)
  if (expected !== calculated && expected !== calculated2) {
    throw new Error("Invalid signature.");
  } else {
    console.log("Valid signature!");
  }
}

function abortOnError(err, req, res, next) {
  if (err) {
    console.log(err);
    res.status(400).send({ error: "Invalid signature." });
  } else {
    next();
  }
}

app.set('views', './views');
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json({ verify: verifyRequest }))
app.use(router);    
app.use(abortOnError);

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

