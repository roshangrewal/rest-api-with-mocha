const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// App Initialization
const app = express();

app.use(
  // bodyParser.urlencoded for sending data from x-www-form-urlencoded
  // bodyParser.json for sending raw data
  bodyParser.json({
    extended: true,
  })
);
app.use(express.static('public'));

// MongoDB Setup
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});

const Article = mongoose.model('Article', articleSchema);

// Swagger Documentation Guide https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'REST API Prac',
      description:
        'REST API with Mocha and Swagger Docs. Basic plain application to test anything. Code @ [https://github.com/roshangrewal/rest-api-with-mocha](https://github.com/roshangrewal/rest-api-with-mocha) ',
      contact: {
        email: 'me@abc.xyz',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: {
      description: 'SwaggerHub API Auto Mocking',
      url: 'http://localhost:3000/api-docs/',
      url: 'http://localhost:3000',
    },
  },
  // routes path eg ['.routes/*.js']
  apis: ['app.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Docs generation
/**
 * tags:
  - name: articles
    description: Everything about your Pets
    externalDocs:
      description: Find out more
      url: 'http://swagger.io'
 */
/**
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - articles
 *     description: get all the articles
 *     responses:
 *       '200':
 *         description: A suceessful response
 */

/**
 * @swagger
 * /articles:
 *   post:
 *     description: publish articles
 *     responses:
 *       '200':
 *         description: A suceessful response
 */

/**
 * @swagger
 * /articles:
 *   delete:
 *     description: delete all the articles
 *     responses:
 *       '200':
 *         description: A suceessful response
 */

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
        res.status(400).send('Title and content is required!!');
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
        res.status(404).send('No article found with this ID, Retry!');
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
          // res.send({ success: true, data: Article });
        } else {
          res.status(400).send('Check article Id properly!');
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.update({ _id: req.params.id }, { $set: req.body }, function (err) {
      if (!err) {
        res.status(200).send('Successfully updated article.');
      } else {
        // res.send(err);
        res.status(400).send('Error');
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteOne({ _id: req.params.id }, function (err) {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).send(err);
      }
    });
  });

module.exports = app.listen(3000, function () {
  console.log('Server started on port 3000');
});
