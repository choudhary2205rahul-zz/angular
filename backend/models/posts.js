const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true, default: ''},
    description: {type: String, required: true, default: ''},
    image: {type: String, required: true, default: ''},
    creator: {type: mongoose.Schema.Types.ObjectId,ref: 'User', required: true}
});

module.exports = mongoose.model('Post', postSchema);