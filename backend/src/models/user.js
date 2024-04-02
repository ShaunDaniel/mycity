const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    city: { type: String, required: true,default: '-'},
    state_name: { type: String, required: true,default: '-'},
    googleId: { type: String, required: false },
    votes: [
      {
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post', // replace 'Post' with the name of your Post model
        },
        voteType: {
          type: Number,
        },
      }
    ],
  });

  userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;