const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../server.js');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
});

async function createTask(body) {
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

// User Story 1 - Create a Task

test('POST /api/tasks creates a task defaulted to To-Do', async () => {
  const { status, body } = await createTask({ title: 'Write spec' });
  assert.strictEqual(status, 201);
  assert.strictEqual(body.status, 'To-Do');
  assert.strictEqual(body.title, 'Write spec');
  assert.ok(body.id);
  assert.ok(body.createdAt);
});

test('POST /api/tasks without a title is rejected', async () => {
  const { status, body } = await createTask({});
  assert.strictEqual(status, 400);
  assert.ok(body.error);
});

// User Story 2 - View and Filter the Board

test('GET /api/tasks filters by assignee and status', async () => {
  await createTask({ title: 'Task for Riley', assignee: 'Riley' });
  await createTask({ title: 'Task for Jordan', assignee: 'Jordan' });

  const byAssignee = await fetch(`${baseUrl}/api/tasks?assignee=Riley`);
  const rileyTasks = await byAssignee.json();
  assert.ok(rileyTasks.every((t) => t.assignee === 'Riley'));
  assert.ok(rileyTasks.length >= 1);

  const byStatus = await fetch(`${baseUrl}/api/tasks?status=To-Do`);
  const todoTasks = await byStatus.json();
  assert.ok(todoTasks.every((t) => t.status === 'To-Do'));

  const noMatch = await fetch(`${baseUrl}/api/tasks?assignee=NoOneHere`);
  assert.deepStrictEqual(await noMatch.json(), []);
});

test('GET /api/tasks filters by dueDate', async () => {
  await createTask({ title: 'Due today', dueDate: '2026-08-08' });
  await createTask({ title: 'Due later', dueDate: '2026-09-01' });

  const byDueDate = await fetch(`${baseUrl}/api/tasks?dueDate=2026-08-08`);
  const dueTodayTasks = await byDueDate.json();
  assert.ok(dueTodayTasks.every((t) => t.dueDate === '2026-08-08'));
  assert.ok(dueTodayTasks.length >= 1);

  const noMatch = await fetch(`${baseUrl}/api/tasks?dueDate=2099-01-01`);
  assert.deepStrictEqual(await noMatch.json(), []);
});

// User Story 3 - Move a Task Through Its Workflow

test('PATCH /api/tasks/:id/status moves a task directly from To-Do to Done', async () => {
  const { body: created } = await createTask({ title: 'Ship it' });

  const response = await fetch(`${baseUrl}/api/tasks/${created.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Done' }),
  });
  const updated = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(updated.status, 'Done');
});

test('PATCH /api/tasks/:id/status rejects an invalid status', async () => {
  const { body: created } = await createTask({ title: 'Needs valid status' });

  const response = await fetch(`${baseUrl}/api/tasks/${created.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Archived' }),
  });

  assert.strictEqual(response.status, 400);
});

test('PATCH /api/tasks/:id/status returns 404 for an unknown task', async () => {
  const response = await fetch(`${baseUrl}/api/tasks/999999/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Done' }),
  });

  assert.strictEqual(response.status, 404);
});
