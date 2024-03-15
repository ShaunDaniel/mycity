const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL;


mongoose.connect(dbURL).then(() => {
    console.log('Connected to MongoDB');
    module.exports = mongoose.connection;
})

.catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});


