const apiURL = 'http://localhost:3000/api/todo';

async function fetchTasks() {
  const search = document.getElementById('searchInput').value;
  const category = document.getElementById('filterCategory').value;
  const priority = document.getElementById('filterPriority').value;

  try {
    const res = await fetch(`${apiURL}?search=${search}&category=${category}&priority=${priority}&sort=date`);
    const todos = await res.json();
console.log('Fetched Todos:', todos);
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    if (!Array.isArray(todos)) return;

    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      if (todo.status === 'Done') li.classList.add('done');

      li.innerHTML = `
        <span>${index + 1}. ${todo.task} [${todo.category}] (${todo.priority}) - Due: ${todo.due_date || 'N/A'}</span>
        <div>
          <button onclick="toggleStatus(${todo.id})">${todo.status}</button>
          <button onclick="deleteTask(${todo.id})">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}

async function addTask() {
  const task = document.getElementById('taskInput').value;
  const category = document.getElementById('categoryInput').value;
  const priority = document.getElementById('priorityInput').value;
  const due_date = document.getElementById('dueDateInput').value;

  if (!task) return;

  await fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, category, priority, due_date, status: '0' })
  });

  showToast('Task added successfully!');
  document.getElementById('taskInput').value = '';
  fetchTasks();
}

async function toggleStatus(id) {
  await fetch(`${apiURL}/${id}/toggle`, { method: 'PUT' });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
  showToast('Task deleted!');
  fetchTasks();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

fetchTasks();
