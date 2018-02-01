const path = require("path")
const { getIdFromToken } = require("../utils/messenger.js")


async function index(req, res) {
  let id = await getIdFromToken(req.query.account_linking_token)
  console.log(JSON.stringify(id.body))
  return res.render("edit", req.query)
}

function testGET(req, res) {
  console.log(JSON.stringify(req.query))
  return res.sendStatus(200)
}

function testPOST(req, res) {
  console.log(JSON.stringify(req.body))
  return res.sendStatus(200)
}

module.exports = {
  index,
  testGET,
  testPOST
};
