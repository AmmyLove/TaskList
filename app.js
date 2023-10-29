// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  // DOM Load Event
  document.addEventListener('DOMContentLoaded', getTasks);
  // Add task event
  form.addEventListener('submit', addTask);
  // Remove task event
  taskList.addEventListener('click', removeTask);
  // Clear task event undefined
  // clearBtn.addEventListener('click', clearTasks);
  // Filter task events
  filter.addEventListener('keyup', filterTasks);
}

// Get Tasks from API
async function getTasks() {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    userId = prompt('Please enter your user ID (a number between 1 and 10):');
    if (userId >= 1 && userId <= 10) {
      localStorage.setItem('userId', userId);
    } else {
      alert('User ID must be a number between 1 and 10.');
      return;
    }
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    displayTasks(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert(error.description);
  }
}

// Display Tasks on the page
function displayTasks(tasks) {
  taskList.innerHTML = '';

  tasks.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.appendChild(document.createTextNode(task.title));

    const deleteLink = document.createElement('a');
    deleteLink.className = 'delete-item secondary-content';
    deleteLink.innerHTML = '<i class="fa fa-remove"></i>';
    deleteLink.addEventListener('click', () => removeTask(task.id));

    li.appendChild(deleteLink);
    taskList.appendChild(li);
  });
}

// Add a new task
async function addTask(e) {
  e.preventDefault();
  const taskTitle = taskInput.value.trim();

  if (taskTitle) {
    try {
      const response = await createNewTask(localStorage.getItem('userId'), taskTitle);
      if (response.ok) {
        const newTask = await response.json();
        displayNewTask(newTask);
      } else {
        alert('Failed to create a new task.');
      }
    } catch (error) {
      console.error('Error creating a new task:', error);
    }
  } else {
    alert('Task title cannot be empty.');
  }

  taskInput.value = '';
}

// Function to create a new task
async function createNewTask(userId, title) {
  const taskData = {
    userId: userId,
    title: title,
    completed: false
  };

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    return response;
  } catch (error) {
    console.error('Error creating a new task:', error);
    throw error;
  }
}

// Display a new task on the page
function displayNewTask(newTask) {
  const li = document.createElement('li');
  li.className = 'collection-item';
  li.appendChild(document.createTextNode(newTask.title));

  const deleteLink = document.createElement('a');
  deleteLink.className = 'delete-item secondary-content';
  deleteLink.innerHTML = '<i class="fa fa-remove"></i>';
  deleteLink.addEventListener('click', () => removeTask(newTask.id));

  li.appendChild(deleteLink);
  taskList.appendChild(li);
}

// Remove a task
function removeTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
  }
}

// Function to delete a task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Handle the successful deletion (e.g., remove the task from the UI).
      console.log('Task deleted:', taskId);
    } else {
      // Handle the case where the deletion request was not successful.
      console.error('Failed to delete the task.');
    }
  } catch (error) {
    console.error('Error deleting the task:', error);
  }
}

// Filter Tasks
function filterTasks(e) {
  const text = e.target.value.toLowerCase();
  const tasks = document.querySelectorAll('.collection-item');

  tasks.forEach(function (task) {
    const item = task.firstChild.textContent.toLowerCase();
    if (item.indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}
