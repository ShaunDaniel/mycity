const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const Area = require("../models/area");
const ObjectId = require("mongodb").ObjectId;
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoose = require("mongoose");


router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get city wise posts
router.get("/city/:cityName", async (req, res) => {
  try {
    const cityName = decodeURIComponent(req.params.cityName);
    const posts = await Post.find({ city: cityName });
    res.json({ posts: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/area", async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/area", async (req, res) => {
  try {
    const newArea = new Area({
      ...req.body,
    });

    const savedArea = await newArea.save();
    res.json(savedArea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
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

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      image: "", // Temporarily set image to an empty string
    });
    newPost.area = newPost.area
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    console.log("received newPost", newPost);
    const savedPost = await newPost.save();

    // Check if image is included in form data
    if (req.file) {
      // Now that we have the post_id, we can upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${req.body.user}_${savedPost._id}`, // Set the public_id to user_id_post_id
      });

      // Update the post with the URL of the uploaded image
      savedPost.image = result.secure_url;
      await savedPost.save();
    }

    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/vote", async (req, res) => {
  const { postId, userId, voteType } = req.body;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(404).send({ message: "User or Post not found" });
    }

    const existingVote = user.votes.find((vote) => vote.postId.equals(postId)); // Check if user has already voted on this post
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If user is trying to vote the same way again
        //remove vote from user and post
        await User.updateOne({ _id: userId }, { $pull: { votes: { postId: postId } } });
        await Post.updateOne({ _id: postId }, { $inc: { voteCount: voteType === 1 ? -1 : 1 }, $pull: { votes: { userId: userId } } });
      } else {
        // If user is changing their vote
        // Update user vote
        await User.updateOne({ _id: userId, "votes.postId": postId }, { $set: { "votes.$.voteType": voteType } });
        await Post.updateOne({ _id: postId, "votes.userId": userId }, { $inc: { voteCount: voteType === 1 ? 2 : -2 }, $set: { "votes.$.type": voteType } });
      }
    } else {
      // User has not voted on this post before
      // Add vote to user and post
      await User.updateOne({ _id: userId }, { $push: { votes: { postId: postId, voteType: voteType } } });
      await Post.updateOne({ _id: postId }, { $inc: { voteCount: voteType === 1 ? 1 : -1 }, $push: { votes: { userId: userId, type: voteType } } });
    }

    // After setting votes, get the updated post and send it back

    const updatedPost = await Post.findById(postId);
    res.status(200).send({ message: "Post vote updated successfully", voteCount: updatedPost.voteCount, postVotes: updatedPost.votes });
  } catch (error) {
    return res.status(500).send({ message: "Error updating post vote", error: error.message });
  }
});

router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      res.send(post.comments);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


function findCommentPath(comments, commentId, path = '') {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i]._id == commentId) {
      return path + i;
    } else if (comments[i].replies.length > 0) {
      let foundPath = findCommentPath(comments[i].replies, commentId, path + i + '.replies.');
      if (foundPath) return foundPath;
    }
  }
  return null;
}


router.post("/comments/:postId/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, text } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  let path = findCommentPath(post.comments, commentId);
  if (path === null) {
    return res.status(404).json({ message: "Comment not found" });
  }

  let commentData = {
    _id: new ObjectId(),
    firstName: user.firstName,
    lastName: user.lastName,
    userId: userId,
    text: text,
    createdAt: new Date(),
    replies: [],
  };

  let update = {};
  update[`comments.${path}.replies`] = commentData;

  await Post.updateOne({ _id: postId }, { $push: update });
  res.status(200).send(commentData);
});

router.post("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      console.log("userId", userId)
      const user = await User.findById(userId)
      let commentData = {
        _id: new ObjectId(),
        firstName: user.firstName,
        lastName: user.lastName,
        userId: userId,
        text: text,
        createdAt: new Date(),
        replies: [],
      };
      console.log("commentData", commentData)
      post.comments.push(commentData);
      const updatedPost = await post.save();
      res.send(updatedPost);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
