const boards = require('../data');

exports.createThread = (req, res) => {
  const { board } = req.params;
  const { text, delete_password } = req.body;
  const thread = {
    _id: Date.now().toString(),
    text,
    created_on: new Date(),
    bumped_on: new Date(),
    reported: false,
    delete_password,
    replies: []
  };
  if (!boards[board]) boards[board] = [];
  boards[board].push(thread);
  res.redirect(`/b/${board}/`);
};

exports.reportThread = (req, res) => {
  const { board } = req.params;
  const { thread_id } = req.body;
  const thread = boards[board].find(thread => thread._id === thread_id);
  if (thread) {
    thread.reported = true;
    res.send('reported');
  } else {
    res.status(404).send('Thread not found');
  }
};

exports.deleteThread = (req, res) => {
  const { board } = req.params;
  const { thread_id, delete_password } = req.body;
  const threadIndex = boards[board].findIndex(thread => thread._id === thread_id);
  if (threadIndex !== -1) {
    if (boards[board][threadIndex].delete_password === delete_password) {
      boards[board].splice(threadIndex, 1);
      res.send('success');
    } else {
      res.send('incorrect password');
    }
  } else {
    res.status(404).send('Thread not found');
  }
};

exports.getThreads = (req, res) => {
  const { board } = req.params;
  if (!boards[board]) return res.json([]);
  const threads = boards[board]
    .slice(-10)
    .map(thread => ({
      ...thread,
      delete_password: undefined,
      reported: undefined,
      replies: thread.replies.slice(-3).map(reply => ({
        ...reply,
        delete_password: undefined,
        reported: undefined
      }))
    }));
  res.json(threads);
};
