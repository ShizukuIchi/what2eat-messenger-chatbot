const router = require("express").Router();
const messageRouter = require("../routers/messageRouter.js");

router.use(messageRouter);
router.get('/privacy_policy', (req, res) => {
  return res.render("privacy_policy", {appName: process.env.APP_NAME}); 
})

module.exports = router;