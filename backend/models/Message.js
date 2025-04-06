const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  encryptedMessage: { type: String, required: true },
  iv: { type: String, required: true },
  salt: { type: String, required: true },
  sender: { type: String },
  receiver: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
