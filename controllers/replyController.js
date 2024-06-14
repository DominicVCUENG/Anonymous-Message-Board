const boards = require('../data');

exports.createReply = (req, res) => {
  const { board } = req.params;
  const { thread_id, text, delete_password } = req.body;
  const thread = boards[board].find(thread => thread._id === thread_id);
  if (thread) {
    const reply = {
      _id: Date.now().toString(),
      text,
      created_on: new Date(),
      delete_password,
      reported: false
    };
    thread.replies.push(reply);
    thread.bumped_on = new Date();
    res.redirect(`/b/${board}/${thread_id}`);
  } else {
    res.status(404).send('Thread not found');
  }
};

exports.reportReply = (req, res) => {
  const { board } = req.params;
  const { thread_id, reply_id } = req.body;
  const thread = boards[board].find(thread => thread._id === thread_id);
  if (thread) {
    const reply = thread.replies.find(reply => reply._id === reply_id);
    if (reply) {
      reply.reported = true;
      res.send('reported');
    } else {
      res.status(404).send('Reply not found');
    }
  } else {
    res.status(404).send('Thread not found');
  }
};

exports.deleteReply = (req, res) => {
  const { board } = req.params;
  const { thread_id, reply_id, delete_password } = req.body;
  const thread = boards[board].find(thread => thread._id === thread_id);
  if (thread) {
    const reply = thread.replies.find(reply => reply._id === reply_id);
    if (reply) {
      if (reply.delete_password === delete_password) {
        reply.text = '[deleted]';
        res.send('success');
      } else {
        res.send('incorrect password');
      }
    } else {
      res.status(404).send('Reply not found');
    }
  } else {
    res.status(404).send('Thread not found');
  }
};

exports.getReplies = (req, res) => {
  const { board } = req.params;
  const { thread_id } = req.query;
  const thread = boards[board].find(thread => thread._id === thread_id);
  if (thread) {
    const threadWithReplies = {
      ...thread,
      delete_password: undefined,
      reported: undefined,
      replies: thread.replies.map(reply => ({
        ...reply,
        delete_password: undefined,
        reported: undefined
      }))
    };
    res.json(threadWithReplies);
  } else {
    res.status(404).send('Thread not found');
  }
};

