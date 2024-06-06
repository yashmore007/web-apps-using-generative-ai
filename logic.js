const taskList = document.querySelector('.task-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');

// Array to store task data
let tasks = [];

// Function to render task cards
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <div class="task-details">
                <div class="checkbox" onclick="toggleTask(${index})"></div>
                <div class="task-title">${task.title}</div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${index})">&#9998;</button>
                <button class="delete-btn" onclick="deleteTask(${index})">&times;</button>
            </div>
        `;
        taskList.appendChild(taskCard);
    });

    // Initialize SortableJS on the task list with animation
    new Sortable(taskList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            if (oldIndex !== newIndex) {
                const movedTask = tasks.splice(oldIndex, 1)[0];
                tasks.splice(newIndex, 0, movedTask);
                saveTasksToLocalStorage();
                renderTasks();
            }
        }
    });
}

// Function to add a new task
function addTask() {
    const taskTitle = newTaskInput.value.trim();
    if (taskTitle) {
        const newTask = { title: taskTitle };
        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks();
        newTaskInput.value = '';
    }
}

// Function to toggle a task's completion status
function toggleTask(index) {
    const taskCard = taskList.children[index];
    const checkbox = taskCard.querySelector('.checkbox');
    checkbox.classList.add('checked');

    // Destruction animation
    anime({
        targets: taskCard,
        opacity: 0,
        translateX: -50,
        easing: 'easeInOutQuad',
        duration: 500,
        complete: function () {
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
            renderTasks();
        }
    });
}

// Function to edit a task
function editTask(index) {
    const taskCard = taskList.children[index];
    const taskDetails = taskCard.querySelector('.task-details');
    const taskTitle = taskDetails.querySelector('.task-title').textContent;
    taskCard.classList.add('editing');
    taskDetails.innerHTML = `
        <input type="text" class="edit-input" value="${taskTitle}">
        <button class="save-btn" onclick="saveTask(${index})">Save</button>
    `;
}

// Function to save an edited task
function saveTask(index) {
    const taskCard = taskList.children[index];
    const editInput = taskCard.querySelector('.edit-input');
    const newTitle = editInput.value.trim();
    if (newTitle) {
        tasks[index].title = newTitle;
        saveTasksToLocalStorage();
        renderTasks();
    }
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasksToLocalStorage();
    renderTasks();
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
    const tasksFromStorage = JSON.parse(localStorage.getItem('tasks'));
    if (tasksFromStorage) {
        tasks = tasksFromStorage;
    }
}

// Event listener for the "Send" button
addTaskBtn.addEventListener('click', addTask);

// Event listener for the "Enter" key press on the input field
newTaskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Retrieve tasks from local storage on page load
getTasksFromLocalStorage();
renderTasks();