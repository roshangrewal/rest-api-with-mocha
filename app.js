const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(
  // bodyParser.urlencoded for sending data from x-www-form-urlencoded
  // bodyParser.json for sending raw data
  bodyParser.json({
    extended: true,
  })
);
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

// Requests Targetting all Articles
app
  .route('/articles')

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.json({ success: true, data: newArticle });
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send('Successfully deleted all articles.');
      } else {
        res.send(err);
      }
    });
  });

// Requests Targetting A Specific Article

app
  .route('/articles/:id')

  .get(function (req, res) {
    Article.findOne({ _id: req.params.id }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('No article found with this ID, Retry!');
      }
    });
  })

  .put(function (req, res) {
    Article.update(
      { _id: req.params.id },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send('Successfully updated the selected article.');
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.update({ _id: req.params.id }, { $set: req.body }, function (err) {
      if (!err) {
        res.send('Successfully updated article.');
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteOne({ _id: req.params.id }, function (err) {
      if (!err) {
        res.json({ success: true });
      } else {
        res.send(err);
      }
    });
  });

module.exports = app.listen(3000, function () {
  console.log('Server started on port 3000');
});
