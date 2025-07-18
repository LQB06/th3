const api = 'http://localhost:3000/api/todos';

async function fetchTodos() {
  try {
    const res = await fetch(api);
    const todos = await res.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.onchange = () => toggleComplete(todo.id, checkbox.checked);

      const span = document.createElement('span');
      span.textContent = todo.task;
      if (todo.completed) span.classList.add('done');

      const edit = document.createElement('button');
      edit.textContent = '✏️';
      edit.onclick = () => showEditInput(todo);

      const del = document.createElement('button');
      del.textContent = '🗑️';
      del.onclick = (e) => {
        e.stopPropagation();
        deleteTask(todo.id);
      };

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(edit);
      li.appendChild(del);
      list.appendChild(li);
    });
  } catch (err) {
    alert('Failed to fetch todos');
  }
}

async function addTask() {
  const task = document.getElementById('taskInput').value;
  if (!task.trim()) return alert("Task is empty!");
  await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  document.getElementById('taskInput').value = '';
  fetchTodos();
}

async function toggleComplete(id, completed) {
  await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  fetchTodos();
}

async function deleteTask(id) {
  await fetch(`${api}/${id}`, {
    method: 'DELETE'
  });
  fetchTodos();
}

function showEditInput(todo) {
  const newTask = prompt("Edit task:", todo.task);
  if (newTask && newTask.trim() !== '') {
    updateTaskContent(todo.id, newTask.trim());
  }
}

async function updateTaskContent(id, task) {
  await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  fetchTodos();
}

fetchTodos();
