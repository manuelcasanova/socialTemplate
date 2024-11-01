// tests/server.test.js
const chai = require('chai');
const request = require('supertest');
const { expect } = chai;
const server = require('../server'); // Adjust this path as necessary

describe('Server Tests', () => {
  after(() => server.close());

  describe('GET /ping', () => {
    it('should return 200 and a pong message', (done) => {
      request(server)
        .get('/ping')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('pong! The server is running!');
          done();
        });
    });
  });

  describe('GET 404 for invalid route', () => {
    it('should return 404 for unknown route', (done) => {
      request(server)
        .get('/unknown')
        .set('Accept', 'application/json') // Explicitly set the Accept header
        .expect(404)
        .end((err, res) => {
          expect(res.body).to.have.property('error', '404 Not Found');
          done();
        });
    });
  });

  // Test for CORS handling
  //   describe('CORS', () => {
  //     it('should allow specific origins', (done) => {
  //         request(server)
  //             .options('/ping')
  //             .set('Origin', 'http://localhost:3000')
  //             .expect('Access-Control-Allow-Origin', 'http://allowed-origin.com')
  //             .expect(200, done);
  //     });
  // });

  describe('POST /some-endpoint', () => {
    it('should return 400 for invalid JSON', (done) => {
        request(server)
            .post('/some-endpoint')
            .send('{"name": "John",}') // Malformed JSON with trailing comma
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.have.property('error', 'Invalid JSON');
            })
            .end(done);
    });
});

  


});
