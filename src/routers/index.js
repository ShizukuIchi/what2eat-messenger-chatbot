const router = require("express").Router();
const messageRouter = require("../routers/messageRouter.js");

router.use(messageRouter);
router.get('/', (req, res) => {
  return res.render("index"); 
})

module.exports = router;