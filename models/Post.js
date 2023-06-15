const mongoose = require('mongoose');
const users = require('./users');

const postSchema = new mongoose.Schema({
    postId:{type: String },
    type:{ type:String },
    content:{ type : String },
    jobRole:{ type : String},
    images:{ type: [String] },
    likes:{ type: [String] },
    comments:{ type: []},
    requested:{ type : Array },
    createdBy:{ type:Object,ref:users },
    createdAt:{ type:Number }
})

module.exports = mongoose.model('Posts',postSchema)