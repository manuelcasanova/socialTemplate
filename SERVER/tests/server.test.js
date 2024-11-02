const chai = require('chai');
const request = require('supertest');
const { expect } = chai;
const server = require('../server'); // Adjust path as needed

describe('Server Tests', () => {
  after(() => server.close());

  // Define an array of endpoints where we want to run the same tests
  const endpointPaths = [
    '/some-endpoint',
    //add more endpoints as created
  ];

  // Common tests to run on each endpoint
  const commonTests = [
    {
      description: 'should return 200 for valid JSON',
      method: 'post',
      body: { name: "John" },
      expectedStatus: 200,
      responseText: 'Success!',
      contentType: /text/,
    },
    {
      description: 'should return 400 for empty JSON object',
      method: 'post',
      body: {},
      expectedStatus: 400,
      responseError: 'Invalid JSON',
      contentType: /json/,
    },
    {
      description: 'should return 415 for unsupported media type',
      method: 'post',
      body: 'name=John',
      requestContentType: 'text/plain',
      expectedStatus: 415,
      responseError: 'Unsupported Media Type',
      contentType: /json/,
    },
    {
      description: 'should return 400 for invalid JSON',
      method: 'post',
      body: '{"name": "John",}', // Malformed JSON
      requestContentType: 'application/json',
      expectedStatus: 400,
      responseError: 'Invalid JSON',
      contentType: /json/,
    },
    {
      description: 'should accept requests with cookies',
      method: 'post',
      body: { name: "John" },
      expectedStatus: 200,
      responseText: 'Success!',
      cookies: 'sessionId=abc123',
      contentType: /text/,
    },
    {
      description: 'should return 200 for valid URL-encoded data',
      method: 'post',
      body: 'name=John',
      requestContentType: 'application/x-www-form-urlencoded',
      expectedStatus: 200,
      responseText: 'Success!',
    },
    {
      description: 'should return 405 for PUT method',
      method: 'put',
      body: { name: "John" },
      expectedStatus: 405,
    },
    {
      description: 'should return 405 for DELETE method',
      method: 'delete',
      expectedStatus: 405,
    },
    {
      description: 'should return 400 for missing required fields',
      method: 'post',
      body: {}, // Missing required field
      expectedStatus: 400,
      responseError: 'Invalid JSON',
      contentType: /json/,
    },
    {
      description: 'should respond to preflight request with 204',
      method: 'options',
      expectedStatus: 204,
      requestOrigin: 'http://localhost:3000',
    },
    {
      description: 'should allow specific origins',
      method: 'options',
      path: '/ping',
      requestOrigin: 'http://localhost:3000',
      expectedStatus: 204,
      corsHeader: 'http://localhost:3000',
    },
    {
      description: 'should return 200 and a pong message',
      method: 'get',
      path: '/ping',
      expectedStatus: 200,
      responseText: 'pong! The server is running!',
    },
    {
      description: 'should return text response for valid request',
      method: 'post',
      body: { name: "John" },
      requestContentType: 'application/json',
      expectedStatus: 200,
      responseText: 'Success!',
      contentType: /text/,
    },
    {
      description: 'should respond within 200ms for /ping',
      method: 'get',
      path: '/ping',
      performanceTest: true,
      maxDuration: 200,
    },
    {
      description: 'should return 500 for internal server error',
      method: 'get',
      path: '/error',
      expectedStatus: 500,
      responseError: 'This is a forced error',
      contentType: /json/,
      commentOut: true,
    },
  ];

  // Loop through each endpoint and run the common tests
  endpointPaths.forEach((path) => {
    describe(`Tests for ${path}`, () => {
      commonTests.forEach(({
        description,
        method,
        body,
        expectedStatus,
        responseText,
        responseError,
        contentType,
        requestContentType,
        cookies,
        requestOrigin,
        corsHeader,
        path: specificPath,
        performanceTest,
        maxDuration,
        commentOut,
      }) => {
        // Comment out specific tests if needed
        if (commentOut) return;

        const testPath = specificPath || path;

        it(description, (done) => {
          const req = request(server)[method](testPath);

          // Set headers and body if needed
          if (requestContentType) req.set('Content-Type', requestContentType);
          if (requestOrigin) req.set('Origin', requestOrigin);
          if (cookies) req.set('Cookie', cookies);
          if (body) req.send(body);

          // Expect headers and status codes
          req.expect(expectedStatus);

          if (contentType) req.expect('Content-Type', contentType);

          if (responseText) {
            req.expect(res => expect(res.text).to.equal(responseText));
          }

          if (responseError) {
            req.expect(res => {
              expect(res.body).to.have.property('error', responseError);
            });
          }

          if (corsHeader) {
            req.expect('Access-Control-Allow-Origin', corsHeader);
          }

          if (performanceTest) {
            const start = Date.now();
            req.end((err, res) => {
              const duration = Date.now() - start;
              expect(duration).to.be.lessThan(maxDuration);
              done();
            });
          } else {
            req.end(done);
          }
        });
      });
    });
  });
});

describe('GET 404 for unknown route', () => {
  it('should return 404 for unknown route', (done) => {
    request(server)
      .get('/unknown')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        expect(res.body).to.have.property('error', '404 Not Found');
        done();
      });
  });
});





// describe('Session and Security Testing', () => {
//   it('should return 401 for invalid session cookies', (done) => {
//     request(server)
//       .post('/some-endpoint')
//       .set('Cookie', 'sessionId=invalidSession')
//       .send({ name: "John" })
//       .expect(401)
//       .expect(res => expect(res.body).to.have.property('error', 'Unauthorized'))
//       .end(done);
//   });

//   it('should include secure headers in responses', (done) => {
//     request(server)
//       .get('/ping')
//       .expect('X-Content-Type-Options', 'nosniff')
//       .expect('X-Frame-Options', 'DENY')
//       .expect(200, done);
//   });

// });







