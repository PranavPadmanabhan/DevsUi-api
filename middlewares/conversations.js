const Conversations = require("../models/conversations")
const { v4: uuidv4 } = require('uuid');
const users = require('../models/users');

const CreateConversation = async (req, res) => {
    const { walletaddress,receiver } = req.body;
    if (walletaddress?.trim().length!==0 && receiver?.trim().length!==0) {
        try {
            const receiverAcc = await users.findOne({walletAddress:receiver})
            const sender = await users.findOne({walletAddress:walletaddress})
            const conversation = await Conversations.findOne({ users: [
                walletaddress,
                receiver
            ] });
            if (conversation) {
                res.status(200).json({ error: "Conversation Exists" })
            }
            else if(!receiverAcc){
                res.status(200).json({ error: "user not found!!" })
            }
            else {
                const newConvo = new Conversations({
                    conversationId: uuidv4(),
                    users:[
                        walletaddress,
                        receiver
                    ],
                    details:[
                        { ...sender },
                        { ...receiverAcc }
                    ],
                    messages: [],
                    timeStamp:Date.now()
                })
                await newConvo.save()
                const conversations = await Conversations.find({ users: { $in: [walletaddress] } });
                res.status(201).json(conversations)
            }
        } catch (error) {
            console.log(error)
        }
    }
    else {
        res.status(200).json({ error: "conversation should have atleast 2 members" })
    }
}

const GetConversation = async(req, res) => {
    const conversationId = req.params.conversationId;
    if(conversationId){
        try {
            const conversation = await Conversations.findOne({ conversationId});
            if(conversation){
                res.status(200).json(conversation)
            }
            else {
                res.status(200).json({ error : "Conversation Not Found!!"})
            }
        } catch (error) {
            res.status(200).json({ error: "Something went wrong" })
    
        }

    }
    else {
        res.status(200).json({ error: "fields are missing" })
    }
}

const GetConversations = async(req, res) => {
    try {
        const conversations = await Conversations.find({ users: { $in: [req.params.address] } });
        if(conversations){
            res.status(201).json(conversations)
        }
        else {
            res.status(200).json({ error : "Doesn't have conversations"})
        }
    } catch (error) {
        res.status(200).json({ error: "Something went wrong" })

    }
}

module.exports = { CreateConversation,GetConversation,GetConversations }