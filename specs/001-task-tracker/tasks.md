---

description: "Task list template for feature implementation"
---

# Tasks: Team Task Tracker

**Input**: Design documents from `/specs/001-task-tracker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tasks-api.md, quickstart.md

**Tests**: Per the project constitution (Test the Core Path), every user story includes at least one automated core-path test in `tests/server.test.js` (Node's built-in `node:test` + `node:assert`, no added dependency).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Per plan.md's Structure Decision, this feature deliberately uses only 4 source files (`server.js`, `public/index.html`, `public/app.js`, `public/styles.css`) plus one test file — most implementation tasks across stories therefore touch shared files and are sequenced in priority order rather than parallelized across developers.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions

Single small web app at the repository root (see plan.md Structure Decision):
`server.js`, `public/`, `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization

- [X] T001 Create `package.json` at repository root: name `taskflow`, `"express"` as a dependency, and scripts `"start": "node server.js"` and `"test": "node --test tests/"`; then run `npm install` to generate `node_modules/` and `package-lock.json`
- [X] T002 [P] Create empty `public/` and `tests/` directories at the repository root (per plan.md Structure Decision)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared server skeleton and static page shell that every user story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Create `server.js`: an Express app with `express.json()` middleware, `express.static('public')` middleware, an in-memory `tasks` array, and a `nextId` counter starting at 1. Export the app (`module.exports = app`) and only call `app.listen(3000)` when the file is run directly (`require.main === module`), so tests can import the app and bind it to their own ephemeral port.
- [X] T004 [P] Create `public/index.html`: page shell with a create-task form (title/assignee/due-date inputs and a submit button), a row of filter controls (assignee text input, status `<select>`, and a "clear filters" button), and an empty container element for the task list. Link `styles.css` and `app.js`.
- [X] T005 [P] Create `public/styles.css`: base layout styling for the create-task form, filter controls, and the task list (e.g., each task as a row/card showing title, assignee, due date, and status).
- [X] T006 [P] Create `public/app.js` skeleton: a `DOMContentLoaded` listener, references to the form/filter/list DOM elements from `index.html`, and empty `loadTasks()` and `renderTasks(tasks)` function stubs wired to run on page load.

**Checkpoint**: `npm start` runs the server; `http://localhost:3000` loads a blank board page. No API behavior yet.

---

## Phase 3: User Story 1 - Create a Task (Priority: P1) 🎯 MVP

**Goal**: A member can create a task with a title (required), an optional assignee, and an optional due date, and see it appear on the board with status To-Do.

**Independent Test**: Submit the create-task form with only a title and confirm the task appears on the board with status To-Do; submit with no title and confirm it's rejected.

### Tests for User Story 1 (core-path test REQUIRED)

> **NOTE: Write this test FIRST, ensure it FAILS before implementation**

- [X] T007 [US1] In `tests/server.test.js`, using `node:test` + `node:assert`: import the app from `../server.js`, start it on an ephemeral port in a `before()` hook and close it in `after()`. Add a test that `POST /api/tasks` with `{"title":"Write spec"}` returns `201` with a task whose `status` is `"To-Do"` and `id`/`createdAt` are set, and a test that `POST /api/tasks` with `{}` (no title) returns `400`.

### Implementation for User Story 1

- [X] T008 [US1] In `server.js`, implement `POST /api/tasks`: reject (400, `{"error":"title is required"}`) if `title` is missing or blank after trimming; otherwise create a task with a server-assigned sequential `id`, the given `title` (trimmed), optional `assignee`/`dueDate` (or `null`), `status` set to `"To-Do"`, and `createdAt` set to the current ISO timestamp; push it to the `tasks` array and respond `201` with the created task.
- [X] T009 [US1] In `server.js`, implement `GET /api/tasks` returning the full `tasks` array as JSON (no filtering yet — filtering is added in User Story 2).
- [X] T010 [US1] In `public/app.js`, implement `loadTasks()` to `fetch('/api/tasks')` and call `renderTasks()` with the result, and wire the create-task form's submit handler to `POST /api/tasks` with the entered title/assignee/dueDate, then clear the form and call `loadTasks()` again.
- [X] T011 [US1] In `public/app.js`, implement `renderTasks(tasks)` to display each task's title, assignee (or blank), due date (or blank), and status in the list container from `index.html`.

**Checkpoint**: A user can create a task via the form and see it appear on the board with status To-Do. `npm test` passes for User Story 1.

---

## Phase 4: User Story 2 - View and Filter the Board (Priority: P2)

**Goal**: Anyone can view the full board and narrow it by assignee and/or status.

