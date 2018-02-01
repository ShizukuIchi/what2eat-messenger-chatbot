const router = require("express").Router();
const messageRouter = require("../routers/messageRouter.js");
const editRouter = require("../routers/editRouter.js")

router.use(messageRouter);
router.use(editRouter);

module.exports = router;