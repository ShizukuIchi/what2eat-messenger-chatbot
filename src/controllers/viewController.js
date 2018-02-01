const { getIdFromToken } = require("../utils/messenger.js")

function index(req, res) {
  res.status(200)
  getIdFromToken(req.query.account_linking_token)
    .then(result => {
      console.log(JSON.stringify(result.body))
      res.sendFile(path.resolve(__dirname, "views/edit.html"))
    })
    .catch(console.log)
  return
}

module.exports = {
  index
};
