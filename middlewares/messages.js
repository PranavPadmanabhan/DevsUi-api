const conversations = require('../models/conversations');
const { v4: uuidv4 } = require('uuid');

const SendMessage = async(req, res) => {
    const { message, walletaddress } = req.body;
    const conversationId = req.params.conversationId
    if (message && walletaddress && conversationId) {
        try {
            const newMessage = {
                messageId:uuidv4(),
                message,
                sender:walletaddress,
                timestamp:Date.now(),
            }
            const conversation = await conversations.findOne({ conversationId});
            if(conversation){
                conversation.messages = [...conversation.messages,newMessage];
            const conversationData = await conversation.save();
            res.status(201).json(conversationData)
            }
            else {
                res.status(200).json({error:" Conversation Not Found!!"})
            }

        } catch (error) {

        }
    }
    else {
        res.status(200).json({ error: "fields are missing" })

    }
}

module.exports = { SendMessage }