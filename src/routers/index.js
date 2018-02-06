const router = require("express").Router();
const messageRouter = require("../routers/messageRouter.js");

router.use(messageRouter);

module.exports = router;