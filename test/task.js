const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
// const { response } = require('express');

// Assertion Method
chai.should();

chai.use(chaiHttp);

describe('REST-API Testing Using Mocha and Chai', () => {
  /**
   * Test the GET route
   */
  describe('GET /articles', () => {
    it('It should get all articles', done => {
      chai
        .request(server)
        .get('/articles')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          // response.body.length.should.be.eq(5);
          done();
        });
    });

    it('404 on wrong api endpoint', done => {
      chai
        .request(server)
        .get('/article')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  /**
   * Test the GET by ID route
   */
  describe('GET /articles/:id', () => {
    it('It should get single article by ID', done => {
      const articleId = '5ee86e3cf8d490f5399e8524';
      chai
        .request(server)
        .get('/articles/' + articleId)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('_id');
          response.body.should.have.property('title');
          response.body.should.have.property('content');
          response.body.should.have.property('_id').eq(articleId);
          done();
        });
    });

    it('It should not get article, bcs of wrong Id', done => {
      const xarticleId = '5ee86e3cf8d490f5399e8524www';
      chai
        .request(server)
        .get('/articles/' + xarticleId)
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq('No article found with this ID, Retry!');
          done();
        });
    });
  });

  /**
   * Test the POST route
   */
  describe('POST /articles', () => {
    it('It should post new article', done => {
      const article = {
        title: 'Test Article Title',
        content: 'Test Article Content',
      };
      chai
        .request(server)
        .post('/articles')
        .send(article)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });

    it("Won't post article, bcs of required title and content", done => {
      const article = {
        content: 'Test Article Content',
      };
      chai
        .request(server)
        .post('/articles')
        .send(article)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq('Title and content is required!!');
          done();
        });
    });
  });

  /**
   * Test the PUT route
   */
  describe('PUT /articles/:id', () => {
    it('It should put (update) an article', done => {
      const articleId = '5f104fda544146f95be4b3dc';
      const article = {
        title: 'Test Updated Article',
        content: 'Test Updated Article Content',
      };
      chai
        .request(server)
        .put('/articles/' + articleId)
        .send(article)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          // response.body.should.have.property('_id').eq(articleId);
          response.text.should.be.eq(
            'Successfully updated the selected article.'
          );
          // response.body.should.have.property('title');
          // response.body.should.have.property('content');
          done();
        });
    });

    it('It should fail put request, bcs of wrong id', done => {
      const articleId = '5f104fda544146f95be4b3dcwww';
      const article = {
        title: 'Test Updated Article',
        content: 'Test Updated Article Content',
      };
      chai
        .request(server)
        .put('/articles/' + articleId)
        .send(article)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq('Check article Id properly!');
          done();
        });
    });
  });

  /**
   * Test the PATCH route
   */
  describe('PATCH /articles/:id', () => {
    it('It should PATCH (update) an article title', done => {
      const articleId = '5f104fda544146f95be4b3dc';
      const article = {
        title: 'Test PATCH',
      };
      chai
        .request(server)
        .patch('/articles/' + articleId)
        .send(article)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.text.should.be.eq('Successfully updated article.');
          done();
        });
    });

    it('It should fail PATCH request, bcs of wrong id', done => {
      const articleId = '5f104fda544146f95be4b3dcwww';
      const article = {
        title: "This won't work",
      };
      chai
        .request(server)
        .patch('/articles/' + articleId)
        .send(article)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq('Error');
          done();
        });
    });
  });

  /**
   * Test the DELETE route
   */
  describe('DELETE /articles/:id', () => {
    it('It should DELETE an article', done => {
      const articleId = '5f104f9eb92d66f899b23b2d';
      chai
        .request(server)
        .delete('/articles/' + articleId)
        .end((err, response) => {
          response.should.have.status(200);
          // response.json.should.be.eq({ success: true });
          done();
        });
    });

    it("Won't DELETE an article, bcs of wrong id", done => {
      const articleId = '5f104f9eb92d66f899b23b2dwww';
      chai
        .request(server)
        .delete('/articles/' + articleId)
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
});
