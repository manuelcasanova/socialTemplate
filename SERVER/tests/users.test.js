const sinon = require('sinon');
const chai = require('chai');
const request = require('supertest');
const { expect } = chai;
const server = require('../server'); // Adjust path as needed
const pool = require('../config/db'); 


it('should return 200 and a list of users', (done) => {
  request(server)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
          expect(res.body).to.be.an('array'); // Check if response is an array
          done();
      });
});

it('should return an empty array when there are no users', (done) => {
  pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE', (err) => {
    if (err) return done(err);

    request(server)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        // console.log('Response body:', res.body); // Log the response body
        expect(res.body).to.deep.equal([]); // Expect an empty array
        done();
      });
  });
});


it('should return 500 for internal server error', (done) => {
  const consoleError = console.error; // Save original console.error
  console.error = () => {}; // Suppress console.error logs

  sinon.stub(pool, 'query').throws(new Error('Database error'));

  request(server)
      .get('/users')
      .expect(500)
      .expect(res => {
          expect(res.body).to.have.property('error', 'Internal server error');
      })
      .end(err => {
          console.error = consoleError; // Restore original console.error
          if (err) return done(err);
          done(); // Call done without error
      });
});


it('should respond to preflight request with 204', (done) => {
  request(server)
      .options('/users')
      .expect(204)
      .end(done);
});

// it('should return 401 for unauthorized access', (done) => {
//   // Mock or implement any necessary authentication mechanism
//   request(server)
//       .get('/users')
//       .set('Authorization', 'Bearer invalid_token')
//       .expect(401)
//       .expect(res => {
//           expect(res.body).to.have.property('error', 'Unauthorized');
//       })
//       .end(done);
// });
