const router = require("express").Router();
const viewRouter = require("../routers/viewRouter.js");
const messageRouter = require("../routers/messageRouter.js");

router.use(messageRouter);
router.use(viewRouter);

module.exports = router;