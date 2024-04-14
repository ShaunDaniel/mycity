const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectId;
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get city wise posts
router.get('/city/:cityName', async (req, res) => {
  try {
      const cityName = decodeURIComponent(req.params.cityName);
      const posts = await Post.find({ city: cityName });
      res.json({posts:posts});
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      image: '' // Temporarily set image to an empty string
    });
    console.log("new post",newPost);
    const savedPost = await newPost.save();
    // Now that we have the post_id, we can upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${req.body.user}_${savedPost._id}` // Set the public_id to user_id_post_id
    });

    // Update the post with the URL of the uploaded image
    savedPost.image = result.secure_url;
    await savedPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/vote', async (req, res) => {
  const { postId, userId, voteType } = req.body;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(404).send({ message: "User or Post not found" });
    }

    const existingVote = user.votes.find(vote => vote.postId.equals(postId)); // Check if user has already voted on this post
    if (existingVote) { 
      
      if (existingVote.voteType === voteType) { // If user is trying to vote the same way again      
        //remove vote from user and post
        await User.updateOne({ _id: userId },{ $pull: { votes: { postId: postId } } });
        await Post.updateOne({ _id: postId },{ $inc: { voteCount: voteType === 1 ? -1 : 1 }, $pull: { votes: { userId: userId } } });
      }
      
      else{ // If user is changing their vote
        // Update user vote
        await User.updateOne({ _id: userId, "votes.postId": postId },{ $set: { "votes.$.voteType": voteType } });
        await Post.updateOne({ _id: postId, "votes.userId": userId },{ $inc: { voteCount: voteType === 1 ? 2 : -2 }, $set: { "votes.$.type": voteType } });
      }

    } else {  // User has not voted on this post before
      // Add vote to user and post
      await User.updateOne({ _id: userId },{ $push: { votes: { postId: postId, voteType: voteType } } });
      await Post.updateOne({ _id: postId },{ $inc: { voteCount: voteType === 1 ? 1 : -1 }, $push: { votes: { userId: userId, type: voteType } } }
      );
    }

    // After setting votes, get the updated post and send it back

    const updatedPost = await Post.findById(postId);
    res.status(200).send({ message: "Post vote updated successfully", voteCount: updatedPost.voteCount, postVotes: updatedPost.votes });
  
  }catch (error) {
    return res.status(500).send({ message: "Error updating post vote", error: error.message });
  }
});




module.exports = router;