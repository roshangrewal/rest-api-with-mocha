const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
// const { response } = require('express');

// Assertion Method
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
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
          response.body.to.include('title');
          done();
        });
    });
  });

  /**
   * Test the POST route
   */

  /**
   * Test the PUT route
   */

  /**
   * Test the PATCH route
   */

  /**
   * Test the DELETE route
   */
});
