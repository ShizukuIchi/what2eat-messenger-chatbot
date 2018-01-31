const router = require("express").Router();
const { verifyWebhook, webhook } = require("../controllers/messageController.js");

router.get("/webhook", verifyWebhook);
router.post("/webhook", webhook);

module.exports = router;