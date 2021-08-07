const express = require('express');
const Post = require("../models/posts");
const multer = require('multer');
const router = express.Router();

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
   destination: (req,file,cb) => {
       const isValid = MIME_TYPE_MAP[file.mimetype];
       let error = new Error("Invalid MimeType");
       if (isValid) {
           error = null;
       }
       cb(error,"backend/images");
   },
   filename: (req,file,cb) => {
       const name = file.originalname.toLowerCase().split(' ').join('-');
       const ext = MIME_TYPE_MAP[file.mimetype];
       cb(null,name + '-' + Date.now() + '.' + ext);
   }
});

// CREATE
router.post('',multer({storage}).single('image'), (req,res,next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({title: req.body.title, description: req.body.description, image: url + "/images/" + req.file.filename });
    post.save().then((post) => {
        res.status(200).json({
            message: 'New Post Created!',
            post: {
                ...post,
                id: post._id
            }
        });
    });
});

// UPDATE
router.put('/:id',multer({storage}).single('image'), (req,res,next) => {
    let image = req.body.image;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        image = url + "/images/" + req.file.filename
    }
    const updatePost = new Post({_id: req.body.id,title: req.body.title, description: req.body.description, image:  image});
    Post.updateOne({_id: req.params.id}, updatePost).then((documents) => {
        res.status(200).json({
            message: 'Posts updated successfully',
            post: updatePost
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
    const pageSize = +req.query.pagesize;
    const currPage = +req.query.page;
    const postQuery = Post.find();
    if (pageSize && currPage) {
        postQuery
            .skip(pageSize * (currPage - 1))
            .limit(pageSize);
    }
    let fetchedPosts;
    postQuery.then((documents) => {
        fetchedPosts = documents;
       return Post.count();
    }).then((postsCount) => {
        res.status(200).json({
            message: 'All Posts fetched successfully',
            posts: fetchedPosts,
            postsCount: postsCount
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