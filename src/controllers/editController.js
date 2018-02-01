const path = require("path")
const { getIdFromToken } = require("../utils/messenger.js")


async function edit(req, res) {
  let toRender = true
  await getIdFromToken(req.query.account_linking_token)
    .catch(e => {
      toRender = false
      throw e
    })
  if (toRender)
    return res.render("edit", req.query)
  else
    return res.status(400).send({ error: "invalid token" });
}

function edited(req, res) {
  console.log(res.body)
  return res.sendStatus(200)
}

module.exports = {
  edit,
  edited
};
