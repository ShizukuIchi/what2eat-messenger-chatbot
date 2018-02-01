const router = require("express").Router();
const { edit,authorizeEdit } = require("../controllers/editController.js");

router.get("edit", authorizeEdit);

module.exports = router;