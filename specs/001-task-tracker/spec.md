# Feature Specification: Team Task Tracker

**Feature Branch**: `001-task-tracker`

**Created**: 2026-08-06

**Status**: Draft

**Input**: User description: "Build TaskFlow, a team task-tracker. A member can create a task with a title (required), an assignee, and a due date. A task has a status of To-Do, In Progress, or Done and can move between them. Anyone can view the board and filter it by assignee or by status."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Task (Priority: P1)

A team member captures a piece of work by creating a task with a title, and
optionally an assignee and a due date, so it is tracked on the shared board.

**Why this priority**: Capturing work is the foundational action of a task
tracker — nothing else in the system has value until tasks exist.

**Independent Test**: Can be fully tested by creating a task with just a
title and confirming it appears on the board with status To-Do.

**Acceptance Scenarios**:

1. **Given** a member is on the board, **When** they create a task with only
   a title, **Then** the task appears on the board with status To-Do and no
   assignee or due date.
2. **Given** a member is on the board, **When** they create a task with a
   title, an assignee, and a due date, **Then** the task appears on the
   board showing all three values.
3. **Given** a member is creating a task, **When** they attempt to submit it
   without a title, **Then** the system rejects the submission and prompts
   them to enter a title.

---

### User Story 2 - View and Filter the Board (Priority: P2)

Anyone opens the board to see the team's current tasks, and narrows the
list by assignee or by status to focus on relevant work.

**Why this priority**: Once tasks exist, seeing and filtering them is what
makes the tracker useful day-to-day for the whole team.

**Independent Test**: Can be fully tested by loading the board with several
existing tasks and confirming all tasks display, then applying an assignee
filter and a status filter and confirming the results narrow correctly.

**Acceptance Scenarios**:

1. **Given** tasks exist on the board, **When** any user opens the board,
   **Then** they see every task's title, assignee, due date, and status.
2. **Given** tasks assigned to different members exist, **When** a user
   filters the board by a specific assignee, **Then** only tasks assigned
   to that member are shown.
3. **Given** tasks in different statuses exist, **When** a user filters the
   board by a specific status, **Then** only tasks in that status are shown.
4. **Given** a filter is applied, **When** the user clears it, **Then** the
   board again shows all tasks.

---

### User Story 3 - Move a Task Through Its Workflow (Priority: P3)

A team member updates a task's status as work progresses, moving it between
To-Do, In Progress, and Done.

**Why this priority**: Status changes are what keep the board an accurate,
trustworthy picture of the team's work, but they depend on tasks already
existing and being visible (User Stories 1 and 2).

**Independent Test**: Can be fully tested by taking an existing task,
changing its status, and confirming the board reflects the new status.

**Acceptance Scenarios**:

1. **Given** a task with status To-Do, **When** a member moves it to In
   Progress, **Then** the board shows the task with status In Progress.
2. **Given** a task with status In Progress, **When** a member moves it to
   Done, **Then** the board shows the task with status Done.
3. **Given** a task with status To-Do, **When** a member moves it directly
   to Done, **Then** the board shows the task with status Done (moves are
   not required to pass through every status in order).

---

### Edge Cases

- What happens when a member creates a task with a due date in the past?
  The task is created normally; the system does not block past due dates.
- How does the board behave when a filter matches no tasks? It shows an
  empty state rather than an error.
- How is an unassigned task represented when filtering by assignee? It is
  excluded from any specific-assignee filter and only shown when no
  assignee filter is applied.
- What happens if two members change the same task's status at nearly the
  same time? The most recent status change is what the board reflects.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a member to create a task by providing a
  title.
- **FR-002**: System MUST require a non-empty title to create a task and
  reject creation attempts that omit one.
- **FR-003**: System MUST allow a member to optionally specify an assignee
  when creating a task.
- **FR-004**: System MUST allow a member to optionally specify a due date
  when creating a task.
- **FR-005**: System MUST set every newly created task's status to To-Do.
- **FR-006**: System MUST allow a member to change a task's status to
  To-Do, In Progress, or Done, in any order.
- **FR-007**: System MUST allow any user to view all tasks on the board.
- **FR-008**: System MUST allow any user to filter the board by assignee.
- **FR-009**: System MUST allow any user to filter the board by status.
- **FR-010**: System MUST allow assignee and status filters to be applied
  together as well as independently.
- **FR-011**: System MUST allow a user to clear applied filters to return
  to the unfiltered board.
- **FR-012**: System MUST persist tasks and their current status so they
  remain visible across separate visits to the board.

### Key Entities

- **Task**: A unit of work on the board. Attributes: title (required),
  assignee (optional), due date (optional), status (To-Do, In Progress, or
  Done; defaults to To-Do).
- **Team Member**: The person a task can be assigned to or created by,
  identified by name.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A member can create a new task with just a title in under 15
  seconds.
- **SC-002**: 100% of task creation attempts without a title are blocked
  with a clear message telling the member to add one.
- **SC-003**: Any user can see every current task and its status in a
  single board view, with no more than one filter action needed to narrow
  the board by assignee or by status.
- **SC-004**: A member can move a task to a different status in a single
  action.
- **SC-005**: After a status change, all users viewing the board see the
  updated status the next time they view it.

## Assumptions

- No authentication/login system is required for v1; TaskFlow is a single
  shared team workspace where any visitor can act as a member — creating
  tasks and changing status — and "anyone can view" simply means viewing
  needs no additional permission beyond that.
- Assignee is a simple name identifier, not a full user account.
- Editing a task's title, assignee, or due date after creation is out of
  scope for v1; only status changes are supported after a task is created.
- Deleting tasks is out of scope for v1.
- Due date is a calendar date without a time component.
- A single shared board serves the whole team; multiple boards or projects
  are out of scope for v1.
- The board reflects updates on view/refresh; real-time push updates are
  not required for v1.
