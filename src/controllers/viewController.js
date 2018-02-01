const { getIdFromToken } = require("../utils/messenger.js")

function index(req, res) {
  getIdFromToken(req.query.account_linking_token)
    .then(res => {
      console.log(JSON.stringify(res))
    })
    .catch(console.log)
  return res.sendStatus(200)
}

module.exports = {
  index
};
