const mongoose = require('mongoose');


const issues = [
    "Road-Related Issues",
    "Water-Related Issues",
    "Waste Management Issues",
    "Electricity-Related Issues",
    "Public Infrastructure Issues",
    "Environmental Issues",
    "Public Health and Safety Issues",
    "Public Transportation Issues",
    "Education and Social Infrastructure Issues",
    "Emergency and Disaster-Related Issues"
  ];

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: issues,
    required: true,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  votes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: Number,
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;