// Array untuk menyimpan todos
let todos = [];
let currentFilter = 'all';

// Load todos dari localStorage saat halaman dimuat
window.onload = function() {
    loadTodos();
    renderTodos();
};

// Fungsi untuk load todos dari localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// Fungsi untuk save todos ke localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Fungsi untuk menambah todo
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');

    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (task === '') {
        alert('Please enter a task!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        task: task,
        date: date || 'No date',
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    // Clear inputs
    todoInput.value = '';
    dateInput.value = '';
    todoInput.focus();
}

// Fungsi untuk toggle complete status
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk delete todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk delete all todos
function deleteAll() {
    if (todos.length === 0) {
        alert('No tasks to delete!');
        return;
    }

    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk toggle filter section
function toggleFilter() {
    const filterSection = document.getElementById('filterSection');
    if (filterSection.style.display === 'none') {
        filterSection.style.display = 'flex';
    } else {
        filterSection.style.display = 'none';
    }
}

// Fungsi untuk filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    // Update active button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderTodos();
}

// Fungsi untuk format tanggal
function formatDate(dateString) {
    if (dateString === 'No date') return dateString;

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Fungsi untuk render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');

    // Filter todos berdasarkan currentFilter
    let filteredTodos = todos;
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(t => !t.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="no-task">No task found</div>';
        return;
    }

    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        todoItem.innerHTML = `
            <div class="task-name">${todo.task}</div>
            <div class="task-date">${formatDate(todo.date)}</div>
            <div>
                <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            <div class="action-buttons">
                <button class="action-btn btn-complete" onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="action-btn btn-delete" onclick="deleteTodo(${todo.id})">
                    Delete
                </button>
            </div>
        `;

        todoList.appendChild(todoItem);
    });
}

// Allow Enter key to add todo
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});