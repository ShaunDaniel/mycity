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
    const post = await Post.findById(postId);
    const postIdAsObjectId = new ObjectId(String(postId));
    
    const existingVote = user.votes.find(vote => vote.postId.toString() === postIdAsObjectId.toString()); // Check if user has already voted on this post

    if (existingVote) // If user has already voted on this post
    {
      if (existingVote.voteType === voteType) // If user is trying to vote the same way again
      {
        post.voteCount = voteType===1 ? post.voteCount - 1 : post.voteCount + 1;
        
        // User is undoing their vote
        user.votes = user.votes.filter(vote => vote.postId.toString() !== postIdAsObjectId.toString());
        post.votes = post.votes.filter(vote => vote.userId.toString() !== userId);

        // Update post's vote count
      }
      else { // If user is changing their vote

        user.votes = user.votes.map(vote => {
          if (vote.postId.toString() === postIdAsObjectId.toString()) {
            vote.voteType = voteType;
          }
          return vote;
        })
        post.votes = post.votes.map(vote => {
          if (vote.userId.toString() === userId) {
            vote.type = voteType;
          }
          return vote;
        })        
        // Update post's vote count
        post.voteCount = voteType===1 ? post.voteCount + 2 : post.voteCount - 2;
      }
      await user.save();
      await post.save();
      res.status(200).send({ message: "Post vote UPDATED successfully", voteCount: post.voteCount,postVotes:post.votes });
    }
    else {
      // User has not voted on this post before
      user.votes.push({ postId:postIdAsObjectId, voteType: voteType });
      post.votes.push({ userId: userId, type: voteType });
      post.voteCount = voteType===1 ? post.voteCount + 1 : post.voteCount - 1;

      await user.save();
      await post.save();

      // Update post's vote count
      res.status(200).send({ message: "Post vote ADDED successfully", voteCount: post.voteCount,postVotes:post.votes });
    }
 } catch (error) {
    return res.status(500).send({ message: "Error updating post vote", error: error.message });
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