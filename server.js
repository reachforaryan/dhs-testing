const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const STATUSES = ['To-Do', 'In Progress', 'Done'];

const tasks = [];
let nextId = 1;

app.post('/api/tasks', (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const task = {
    id: nextId++,
    title,
    assignee: req.body.assignee || null,
    dueDate: req.body.dueDate || null,
    status: 'To-Do',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/tasks', (req, res) => {
  const { assignee, status } = req.query;
  let result = tasks;
  if (assignee) {
    result = result.filter((task) => task.assignee === assignee);
  }
  if (status) {
    result = result.filter((task) => task.status === status);
  }
  res.json(result);
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
  }

  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }

  task.status = status;
  res.json(task);
});

if (require.main === module) {
  app.listen(3000, () => console.log('TaskFlow listening on http://localhost:3000'));
}

module.exports = app;
