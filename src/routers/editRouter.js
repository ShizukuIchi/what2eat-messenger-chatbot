const router = require("express").Router();
const { edit, edited} = require("../controllers/editController.js");

router.get("/edit", edit);
router.post("/edit", edited)

module.exports = router;