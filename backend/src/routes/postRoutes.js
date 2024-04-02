const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectId;

// Get city wise posts
router.get('/:cityName', async (req, res) => {
    try {
        const cityName = decodeURIComponent(req.params.cityName);
        const posts = await Post.find({ city: cityName });
        res.json({posts:posts});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


  
router.put('/vote', async (req, res) => {
  const { postId, userId, voteType } = req.body;

  try {
    const user = await User.findById(userId);
    let postIdAsObjectId = new ObjectId(String(postId));
    const existingVote = user.votes.find(vote => vote.postId.toString() === postIdAsObjectId.toString());

    if (existingVote) {
      // User has already voted on this post
      if (existingVote.voteType === voteType) {
        // User is trying to vote the same way again
        return res.status(304).json({ message: "User already voted this way on this post. No modification made." });
      } else {
        // User is changing their vote
        existingVote.voteType = voteType;
        await user.save();
      }
    } else {
      // User has not voted on this post before
      user.votes.push({ postId:postIdAsObjectId, voteType: voteType });
      await user.save();
    }

    // Find the post and update its votes
    const post = await Post.findById(postIdAsObjectId);
    const existingPostVote = post.votes.find(vote => vote.userId.toString() === userId);

    if (existingPostVote) {
      // User has already voted on this post
      existingPostVote.type = voteType;
    } else {
      // User has not voted on this post before
      post.votes.push({ userId: user._id, type: voteType });
    }

    // Save the post
    await post.save();
    res.status(200).json({ message: "Post vote updated successfully",votes:post.votes});

  } catch (error) {
    // handle error
  }
});

router.post('/:cityName', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        city: decodeURIComponent(req.params.cityName),
        category: req.body.category,
        user: req.body.user,
        upvotes: req.body.upvotes,
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;