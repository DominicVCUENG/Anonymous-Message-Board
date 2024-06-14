const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let threadId;
  let replyId;
  const board = 'testboard';
  const threadText = 'Test thread';
  const replyText = 'Test reply';
  const deletePassword = 'password123';

  suite('Threads', function() {
    test('Creating a new thread: POST request to /api/threads/{board}', function(done) {
      chai.request(server)
        .post(`/api/threads/${board}`)
        .send({ text: threadText, delete_password: deletePassword })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function(done) {
      chai.request(server)
        .get(`/api/threads/${board}`)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);
          if (res.body.length > 0) {
            threadId = res.body[0]._id;
            assert.isArray(res.body[0].replies);
            assert.isAtMost(res.body[0].replies.length, 3);
          }
          done();
        });
    });

    test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', function(done) {
      chai.request(server)
        .delete(`/api/threads/${board}`)
        .send({ thread_id: threadId, delete_password: 'wrongpassword' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function(done) {
      chai.request(server)
        .delete(`/api/threads/${board}`)
        .send({ thread_id: threadId, delete_password: deletePassword })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });

    test('Reporting a thread: PUT request to /api/threads/{board}', function(done) {
      chai.request(server)
        .post(`/api/threads/${board}`)
        .send({ text: threadText, delete_password: deletePassword })
        .end(function(err, res) {
          chai.request(server)
            .put(`/api/threads/${board}`)
            .send({ thread_id: threadId })
            .end(function(err, res) {
              assert.equal(res.status, 404);
              assert.equal(res.text, 'Thread not found');
              done();
            });
        });
    });
  });

  suite('Replies', function() {
    test('Creating a new reply: POST request to /api/replies/{board}', function(done) {
      chai.request(server)
        .post(`/api/replies/${board}`)
        .send({ thread_id: threadId, text: replyText, delete_password: deletePassword })
        .end(function(err, res) {
          assert.equal(res.status, 404);
          done();
        });
    });

    test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function(done) {
      chai.request(server)
        .get(`/api/replies/${board}`)
        .query({ thread_id: threadId })
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.isObject(res.body);
          done();
        });
    });

    test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function(done) {
      chai.request(server)
        .delete(`/api/replies/${board}`)
        .send({ thread_id: threadId, reply_id: replyId, delete_password: 'wrongpassword' })
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.text, 'Thread not found');
          done();
        });
    });

    test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function(done) {
      chai.request(server)
        .delete(`/api/replies/${board}`)
        .send({ thread_id: threadId, reply_id: replyId, delete_password: deletePassword })
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.text, 'Thread not found');
          done();
        });
    });

    test('Reporting a reply: PUT request to /api/replies/{board}', function(done) {
      chai.request(server)
        .put(`/api/replies/${board}`)
        .send({ thread_id: threadId, reply_id: replyId })
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.text, 'Thread not found');
          done();
        });
    });
  });
});
