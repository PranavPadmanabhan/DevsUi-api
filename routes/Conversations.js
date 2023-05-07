const router = require('express').Router();
const Conversations = require("../models/conversations")
const { v4: uuidv4 } = require('uuid');


router.post("/", async (req, res) => {
    const { members, walletaddress } = req.body;
    if (members.length >= 2 && walletaddress) {
        try {
            const conversation = await Conversations.findOne({ members: { $in: members } });
            if (conversation) {
                res.status(200).json({ error: "Conversation Exists" })
            }
            else {
                const newConvo = new Conversations({
                    conversationId: uuidv4(),
                    blocked: false,
                    members,
                    messages: []
                })
                await newConvo.save()
                const conversations = await Conversations.findOne({ members: { $in: members } });
                res.status(201).json(conversations)
            }
        } catch (error) {
            console.log(error)
        }
    }
    else {
        res.status(200).json({ error: "conversation should have atleast 2 members" })
    }
})

router.get("/:address", async(req, res) => {
    try {
        const conversations = await Conversations.findOne({ members: { $in: [req.params.address] } });
        if(conversations){
            res.status(201).json(conversations)
        }
        else {
            res.status(200).json({ error : "Doesn't have conversations"})
        }
    } catch (error) {
        res.status(200).json({ error: "Something went wrong" })

    }
})

router.get("/conversation/:conversationId", async(req, res) => {
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
})


module.exports = router