const router = require("express").Router();
const { index } = require("../controllers/viewController.js");

router.get("/", index);

module.exports = router;