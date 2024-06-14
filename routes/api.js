'use strict';

const threadController = require('../controllers/threadController');
const replyController = require('../controllers/replyController');

module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(threadController.createThread)
    .put(threadController.reportThread)
    .delete(threadController.deleteThread)
    .get(threadController.getThreads);

  app.route('/api/replies/:board')
    .post(replyController.createReply)
    .put(replyController.reportReply)
    .delete(replyController.deleteReply)
    .get(replyController.getReplies);

};
