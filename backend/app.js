const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import Routes
const postRoutes = require('./api/posts.api');
const userRoutes = require('./api/user.api');

const app = express();

mongoose.connect(`mongodb+srv://choudhary2205rahul:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.ancve.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected Successfully');
    })
    .catch(() => {
        console.log('Connection Error');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static('backend/images'))

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
})

// Forward Request to Routes that we have
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;