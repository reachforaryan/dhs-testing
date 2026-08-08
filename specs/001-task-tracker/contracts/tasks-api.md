# API Contract: Tasks

Base path: `/api/tasks`. All request/response bodies are JSON. See
[data-model.md](../data-model.md) for the `Task` shape and validation rules.

## GET /api/tasks

List tasks, optionally filtered.

**Query parameters** (both optional, combinable per FR-010):

| Param    | Type   | Effect                                   |
|----------|--------|-------------------------------------------|
| assignee | string | Only tasks with this exact `assignee`.    |
| status   | string | Only tasks with this exact `status`.      |

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Write spec",
    "assignee": "Riley",
    "dueDate": "2026-08-10",
    "status": "To-Do",
    "createdAt": "2026-08-06T12:00:00.000Z"
  }
]
```

Empty array (`[]`) if no tasks match — satisfies spec's "empty state, not
an error" edge case.

---

## POST /api/tasks

Create a task. Implements User Story 1.

**Request body**:

```json
{
  "title": "Write spec",
  "assignee": "Riley",
  "dueDate": "2026-08-10"
}
```

- `title`: required, non-empty after trim.
- `assignee`: optional string.
- `dueDate`: optional string (`YYYY-MM-DD`).

**Response** `201 Created`: the created `Task`, with server-assigned `id`,
`status` set to `"To-Do"`, and `createdAt`.

**Error** `400 Bad Request` when `title` is missing or blank:

```json
{ "error": "title is required" }
```

---

## PATCH /api/tasks/:id/status

Change a task's status. Implements User Story 3.

**Request body**:

```json
{ "status": "In Progress" }
```

- `status`: required, must be one of `"To-Do"`, `"In Progress"`, `"Done"`.

**Response** `200 OK`: the updated `Task`.

**Error** `400 Bad Request` when `status` is missing or not one of the
three allowed values:

```json
{ "error": "status must be one of To-Do, In Progress, Done" }
```

**Error** `404 Not Found` when `:id` does not match an existing task:

```json
{ "error": "task not found" }
```
