const router = require('express').Router();
const { CreateConversation, GetConversation, GetConversations } = require('../middlewares/conversations');


router.post("/", CreateConversation)

router.get("/:address", GetConversations)

router.get("/conversation/:conversationId", GetConversation)


module.exports = router