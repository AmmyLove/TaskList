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
  taskList.addEventListener('click', removeTasks);
  // Clear task event
  clearBtn.addEventListener('click', clearTasks);
  // Filter task  events
  filter.addEventListener('keyup', filterTasks);
}

// Get Tasks from API
function getTasks() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
      userId = prompt('Please enter your user ID (a number between 1 and 10):');
      if (userId >= 1 && userId <= 10) {
          localStorage.setItem('userId', userId);
      } else {
          alert('User ID must be a number between 1 and 10.');
          return;
      }
  }

  fetchData(userId, displayTasks);
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
function addTask(e) {
  e.preventDefault();
  const taskTitle = taskInput.value.trim();

  if (taskTitle) {
      createNewTask(localStorage.getItem('userId'), taskTitle);
  } else {
      alert('Task title cannot be empty.');
  }

  taskInput.value = '';
}


// Store Task
function storeTaskInLocalStorage(task) {
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  } 

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove a task
function removeTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
  }
}

// Clear Tasks
 function clearTasks() {
  //taskList.innerHTML = '';

  // Faster
  while(taskList.firstChild){
    taskList.removeChild(taskList.firstChild);
  }
      // Clear from LS
    clearTasksFromLocalStorage();
 }

 // Clear from LS
 function clearTasksFromLocalStorage() {
  localStorage.clear();
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
