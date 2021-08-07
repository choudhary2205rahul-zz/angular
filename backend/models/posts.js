const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true, default: ''},
    description: {type: String, required: true, default: ''},
    image: {type: String, required: true, default: ''}
});

module.exports = mongoose.model('Post', postSchema);