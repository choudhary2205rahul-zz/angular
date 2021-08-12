const express = require('express');
const Post = require("../models/posts");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const {createPost, updatePost, findPost, findAllPosts, deletePost} = require("../service/posts.service");
const router = express.Router();

// CREATE
router.post('', checkAuth, fileUpload, createPost);

// UPDATE
router.put('/:id', checkAuth, fileUpload, updatePost);

// FIND BY ID
router.get('/:id', findPost);

// FIND ALL
router.get('', findAllPosts);

// DELETE
router.delete('/:id', checkAuth, deletePost);

module.exports = router;