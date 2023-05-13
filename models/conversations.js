const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema({
    conversationId: { type: String, unique: true, required: true },
    users: { type: Array, required: true },
    details: { type: Array, required: true },
    messages: { type: Array, required: true },
    timeStamp: { type: Number, required: true },
    newMessageFrom:{ type: [String], required: true },
})

module.exports = mongoose.model("Conversations", conversationSchema)