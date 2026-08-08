# Implementation Plan: Team Task Tracker

**Branch**: `001-task-tracker` | **Date**: 2026-08-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-task-tracker/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

TaskFlow's board: members create tasks (title required, optional assignee
and due date), move them between To-Do / In Progress / Done, and anyone can
view and filter the board by assignee or status. Built as a single-page
vanilla HTML/CSS/JS frontend talking to a small Node/Express JSON API, with
an in-memory array as the only store — no database, no build step, no
frontend framework.

## Technical Context

**Language/Version**: JavaScript (Node.js 20+)

**Primary Dependencies**: Express (HTTP server + static file serving); no
frontend framework — plain HTML/CSS/JS served as static assets.

**Storage**: In-memory JSON array on the server process. No database; data
resets on server restart (per spec Assumptions, acceptable for v1).

**Testing**: Node's built-in `node:test` + `node:assert` running against
the running server via `fetch`, per constitution Principle IV (Test the
Core Path). No test framework dependency added.

**Target Platform**: Any machine with Node.js 20+; single local/server
process, accessed via a web browser.

**Project Type**: Web application — one small backend (Express) + one
static vanilla-JS frontend, deliberately not split into `backend/` and
`frontend/` project roots (see Structure Decision below).

**Performance Goals**: Not specified beyond standard interactive-web
expectations; in-memory operations on a small team's task list are
effectively instant.

**Constraints**: No database; state is not persisted across server
restarts. Single shared board, no multi-tenancy.

**Scale/Scope**: A single small team's board — tens of tasks, no
concurrent-load requirements.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Simplicity First**: One `server.js` (routes + in-memory array), one
  `public/` folder of static HTML/CSS/JS. No `models/`/`services/`
  layering, no frontend framework, no build step — see research.md for
  each simplification and its rejected alternative.
- [x] **Acceptance Criteria Required**: spec.md has Given/When/Then
  acceptance scenarios for all 3 user stories.
- [x] **Readable Code Over Clever Code**: Plan calls for a plain
  request-handler-per-route Express file and straightforward DOM
  updates in `app.js`; nothing requires a cleverness-justification
  comment.
- [x] **Test the Core Path**: `tests/server.test.js` covers create-task,
  list/filter, and status-change — the core path of each user story (see
  quickstart.md).

Re-checked after Phase 1 design: still passes, no changes to structure.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
package.json            # Express dependency + npm start/test scripts
server.js                # Express app: static file serving + /api/tasks routes, in-memory task array
public/
├── index.html            # Board markup: create-task form, filter controls, task list container
├── app.js                 # fetch() calls to the API, renders the board, handles filter + status-change UI
└── styles.css              # Board styling

tests/
└── server.test.js        # Core-path tests (node:test): create task, list/filter, status transition
```

**Structure Decision**: Single small web app, deliberately not split into
`backend/`/`frontend/` project roots or `src/models`/`src/services`
layers — one server file and one static-assets folder is the whole
system, per the user's "few files" instruction and constitution
Simplicity First. See research.md for the rejected layered alternative.

## Complexity Tracking

No Constitution Check violations — this section is intentionally empty.
