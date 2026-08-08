# Research: Team Task Tracker

All technical choices were specified directly by the user in the `/speckit-plan`
input, so this phase records the rationale and rejected alternatives rather
than resolving open unknowns — there are no `NEEDS CLARIFICATION` items.

## Decision: Vanilla HTML/CSS/JS frontend + Node/Express backend

**Rationale**: Explicit user requirement. A 3-user-story board with one
entity does not need a frontend framework or build step — vanilla JS
covers rendering the board, submitting the create-task form, and filtering.

**Alternatives considered**: React/Vue SPA — rejected, adds build tooling
and a dependency chain for no functional gain at this scope (violates
constitution Simplicity First).

## Decision: In-memory JSON array for storage, no database

**Rationale**: Explicit user requirement ("no database, for now"). A single
Node process holding an array of task objects is sufficient for the
feature's scope (single shared board, small team). Data resets on server
restart — acceptable per spec Assumptions (no persistence guarantee
required for v1).

**Alternatives considered**: SQLite/file-backed JSON — rejected, adds
schema/migration or file I/O concerns the user explicitly deferred.

## Decision: Single Express server file serving static assets + JSON API

**Rationale**: "Keep it to a few files" instruction, and constitution
Simplicity First — splitting ~5 endpoints and one entity into
models/services/controllers layers is premature structure with no present
need.

**Alternatives considered**: Layered `src/models`, `src/services`,
`src/routes` — rejected as over-structured for this scope; can be
introduced later if the API genuinely grows.

## Decision: Sequential integer task IDs assigned by the server

**Rationale**: Simplest unique key for a single-process in-memory array;
no dependency needed (vs. a UUID library) and no collision risk since
there is exactly one writer process.

**Alternatives considered**: `crypto.randomUUID()` — rejected as
unnecessary; adds no value over a counter for a single in-memory process.

## Decision: Node built-in `node:test` + `node:assert` for core-path tests

**Rationale**: Ships with Node, zero added dependency, sufficient for
testing a handful of HTTP endpoints via the built-in `fetch`. Satisfies
constitution Principle IV (Test the Core Path) without introducing a test
framework dependency.

**Alternatives considered**: Jest/Mocha/Supertest — rejected as
unnecessary weight for a handful of core-path tests.

## Decision: No authentication; member/assignee identified by free-text name

**Rationale**: Matches spec Assumptions — v1 is a single shared team
workspace, no login system.

**Alternatives considered**: Session-based login — rejected, explicitly
out of scope per the feature spec.
