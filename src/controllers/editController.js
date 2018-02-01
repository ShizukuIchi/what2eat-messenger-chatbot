const path = require("path");
const db = require("../utils/db.js")
const { getIdFromToken } = require("../utils/messenger.js")

function edit(req, res) {
  if(req.query.redirect_uri === undefined || req.query.account_linking_token === undefined)
    return res.status(400).send("bad request");
  return res.sendFile(path.resolve(__dirname, "views/edit.html"))
}

function authorizeEdit(req, res){
  let id = getIdFromToken(req.query.account_linking_token)
    .then(res => {
      console.log(JSON.stringify(res))
    })
    .catch(console.log)
  return res.sendStatus(200)
  
  // db.getUsers()
  //   .then(result => res.send(JSON.stringify(result)))
  //   .catch(e => {
  //     res.sendStatus(400)
  //     throw e
  //   })
}


module.exports = {
  edit,
  authorizeEdit
};
