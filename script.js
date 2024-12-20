// DOM Elements
const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoPriority = document.getElementById('todo-priority');
const tasksContainer = document.getElementById('tasks-container');
const progressBar = document.getElementById('progress-bar');
const themeToggle = document.getElementById('theme-toggle');
const sortBtn = document.getElementById('sort-btn');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromLocalStorage();
  updateProgress();
});

// Add task
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = todoInput.value.trim();
  const dueDate = todoDate.value;
  const priority = todoPriority.value;

  if (taskName && dueDate) {
    addTask(taskName, dueDate, priority);
    saveTasksToLocalStorage();
    updateProgress();
    todoInput.value = '';
    todoDate.value = '';
  }
});

// Add task to DOM
function addTask(name, date, priority) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.innerHTML = `
    <span>${name}</span>
    <span>${date}</span>
    <span class="task-priority ${priority}">${priority}</span>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;
  tasksContainer.appendChild(task);
}

// Edit and delete tasks
tasksContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.parentElement.remove();
    saveTasksToLocalStorage();
    updateProgress();
  }

  if (e.target.classList.contains('edit-btn')) {
    const task = e.target.parentElement;
    todoInput.value = task.children[0].textContent;
    todoDate.value = task.children[1].textContent;
    todoPriority.value = task.children[2].textContent.toLowerCase();
    task.remove();
    saveTasksToLocalStorage();
    updateProgress();
  }
});

// Save tasks to localStorage
function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll('.task')).map((task) => ({
    name: task.children[0].textContent,
    date: task.children[1].textContent,
    priority: task.children[2].textContent,
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(({ name, date, priority }) => addTask(name, date, priority));
}

// Sort tasks
sortBtn.addEventListener('click', () => {
  const tasks = Array.from(document.querySelectorAll('.task')).sort((a, b) => {
    return new Date(a.children[1].textContent) - new Date(b.children[1].textContent);
  });
  tasksContainer.innerHTML = '';
  tasks.forEach((task) => tasksContainer.appendChild(task));
  saveTasksToLocalStorage();
});

// Update progress bar
function updateProgress() {
  const totalTasks = document.querySelectorAll('.task').length;
  const completedTasks = 0; // Placeholder for completed tasks feature
  progressBar.style.setProperty('--progress', `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%`);
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
