const express = require('express');
const router = express.Router();

const Posts = require('../db.js');

// router.get("/", (req,res) => {
//     res.status(200).json({ router: "testing router" });
// });


///1 api/posts
router.post('/posts', (req,res) => {
    console.log("Req", req.body);
    const userData = req.body;
    console.log(userData);

    Posts.insert(userData)
      .then(data => {
          if(userData.title && userData.contents) {
              res.status(201).json({ data });
          } else {
              res
                .status(400)
                .json({ errorMessage: "Please provide title and contents for the post." });
          }
      })
      .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the post to the database"
          });
      });
});

//2 api/posts/:id/comment
router.post("/posts/:id/comments", (req, res) => {
    let userData = req.body;
    userData.post_id = req.params.id;
    Posts.insertComment(userData)
      .then(item => {
        if (!userData.post_id) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else if (!userData.text) {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          res.status(201).json({
                userData
              });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  });

//api/posts/id/comment
// router.post("/posts/:id/comments", (req,res) => {
//     console.log(req.body);
//     let userData = req.body; //What is in the body of the comment i.e text
//     userData.post_id = req.params.id; //this will come from the URL
//     console.log(userData);

//     Posts.insertComment(userData)
//       .then(item => {
//           if(item) {
//               res.status(201).json({ userData });
//           } else if (!userData.text) {
//             res.status(400).json({ errorMessage: "Please provide text for the comment."  });
//           } else {
//             res.status(404).json({ message: "The post with the specified ID does not exist."} );
//           }
//       })
//       .catch(err => {
//           res.status(500).json({
//             error: "There was an error while saving the comment to the database"
//           });
//       });
// });

/*
http://localhost:8000/api/posts/1/comments

{
	"text": "Abc"
}

{
    "userData": {
        "text": "Abc",
        "post_id": "1"
    }
}

router.post("/:id/comments", (req, res) => {
  const { text } = req.body; // pulling out one piece out of the db.js
  const post_id = req.params.id; // this dynamic id from above is going to come from the URL - params

  !text ? // Not Text?
      res.status(400).json({ errorMessage: "Please provide text for the comment." }) // if the request body is missing the text property (Bad Request) - worked on postman
  : Posts.findById(post_id) // : else
    .then(post => {
      if (!post) { res.status(404).json({ error: "The post with the specified ID does not exist." }) // working on postman
    } else {
      let newComment = {
        text: text, post_id: post_id
      }
      Posts.insertComment(newComment) // saves the new comment to the db
        .then(({ id }) => {
      Posts.findCommentById(id)
        .then(comment => {
          res.status(201).json(comment) // If the info re: comment is valid, save the new comment to the db - worked on postman
      });
    }) // add your if (!text) conditional to the top of the .catch block
    .catch(err => {
      console.log(error);
      res.status(500).json({ errorMessage: "There was an error while saving the comment to the database"
        })
      })
    } // POST request is possible to do 500 error on postman
  })
});



*/


//3 GET request to /api/posts
router.get('/posts', (req,res) => {
    Posts.find()
      .then(posts => {
          res.status(200).json(posts);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
            error: "The posts information could not be retrieved."
          });
      });
});

//4 GET request to /api/posts/:id
router.get('/posts/:id', (req,res) => {
    const { id } = req.params;
    Posts.findById(id)
      .then(posts => {
          if(posts) {
              res.status(200).json({ posts });
          } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." });
          }
      })
      .catch(err => {
          res.status(500).json({ error: "The post information could not be retrieved." });
      });
});


//5 GET request to /api/posts/:id/comments
router.get('/posts/:id/comments', (req,res) => {
  const { id } = req.params;

  Posts.findPostComments(id)
    .then(comments => {
      if(comments) {
        res.status(200).json({ comments });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});

//Incorrect
router.get("/posts/:post_id/comments/:commentId", (req,res) => {
  const post_id = req.params.post_id;
  const commentId = req.params.commentId;
  Posts.findCommentById(commentId)
    .then(comment => {
      if(comment) {
        res.status(200).json({ comment });
      } else {
        res.status(404).json({ error: "The post with the specified ID does not have a comment with that id does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});


//6 Delete post

router.delete("/posts/:id", (req,res) => {
  const id = req.params.id;

  Posts.remove(id)
    .then(item => {
      if(item) {
        res.status(200).json({ message: `You deleted post ${id}` });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

//7 Update Post Put

router.put("/posts/:id", (req,res) => {
  const id = req.params.id;
  const data = req.body;

  Posts.update(id, data)
    .then(item => {
      if(item && data.title && data.contents) {
        res.status(200).json({ item });
      } else if (!data.title || data.contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post.' });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message:"The post information could not be modified."
      });
    });
});

module.exports = router;

