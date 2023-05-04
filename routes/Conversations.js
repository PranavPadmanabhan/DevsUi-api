const { Conversations,db } = require('../config/db');
const router = require('express').Router();


router.post("/",(req,res) => {
    const { members } = req.body;
    if(members.length >=2){
        try {
            const conversationId = (Math.random()*1e18).toString();
            const newConversation = {
                conversationId,
                members,
                messages:[]
            }
            const doc = Conversations.add(newConversation);
            if(doc._id){
                res.status(200).json(doc)
            } 
        } catch (error) {
            console.log(error)
        }
    }
    else {
        res.status(200).json({error:"conversation should have atleast 2 members"})
    }
})

router.get("/:address",async(req,res) => {
    try {
        const address = req.params.address;
        const conversations = Conversations.get({$includes:{members:address}})
        if(conversations){
            const url = await db.getIPFS(true)
            res.status(200).json({conversations,url})
        }
        else {
            res.status(200).json({error:"Not Found"})
        }
    } catch (error) {
        res.status(200).json({error: "Something went wrong"})
        
    }
})


module.exports = router