const router = require("express").Router();
const { edit,authorizeEdit } = require("../controllers/editController.js");

router.get("edit", edit);
router.get("editID", authorizeEdit);

module.exports = router;