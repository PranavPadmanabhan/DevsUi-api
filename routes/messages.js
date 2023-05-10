const { SendMessage } = require('../middlewares/messages');
const router = require('express').Router();


router.post("/:conversationId", SendMessage)

module.exports = router