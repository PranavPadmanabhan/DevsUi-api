const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema({
    conversationId:{ type:String,unique:true, required:true },
    members:{ type:[String], required:true },
    blocked:{ type:Boolean,unique:true,default:false },
    messages:{ type:Array,unique:true, required:true }
})

module.exports = mongoose.model("Conversations",conversationSchema)