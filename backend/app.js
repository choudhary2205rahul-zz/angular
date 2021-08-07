const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

const app = express();

mongoose.connect('mongodb+srv://choudhary2205rahul:D8aWEDSNHR9DxDx9@cluster0.ancve.mongodb.net/blog?retryWrites=true&w=majority')
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS');
    next();
})

// POST ROUTES
app.use('/api/posts', postRoutes);

module.exports = app;