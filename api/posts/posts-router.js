// ./posts/posts-router.js

const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

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
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({
        message: "Please provide title and contents for the post"
      });
    } else {
      const insertedPost = await Posts.insert({ title, contents });
      const retrievedPost = await Posts.findById(insertedPost.id);
      res.status(201).json(retrievedPost);
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the post to the database"
    });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);

    if (post) {
      await Posts.remove(id);
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist"
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed"
    });
  }
});

router.put('/:id', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" })
  } else {
    Posts.findById(req.params.id)
      .then( stuff => {
        if(!stuff){
          res.status(404).json({
            message: "The post with the specified ID does not exist"
          })
        }else {
          return Posts.update(req.params.id, req.body)
        }
      })
      .then(data => {
        if (data) {
          return Posts.findById(req.params.id)
        }
      })
      .then(post => {
        res.json(post)
      })
      .catch( err => {
        res.status(500).json({ 
          message: "There was an error while saving the post to the database" ,
          err: err.message,
          stack: err.stack
        })
      })
  }
  
});

router.get('/:id/comments', async (req, res) => {
        try {
          const post = await Posts.findById(req.params.id);
          if (!post) {
            res.status(404).json({
              message: `message: "The post with the specified ID does not exist"`
            })
          } else {
            const messages = await Posts.findPostComments(req.params.id)
            res.json(messages)
          }

        } catch (err) {
          res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack,
          })
        }

})

module.exports = router;