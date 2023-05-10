const User = require("../models/users.js")
const { v4: uuidv4 } = require('uuid');

const SignUp = async (req, res) => {
    const { name, username, walletaddress, email } = req.body
    if (name && username && walletaddress && email) {
        try {
            const user = await User.findOne({
                $or: [
                    { walletAddress: walletaddress },
                    { email },
                    { userName: username }
                ]
            })
            if (user) {
                res.status(200).json({ error: "User Already Exists" })
            }
            else {
                const newUser = new User({
                    userId: uuidv4(),
                    name,
                    email,
                    userName: username,
                    walletAddress: walletaddress
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
}


const Login = async (req, res) => {
    const { walletaddress } = req.body
    if (walletaddress) {
        try {
            const user = await User.findOne({ walletAddress: walletaddress })
            if (user) {
                res.status(200).json(user)
            }
            else {
                res.status(200).json({ error: "User Not Found!! " })
            }
        } catch (error) {
            res.status(200).json({ error: error.message })
        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
}

const CheckUserName = async (req, res) => {
    const { userName } = req.params
    if (userName) {
        try {
            const user = await User.findOne({ userName })
            if (user) {
                res.status(200).json({ error: "username not Available" })
            }
            else {
                res.status(200).json({ message: "userName available " })
            }
        } catch (error) {
            res.status(200).json({ error: error.message })

        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
}


const UpdateUser = async (req, res) => {
    const { name, profileImage, bio, coverImage, dob } = req.body
    const { address } = req.params
    if (name || profileImage || bio || coverImage || dob) {
        const user = await User.findOne({ walletAddress:address })
        if (user) {
           user.name = name??user.name;
           user.profileimage = profileImage??user.profileimage;
           user.bio = bio??user.bio;
           user.coverImage = coverImage??user.coverImage;
           user.role = role??user.role
           user.DOB = dob??user.DOB;
           const updatedUser = await user.save();
           res.status(201).json(updatedUser)

        }
        else {
            res.status(200).json({ message: "userName Not Found!! " })
        }
    }
    else {
        res.status(200).json({ error: "fields are missing!" })
    }
}

module.exports = { SignUp,Login,CheckUserName,UpdateUser }