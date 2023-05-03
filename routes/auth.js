const { Users } = require('../config/db');

const router = require('express').Router();



router.post("/signup", (req, res) => {
    const { name, profileimage, username, walletaddress } = req.body
    if (name && profileimage && username && walletaddress) {
        try {
            const user = Users.get({ walletaddress });
            if (user) {
                res.status(200).json({ error: "User Already Exists" })
            }
            else {
                const newUser = {
                    name,
                    userId: (Math.random() * 1e18).toString(),
                    username,
                    walletaddress,
                    profileimage,
                    blocklist: [],
                    blockedby: []
                }
                const doc = Users.add(newUser);
                if (doc._id) {
                    res.status(201).json(doc)
                }
                else {
                    res.status(200).json({ error: "Something Went wrong" })
                }
            }
        } catch (error) {
            res.status(200).json({ error: error.message })
        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
})


router.post("/signin", (req, res) => {
    const { walletaddress } = req.body
    if (walletaddress) {
        try {
            const user = Users.get({ walletaddress });
            if (user) {
                res.status(200).json(user)
            }
            else {
                res.status(200).json({ error: "User Not Found" })
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