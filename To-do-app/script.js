const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

let todos = [];
let currentFilter = "all";

/* EVENTS */
addTaskBtn.addEventListener("click", () => {
    const desc = document.getElementById("task-desc").value;
    addTodo(taskInput.value, desc);
});

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const desc = document.getElementById("task-desc").value;
        addTodo(taskInput.value, desc);
    }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

/* ADD TODO */
function addTodo(title, description) {
    if (title.trim() === "") return;

    const todo = {
        id: Date.now(),
        title,
        description,
        completed: false,
    };

    todos.push(todo);
    saveTodos();
    renderTodos();

    taskInput.value = "";
    document.getElementById("task-desc").value = "";
}

/* SAVE */
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateItemsCount();
    checkEmptyState();
}

/* COUNT */
function updateItemsCount() {
    const uncompleted = todos.filter(t => !t.completed);
    itemsLeft.textContent = `${uncompleted.length} item${uncompleted.length !== 1 ? "s" : ""} left`;
}

/* EMPTY STATE */
function checkEmptyState() {
    const filtered = filterTodos(currentFilter);
    emptyState.classList.toggle("hidden", filtered.length !== 0);
}

/* FILTER */
function filterTodos(filter) {
    if (filter === "active") return todos.filter(t => !t.completed);
    if (filter === "completed") return todos.filter(t => t.completed);
    return todos;
}

/* RENDER */
function renderTodos() {
    todosList.innerHTML = "";

    const filtered = filterTodos(currentFilter);

    filtered.forEach(todo => {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        if (todo.completed) li.classList.add("completed");

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        const content = document.createElement("div");
        content.classList.add("todo-item-content");

        const title = document.createElement("span");
        title.classList.add("todo-item-text");
        title.textContent = todo.title;

        content.appendChild(title);

        if (todo.description && todo.description.trim() !== "") {
            const desc = document.createElement("span");
            desc.classList.add("todo-item-desc");
            desc.textContent = todo.description;
            content.appendChild(desc);
        }

        const del = document.createElement("button");
        del.classList.add("delete-btn");
        del.innerHTML = '<i class="fas fa-times"></i>';
        del.addEventListener("click", () => deleteTodo(todo.id));

        li.appendChild(checkboxContainer);
        li.appendChild(content);
        li.appendChild(del);

        todosList.appendChild(li);
    });
}

/* TOGGLE */
function toggleTodo(id) {
    todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );

    saveTodos();
    renderTodos();
}

/* DELETE */
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

/* CLEAR COMPLETED */
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

/* LOAD */
function loadTodos() {
    const stored = localStorage.getItem("todos");
    if (stored) todos = JSON.parse(stored);
    renderTodos();
}

/* FILTER UI */
filters.forEach(f => {
    f.addEventListener("click", () => {
        currentFilter = f.dataset.filter;

        filters.forEach(x => x.classList.remove("active"));
        f.classList.add("active");

        renderTodos();
    });
});

/* DATE */
function setDate() {
    const options = { weekday: "long", month: "short", day: "numeric" };
    dateElement.textContent = new Date().toLocaleDateString("en-US", options);
}

/* INIT */
window.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    updateItemsCount();
    setDate();
});