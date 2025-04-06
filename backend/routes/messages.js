const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const Message = require("../models/Message");

// POST /api/messages

router.get("/", async (req, res, next) =>
{
    console.log("GET /api/messages hit"); // ✅ Debug log
}
);
router.post("/", async (req, res, next) =>
{
    console.log("POST /api/messages hit"); // ✅ Debug log

    const { encryptedMessage, iv, salt } = req.body;
    if (!encryptedMessage || !iv || !salt) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  try {
    const { encryptedMessage, iv, salt, sender, receiver } = req.body;

    if (!encryptedMessage || !iv || !salt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const messageId = nanoid(10);

    const newMessage = new Message({
      messageId,
      encryptedMessage,
      iv,
      salt,
      sender,
      receiver,
    });

    await newMessage.save();

    res.status(201).json({ messageId });
  } catch (err) {
    next(err);
  }
});

// GET /api/messages/:id
router.get("/:id", async (req, res, next) => {
  try {
    const message = await Message.findOne({ messageId: req.params.id });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const { encryptedMessage, iv, salt } = message;
    res.json({ encryptedMessage, iv, salt });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
