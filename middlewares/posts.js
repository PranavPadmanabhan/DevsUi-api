const Posts = require("../models/Post.js")
const { v4: uuidv4 } = require('uuid');
const Users = require('../models/users.js')


const AddPost = async (req, res) => {
   const { content, type, image, walletaddress } = req.body;
   if (type && content) {
      try {
         const user = await Users.findOne({ walletAddress: walletaddress })
         if (user) {
            const newPost = new Posts({
               postId: uuidv4(),
               type,
               content,
               image: image ?? null,
               likes: [],
               comments: [],
               requested: [],
               createdAt: Date.now(),
               createdBy: user.walletAddress
            })

            const post = await newPost.save();
            const posts = await Posts.find({});
            res.status(201).json(posts)
         }
         else {
            res.status(200).json({ error: "user not found" })
         }

      } catch (error) {

      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const DeletePost = async (req, res) => {
   const { walletaddress,postId } = req.params;
   if (walletaddress && postId) {
      try {
         const user = await Users.findOne({ walletAddress: walletaddress })
         const post = await Posts.findOne({postId})
         if (user && post) {
            if(post.createdBy === user.walletAddress){
               await Posts.findOneAndDelete({postId})
               res.status(200).json({message:"deleted Successfully"})
            }
            else{
            res.status(200).json({ error: "Not Authorized" })

            }
         }
         else {
            res.status(200).json({ error: "something went wrong" })
         }

      } catch (error) {

      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}


const GetPost = async (req, res) => {
   const { postId } = req.params;
   if ( postId) {
      try {
         const post = await Posts.findOne({postId})
         if (post) {
            const user = await Users.findOne({ walletAddress:post.createdBy})
           if(user){
            let comments = []
            for (let i = 0; i < post.comments.length; i++) {
              const commentor = await Users.findOne({walletAddress:post.comments[i].commentedBy})
              for (let j = 0; j < post.comments[i].replies.length; j++) {
               const replier = await Users.findOne({walletAddress:post.comments[i].replies[j].repliedBy})
               const repliedTo = await Users.findOne({walletAddress:post.comments[i].replies[j].repliedTo})

              }
               
            }
            let postData = {
               ...post,
               comments,
               creator:{
                  ...user
               }
            }
           }
           res.status(200).json(post)
         }
         else {
            res.status(200).json({ error: "something went wrong" })
         }

      } catch (error) {

      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const GetPosts = async (req,res) => {
   try {
      const posts = await Posts.find({});
      if (posts) {
         res.status(200).json(posts)
      }
      else {
         res.status(200).json([])
      }
   } catch (error) {
   }
}

const LikePost = async (req,res) => {
   const { walletaddress } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId) {
      try {
         const user = await Users.findOne({ walletAddress: walletaddress })
         const post = await Posts.findOne({ postId })
         if (post && user) {
            post.likes = [...post.likes, user.walletAddress]
            await post.save()
            res.status(201).json({ message: 'Success ' })
         }
         else if (post && !user) {
            res.status(200).json({ error: "user not found" })
         }
         else {
            res.status(200).json({ error: "something wnet wrong" })

         }
      } catch (error) {

      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const DisLikePost = async (req,res) => {
   const { walletaddress } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId) {
      try {
         const user = await Users.findOne({ walletAddress: walletaddress })
         const post = await Posts.findOne({ postId })
         if (post && user) {
            post.likes = post.likes?.filter((like) => like !== user.walletAddress)
            await post.save()
            res.status(201).json({ message: 'Success ' })
         }
         else if (post && !user) {
            res.status(200).json({ error: "user not found" })
         }
         else {
            res.status(200).json({ error: "something wnet wrong" })

         }
      } catch (error) {

      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const Comment = async (req,res) => {
   const { walletaddress, comment } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && comment) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         const newComment = {
            commentId: (Math.random() * 1e18).toString(),
            comment,
            commentedBy: walletaddress,
            likes: [],
            replies: []
         }
         post.comments = [...post.comments, newComment]
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const LikeComment = async (req,res) => {
   const { walletaddress, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && commentId) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.map((comment) => comment.commentId === commentId?{...comment,likes:[...comment.likes,walletaddress]}:comment)
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const DisLikeComment = async (req,res) => {
   const { walletaddress, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && commentId) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.map((comment) => comment.commentId === commentId?{...comment,likes:comment.likes.filter((item) => item !== walletaddress)}:comment)
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}


const DeleteComment = async (req,res) => {
   const { walletaddress, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && commentId) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.filter((comment) => comment.commentId !== commentId)
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const ReplyComment = async (req,res) => {
   const { walletaddress, reply, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && reply) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.map((comment) => comment.commentId === commentId ? {
            ...comment, replies: [...comment.replies, {
               replyId: (Math.random() * 1e18).toString(),
               reply,
               repliedBy: walletaddress,
               repliedTo: comment?.commentedBy,
               likes: [],
            }]
         } : comment);
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}




const DeleteReplyComment = async (req,res) => {
   const { walletaddress, replyId, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && replyId) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.map((comment) => comment.commentId === commentId ? {
            ...comment, replies: comment?.replies?.filter((reply) => reply.replyId !== replyId)
         } : comment);
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const LikeReplyComment = async (req,res) => {
   const { walletaddress, replyId, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && replyId) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.map((comment) => comment.commentId === commentId ? {
            ...comment, replies: comment?.replies?.map((reply) => reply.replyId === replyId?{
               ...reply,likes:[...reply.likes,walletaddress]
            }:reply)
         } : comment);
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}

const DisLikeReplyComment = async (req,res) => {
   const { walletaddress, replyId, commentId } = req.body;
   const postId = req.params.postId;
   if (walletaddress && postId && replyId) {
      const user = await Users.findOne({ walletAddress: walletaddress })
      const post = await Posts.findOne({ postId })
      if (user && post) {
         post.comments = post.comments?.map((comment) => comment.commentId === commentId ? {
            ...comment, replies: comment?.replies?.map((reply) => reply.replyId === replyId?{
               ...reply,likes:reply?.likes?.filter(item => item!== walletaddress) 
            }:reply)
         } : comment);
         const updated = await post.save();
         res.status(201).json(updated)
      }
      else {
         res.status(200).json({ error: 'Something went wrong' })
      }
   }
   else {
      res.status(200).json({ error: "fields are missing" })
   }
}


module.exports = { AddPost,DeletePost,GetPost, GetPosts, LikePost, DisLikePost, Comment,LikeComment,DisLikeComment, DeleteComment, ReplyComment,LikeReplyComment,DisLikeReplyComment, DeleteReplyComment }