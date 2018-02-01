const path = require("path")
const { getIdFromToken } = require("../utils/messenger.js")


async function index(req, res) {
  let id = await getIdFromToken(req.query.account_linking_token)
  console.log(JSON.stringify(id.body))
  return res.sendFile(path.resolve(__dirname, "/views/edit.html"))
}

module.exports = {
  index
};
