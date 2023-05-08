
const router = require('express').Router();
const User = require("../models/users")
const { v4: uuidv4 } = require('uuid');

router.post("/signup", async(req, res) => {
    const { name, username, walletaddress, email } = req.body
    if (name && username && walletaddress && email) {
        try {
            const user = await User.findOne({$or:[
                {walletaddress},
                {email}
            ]})
            if(user){
                res.status(200).json({error : "User Already Exists"})
            }
            else {
                const newUser = new User({
                    userId:uuidv4(),
                    name,
                    email,
                    userName:username,
                    walletAddress:walletaddress
                })
                const userData = await newUser.save();
                res.status(201).json(userData)
            }
        } catch (error) {
            res.status(200).json({ error: error.message })
        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
})


router.post("/signin", async(req, res) => {
    const { walletaddress } = req.body
    if (walletaddress) {
        try {
           const user = await User.findOne({walletAddress:walletaddress})
           if(user){
            res.status(200).json(user)
           }
           else {
            res.status(200).json({ error : "User Not Found!! "})
           }
        } catch (error) {
            res.status(200).json({ error: error.message })

        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
})


router.get("/users/:userName",async(req,res) => {
    const { userName } = req.params
    if (userName) {
        try {
           const user = await User.findOne({userName})
           if(user){
            res.status(200).json({error:"username not Available"})
           }
           else {
            res.status(200).json({ message : "userName available "})
           }
        } catch (error) {
            res.status(200).json({ error: error.message })

        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
})

module.exports = router