const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId:{type: String },
    type:{ type:String },
    content:{ type : String },
    image:{ type: String },
    likes:{ type: [String] },
    comments:{ type: []},
    requested:{ type : Array },
    createdBy:{ type:String },
    createdAt:{ type:Number }
})

module.exports = mongoose.model('Posts',postSchema)