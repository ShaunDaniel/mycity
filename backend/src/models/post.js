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