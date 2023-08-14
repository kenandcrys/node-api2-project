const express = require('express');
const postRoutes = require('./posts/posts-router');

const server = express();

server.use(express.json());

server.use('/api/posts', postRoutes);

server.use('/', (_req, res) => {
    res.status(404).json({
        message: "Not Found"
    })
})


module.exports = server;

