const router = require("express").Router();
const { verifyWebhook, webhook, sendme } = require("../controllers/messageController.js");

router.get("/webhook", verifyWebhook);
router.post("/webhook", webhook);
router.post("/sendme", sendme);

module.exports = router;