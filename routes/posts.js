const router = require('express').Router()
const { AddPost,Comment,DeleteComment,DeletePost,DeleteReplyComment,GetPost,GetPosts,LikeComment,LikePost,LikeReplyComment,ReplyComment,DisLikeComment,DisLikePost,DisLikeReplyComment } = require('../middlewares/posts.js')

router.route("/").get(GetPosts).post(AddPost);
router.delete('/:walletaddress/:postId',DeletePost)
router.get("/:postId",GetPost);
router.put("/like/:postId",LikePost)
router.put("/dislike/:postId",DisLikePost);
router.route("/comment/:postId").put(Comment).delete(DeleteComment);
router.put("/comment/like/:postId",LikeComment)
router.put("/comment/dislike/:postId",DisLikeComment)
router.route("/reply/:postId").put(ReplyComment).delete(DeleteReplyComment);
router.put("/reply/like/:postId",LikeReplyComment)
router.put("/reply/dislike/:postId",DisLikeReplyComment)



module.exports = router