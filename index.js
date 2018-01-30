const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const crypto = require('crypto');
const router = require("./src/routers");

function getSignature(buf) {
  let hmac = crypto.createHmac("sha1", process.env.FB_APP_SECRET);
  hmac.update(buf, "utf-8");
  return "sha1=" + hmac.digest("hex");
}

function verifyRequest(req, res, buf, encoding) {
  const expected = req.headers['x-hub-signature'];
  const calculated = getSignature(buf);
  console.log("X-Hub-Signature:", expected, "Content:", "-" + buf.toString('utf8') + "-");
  if (expected !== calculated) {
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

const app = express();

app.set('views', './views');
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json({ verify: verifyRequest }))
app.use(bodyParser.urlencoded({extended:false}));
app.use(router);    
app.use(abortOnError);

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

