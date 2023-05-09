const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema({
    conversationId: { type: String, unique: true, required: true },
    members: { type: Array, required: true },
    messages: { type: Array, required: true }
})

module.exports = mongoose.model("Conversations", conversationSchema)