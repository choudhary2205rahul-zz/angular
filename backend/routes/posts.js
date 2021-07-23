const express = require('express');
const Post = require("../models/posts");
const router = express.Router();

// CREATE
router.post('', (req,res,next) => {
    const post = new Post({title: req.body.title, description: req.body.description });
    post.save().then((post) => {
        res.status(200).json({
            message: 'New Post Created!',
            postId: post._id
        });
    });
});

// UPDATE
router.put('/:id', (req,res,next) => {
    const updatePost = new Post({_id: req.body.id,title: req.body.title, description: req.body.description });
    Post.updateOne({_id: req.params.id}, updatePost).then((documents) => {
        res.status(200).json({
            message: 'Posts updated successfully',
        });
    });
});

// FIND BY ID
router.get('/:id', (req,res,next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json({
                message: 'Post fetched successfully',
                post: post
            });
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    });

});

// FIND ALL
router.get('', (req,res,next) => {
    Post.find().then((documents) => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: documents
        });
    });

});

// DELETE
router.delete('/:id', (req,res,next) => {
    Post.deleteOne({_id: req.params.id}).then((documents) => {
        res.status(200).json({
            message: 'Posts deleted successfully'
        });
    });
});

module.exports = router;