const router = require("express").Router();
const { index,testGET, testPOST } = require("../controllers/viewController.js");

router.get("/", index);
router.get("/t", testGET);
router.post("/t", testPOST);

module.exports = router;