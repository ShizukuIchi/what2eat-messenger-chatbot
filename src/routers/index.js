const router = require("express").Router();
const viewRouter = require("../routers/viewRouter.js");
const messageRouter = require("../routers/messageRouter.js");
const editRouter = require("../routers/editRouter.js")

router.use(messageRouter);
router.use(viewRouter);
router.use(editRouter)

module.exports = router;