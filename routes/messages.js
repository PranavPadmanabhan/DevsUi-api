const { Conversations } = require('../config/db');

const router = require('express').Router();

router.post("/:conversationId", (req, res) => {
    const { message, walletaddress } = req.body;
    if (message && walletaddress) {
        try {
            const conversationId = req.params.conversationId
            const conversation = Conversations.get({ conversationId })
            const isValidMember = conversation.members.includes(walletaddress)
            if (conversation && isValidMember) {
                const newMessage = {
                    messageId: (Math.random() * 1e18).toString(),
                    sender: walletaddress,
                    message,
                    timestamp: Date.now()
                }
                const doc = Conversations.update({ conversationId }, { messages: [...conversation.messages, newMessage] })
                if (doc) {
                    res.status(201).json(doc)
                }
                else {
                    res.status(200).json({ error: "Something went wrong" })
                }
            }
            else {
                res.status(200).json({ error: "Not authorized" })
            }
        } catch (error) {

        }
    }
    else {
        res.status(200).json({ error: "fields are missing" })

    }
})

module.exports = router