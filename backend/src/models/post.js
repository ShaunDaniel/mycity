const mongoose = require('mongoose');

const issues = [
  "Road-Related",
  "Water-Related",
  "Waste Management",
  "Electricity-Related",
  "Public Infrastructure",
  "Environmental",
  "Public Health and Safety",
  "Public Transportation",
  "Education and Social Infrastructure",
  "Emergency and Disaster-Related"
];

const commentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true },
  replies: [this] // Recursive reference to allow for nested comments
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  comments: [commentSchema],

  city: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: issues,
    required: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  area: {
    type: String,
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
  image: {
    type: String,
  },
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