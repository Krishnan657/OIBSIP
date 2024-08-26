let tasks = [];
let editIndex = null;

function addTask() {
    const taskText = document.getElementById('new-task').value.trim();
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;
    const category = document.getElementById('task-category').value;
    
    if (taskText === '') {
        alert('Task cannot be empty');
        return;
    }

    const task = {
        text: taskText,
        priority: priority,
        deadline: deadline,
        category: category,
        completed: false,
        createdAt: new Date(),
        updatedAt: null,
    };

    if (editIndex !== null) {
        tasks[editIndex] = task;
        editIndex = null;
    } else {
        tasks.push(task);
    }

    updateTaskLists();
    clearInputs();
}

function updateTaskLists() {
    const pendingTasksUl = document.getElementById('pending-tasks');
    const completedTasksUl = document.getElementById('completed-tasks');
    pendingTasksUl.innerHTML = '';
    completedTasksUl.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.text} (Priority: ${task.priority}, Deadline: ${task.deadline}, Category: ${task.category})`;
        li.classList.add(task.completed ? 'completed' : 'pending');
        li.innerHTML += `
            <div class="task-buttons">
                <button class="complete" onclick="toggleComplete(${index})">Complete</button>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        if (task.completed) {
            completedTasksUl.appendChild(li);
        } else {
            pendingTasksUl.appendChild(li);
        }
    });
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    tasks[index].updatedAt = new Date();
    updateTaskLists();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById('edit-task-text').value = task.text;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-deadline').value = task.deadline;
    document.getElementById('edit-task-category').value = task.category;
    editIndex = index;
    document.getElementById('edit-task-modal').style.display = 'block';
}

function saveTaskEdit() {
    addTask();
    closeEditModal();
}

function closeEditModal() {
    document.getElementById('edit-task-modal').style.display = 'none';
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskLists();
}

function clearInputs() {
    document.getElementById('new-task').value = '';
    document.getElementById('task-priority').value = 'Low';
    document.getElementById('task-deadline').value = '';
    document.getElementById('task-category').value = '';
}

function searchTasks() {
    const searchTerm = document.getElementById('search-task').value.toLowerCase();
    const filterPriority = document.getElementById('filter-priority').value;
    
    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchTerm) &&
        (filterPriority === '' || task.priority === filterPriority)
    );

    const pendingTasksUl = document.getElementById('pending-tasks');
    const completedTasksUl = document.getElementById('completed-tasks');
    pendingTasksUl.innerHTML = '';
    completedTasksUl.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.text} (Priority: ${task.priority}, Deadline: ${task.deadline}, Category: ${task.category})`;
        li.classList.add(task.completed ? 'completed' : 'pending');
        li.innerHTML += `
            <div class="task-buttons">
                <button class="complete" onclick="toggleComplete(${index})">Complete</button>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        if (task.completed) {
            completedTasksUl.appendChild(li);
        } else {
            pendingTasksUl.appendChild(li);
        }
    });
}

function filterByPriority() {
    searchTasks();
}

function clearAllTasks() {
    tasks = [];
    updateTaskLists();
}
