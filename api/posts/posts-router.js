// ./posts/posts-router.js

const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

// GET all posts
router.get('/', async (_req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "The posts information could not be retrieved" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postById = await Posts.findById(id);
    if (postById) { 
      res.json(postById);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "The post information could not be retrieved",
    });
  };
});

router.post('/',  (req, res) => {
  const { title, contents } = req.body;
  if(!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    })
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        return Posts.findById(id)
      })
      .then(post => {
        res.status(201).json(post)
      })
      .catch(err => {
        res.status(500).json({ 
          message: "There was an error while saving the post to the database" 
        })
      })
  }
});


router.delete('/:id', async (req, res) => {

})

router.put('/id', async (req, res) => {

})

router.get('/:id/message', async (req, res) => {

})

module.exports = router;