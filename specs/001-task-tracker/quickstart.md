# Quickstart: Team Task Tracker

Validates the feature end-to-end against the [API contract](contracts/tasks-api.md)
and the spec's acceptance scenarios.

## Prerequisites

- Node.js 20+
- From the repo root: `npm install`

## Run

```bash
npm start
```

Serves the board UI and API at `http://localhost:3000` (static files from
`public/`, API under `/api/tasks`).

## Automated core-path check

```bash
npm test
```

Runs `tests/server.test.js` (`node:test`), covering the core path of each
user story: create a task, list/filter tasks, and change a task's status.

## Manual validation

### User Story 1 — Create a Task

```bash
curl -s -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write spec","assignee":"Riley","dueDate":"2026-08-10"}'
```

Expected: `201` with the created task, `status` = `"To-Do"`.

```bash
curl -s -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' -d '{}'
```

Expected: `400` — title is required.

### User Story 2 — View and Filter the Board

Open `http://localhost:3000` in a browser — the created task should appear
on the board.

```bash
curl -s "http://localhost:3000/api/tasks?assignee=Riley"
curl -s "http://localhost:3000/api/tasks?status=To-Do"
```

Expected: each returns only matching tasks; an assignee/status with no
matches returns `[]`.

### User Story 3 — Move a Task Through Its Workflow

```bash
curl -s -X PATCH http://localhost:3000/api/tasks/1/status \
  -H 'Content-Type: application/json' -d '{"status":"Done"}'
```

Expected: `200` with `status` = `"Done"` (direct To-Do → Done move
succeeds, per spec edge case). Reload the board — the change is visible.
