const router = require('express').Router();
const { CreateConversation, GetConversation, GetConversations, UpdateNewMessages } = require('../middlewares/conversations');


router.post("/", CreateConversation)

router.get("/:address", GetConversations)

router.get("/conversation/:conversationId", GetConversation)

router.post("/conversation/:conversationId", UpdateNewMessages)


module.exports = router