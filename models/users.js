const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    userName: { type: String, unique: true, required: true },
    walletAddress: { type: String, unique:true, required: true },
    profileimage: { type: String },
    email: { type: String, unique: true, required: true },
    role: { type:String },
    bio:{ type:String },
    coverImage:{ type:String },
    DOB:{ type:String },
    isOnline: { type: Boolean }
})

module.exports = mongoose.model("User", userSchema)