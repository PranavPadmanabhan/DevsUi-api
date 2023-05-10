const router = require('express').Router();

const { SignUp, Login, CheckUserName, UpdateUser } = require("../middlewares/auth.js")

router.post("/signup", SignUp)

router.put("/user/:address", UpdateUser);

router.post("/signin", Login)

router.get("/users/:userName", CheckUserName)

module.exports = router