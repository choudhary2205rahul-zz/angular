const Post = require("../models/posts");

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        image: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then((post) => {
        res.status(200).json({
            message: 'New Post Created!',
            post: {
                ...post,
                id: post._id
            }
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Creating a post failed'
        });
    });
};

exports.updatePost = (req, res, next) => {
    let image = req.body.image;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        image = url + "/images/" + req.file.filename
    }
    const updatePost = new Post({
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        image: image,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, updatePost).then((result) => {
        if (result.n > 0) {
            res.status(200).json({
                message: 'Posts updated successfully',
                post: updatePost
            });
        } else {
            res.status(401).json({
                message: 'Auth Failed'
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Updating a post failed'
        });
    });
};

exports.findPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json({
                message: 'Post fetched successfully',
                post: post
            });
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Finding a post by ID failed'
        });
    });

};

exports.findAllPosts = (req, res, next) => {
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
    }).catch(err => {
        res.status(500).json({
            message: 'Finding all post failed'
        });
    });

};

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result) => {
        if (result.n > 0) {
            res.status(200).json({
                message: 'Posts deleted successfully',
            });
        } else {
            res.status(401).json({
                message: 'Auth Failed'
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Deleting a post failed'
        });
    });
};