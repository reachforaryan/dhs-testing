const createForm = document.getElementById('create-form');
const titleInput = document.getElementById('title-input');
const assigneeInput = document.getElementById('assignee-input');
const dueDateInput = document.getElementById('due-date-input');

const assigneeFilter = document.getElementById('assignee-filter');
const dueDateFilter = document.getElementById('due-date-filter');
const statusFilter = document.getElementById('status-filter');
const clearFiltersButton = document.getElementById('clear-filters');

const taskList = document.getElementById('task-list');

const STATUSES = ['To-Do', 'In Progress', 'Done'];

async function loadTasks() {
  const params = new URLSearchParams();
  if (assigneeFilter.value) params.set('assignee', assigneeFilter.value);
  if (dueDateFilter.value) params.set('dueDate', dueDateFilter.value);
  if (statusFilter.value) params.set('status', statusFilter.value);

  const response = await fetch(`/api/tasks?${params.toString()}`);
  const tasks = await response.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.id = 'empty-state';
    empty.textContent = 'No tasks to show.';
    taskList.appendChild(empty);
    return;
  }

  for (const task of tasks) {
    const item = document.createElement('li');
    item.className = 'task';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title;

    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = [task.assignee, task.dueDate].filter(Boolean).join(' · ');

    const statusSelect = document.createElement('select');
    for (const status of STATUSES) {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      if (status === task.status) option.selected = true;
      statusSelect.appendChild(option);
    }
    statusSelect.addEventListener('change', () => updateStatus(task.id, statusSelect.value));

    item.append(title, meta, statusSelect);
    taskList.appendChild(item);
  }
}

async function updateStatus(id, status) {
  await fetch(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  loadTasks();
}

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: titleInput.value,
      assignee: assigneeInput.value || null,
      dueDate: dueDateInput.value || null,
    }),
  });
  createForm.reset();
  loadTasks();
});

assigneeFilter.addEventListener('input', loadTasks);
dueDateFilter.addEventListener('change', loadTasks);
statusFilter.addEventListener('change', loadTasks);
clearFiltersButton.addEventListener('click', () => {
  assigneeFilter.value = '';
  dueDateFilter.value = '';
  statusFilter.value = '';
  loadTasks();
});

document.addEventListener('DOMContentLoaded', loadTasks);
