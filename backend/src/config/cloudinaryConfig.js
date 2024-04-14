// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();

cloudinary.config({
  cloud_name: 'dz6ietgbm',
  api_key: '429399264553966',
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;