**Independent Test**: With several tasks on the board, filter by a specific assignee and confirm only their tasks show; filter by a specific status and confirm only matching tasks show; clear filters and confirm all tasks return.

### Tests for User Story 2 (core-path test REQUIRED)

- [X] T012 [US2] In `tests/server.test.js`, add tests that `GET /api/tasks?assignee=X` returns only tasks with that assignee, `GET /api/tasks?status=To-Do` returns only tasks with that status, both params combined narrow correctly, and a filter matching nothing returns `[]`. (Seed tasks via `POST /api/tasks` within the test.)

### Implementation for User Story 2

- [X] T013 [US2] In `server.js`, extend the `GET /api/tasks` handler from T009 to read optional `assignee` and `status` query parameters and filter the in-memory `tasks` array by exact match on either or both before responding.
- [X] T014 [US2] In `public/index.html`, ensure the filter controls added in T004 (assignee input, status select, clear button) are present and correctly labeled.
- [X] T015 [US2] In `public/app.js`, wire the filter controls: on change, call `loadTasks()` with the current assignee/status values appended as query params to `/api/tasks`; wire "clear filters" to reset the controls and reload the unfiltered list.

**Checkpoint**: Users can filter the board by assignee and/or status and clear filters to see everything. `npm test` passes for User Stories 1 and 2.

---

## Phase 5: User Story 3 - Move a Task Through Its Workflow (Priority: P3)

**Goal**: A member can move a task between To-Do, In Progress, and Done, in any order.

**Independent Test**: Take an existing task, change its status via the board, and confirm the board reflects the new status — including moving directly from To-Do to Done.

### Tests for User Story 3 (core-path test REQUIRED)

- [X] T016 [US3] In `tests/server.test.js`, add tests that `PATCH /api/tasks/:id/status` with a valid status returns `200` with the updated task (including a direct `"To-Do"` → `"Done"` move), an invalid status value returns `400`, and an unknown `:id` returns `404`.

### Implementation for User Story 3

- [X] T017 [US3] In `server.js`, implement `PATCH /api/tasks/:id/status`: validate the body's `status` is one of `"To-Do"`, `"In Progress"`, `"Done"` (400 otherwise); find the task by `id` (404 if not found); update its `status` and respond `200` with the updated task.
- [X] T018 [US3] In `public/app.js`'s `renderTasks(tasks)`, add a status control (e.g., a `<select>`) to each rendered task row, pre-set to that task's current status.
- [X] T019 [US3] In `public/app.js`, wire each task row's status control's change event to `PATCH /api/tasks/:id/status` with the new value, then call `loadTasks()` to refresh the board.

**Checkpoint**: Users can move a task between To-Do, In Progress, and Done directly from the board. `npm test` passes for all three user stories.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Small finishing touches spanning multiple stories

- [X] T020 [P] In `public/app.js` and `public/index.html`, show an empty-state message in the list container when `renderTasks([])` is called (no tasks, or none match the current filters).
- [X] T021 Run through every scenario in `quickstart.md` end-to-end (manual `curl` commands and a browser check) and fix any discrepancy found.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational completion.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories.
- **User Story 2 (P2)**: Extends the `GET /api/tasks` handler that User Story 1 creates (T009 → T013) — implement after User Story 1.
- **User Story 3 (P3)**: Adds an independent route, but needs tasks to exist (from User Story 1) to be meaningfully tested — implement after User Story 1; can be done before or after User Story 2.

### Within Each User Story

- Write the core-path test first; confirm it fails before implementing.
- `server.js` route handler before the `public/app.js` wiring that calls it.
- Story complete and checkpoint-verified before moving to the next priority.

### Parallel Opportunities

- T001-T002 (Setup) have no cross-dependency.
- T003-T006 (Foundational) touch four different files with no interdependency and can be done in parallel.
- Because Phase 3-5 tasks concentrate on the same 3 shared files (`server.js`, `public/app.js`, `public/index.html`), they are sequential within and across stories, not parallelizable across developers — this is a direct consequence of the "few files" structure decision in plan.md, not an oversight.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run `npm test`, then manually create a task via the browser
5. Demo if ready — this alone is a usable (if unfiltered, status-locked) task board

### Incremental Delivery

1. Setup + Foundational → server runs, blank board loads
2. Add User Story 1 → create tasks → demo
3. Add User Story 2 → filter the board → demo
4. Add User Story 3 → move tasks between statuses → demo
5. Polish → empty states, full quickstart validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Verify each story's core-path test fails before implementing that story
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
