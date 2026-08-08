# Data Model: Team Task Tracker

## Task

The only persisted entity. Held in-memory as a JSON array on the server.

| Field     | Type                                    | Required | Notes                                              |
|-----------|------------------------------------------|----------|-----------------------------------------------------|
| id        | integer                                  | server-assigned | Sequential, assigned on creation, never reused.     |
| title     | string                                    | yes      | Must be non-empty after trimming whitespace.        |
| assignee  | string \| null                            | no       | Free-text name identifying a team member; no account lookup. |
| dueDate   | string (`YYYY-MM-DD`) \| null             | no       | Calendar date only, no time component.              |
| status    | enum: `"To-Do"` \| `"In Progress"` \| `"Done"` | yes (defaulted) | Defaults to `"To-Do"` on creation.                  |
| createdAt | string (ISO 8601 timestamp)               | server-assigned | Set once on creation.                               |

### Validation Rules

- **FR-002**: `title` must be present and non-empty after trimming → reject
  creation with a 400-level error otherwise.
- **FR-005**: `status` is always `"To-Do"` on creation; clients cannot set
  it at creation time.
- **FR-006**: `status` updates must be one of the three allowed values →
  reject with a 400-level error otherwise. Any value may transition to any
  other value (no enforced order, per spec edge case: To-Do → Done
  directly is valid).
- `assignee` and `dueDate` are optional and stored as given (no format
  validation beyond being a string, per spec Assumptions).

### State Transitions

```
To-Do <-> In Progress <-> Done
  \_______________________/
        (direct moves both ways are allowed)
```

All six directed transitions between the three statuses are permitted;
there is no required order.

### Team Member

Not a persisted entity. A team member is simply the string used as a
task's `assignee`, or the acting member's name supplied when creating a
task or changing status (per spec Assumptions: "not a full user account").
No separate storage or table is needed.
