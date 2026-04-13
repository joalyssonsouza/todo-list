let tasks = [];
let currentFilter = "all";

// ELEMENTOS
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");
const emptyMessage = document.getElementById("emptyMessage");

// ==============================
// STORAGE
// ==============================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
        tasks = JSON.parse(stored);
        tasks.forEach(task => createTaskElement(task));
    }
}

// ==============================
// UI
// ==============================

function checkEmptyState() {
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

function updateTaskCount() {
    const total = tasks.length;
    taskCount.textContent = total === 1 ? "1 tarefa" : `${total} tarefas`;
}

// ==============================
// FILTRO
// ==============================

function applyFilter(filter) {
    const allTasks = taskList.querySelectorAll(".task");

    allTasks.forEach(task => {
        const done = task.classList.contains("completed");

        task.style.display =
            filter === "all" ? "flex" :
            filter === "completed" && done ? "flex" :
            filter === "pending" && !done ? "flex" : "none";
    });
}

// ==============================
// CRIAR TAREFA
// ==============================

function createTaskElement(task, isNew = false) {
    const li = document.createElement("li");
    li.classList.add("task");
    li.setAttribute("data-id", task.id);

    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <button class="delete-btn">🗑️</button>
    `;

    taskList.appendChild(li);
    applyFilter(currentFilter);

    if (isNew) {
        li.style.background = "#dbeafe";
        setTimeout(() => li.style.background = "", 300);
    }
}

// ==============================
// ADICIONAR
// ==============================

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert("Digite uma tarefa!");

    const task = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.push(task);
    createTaskElement(task, true);

    taskInput.value = "";

    saveTasks();
    updateTaskCount();
    checkEmptyState();
}

// ==============================
// EVENTOS
// ==============================

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", e => {
    const taskItem = e.target.closest(".task");
    if (!taskItem) return;

    const id = Number(taskItem.dataset.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) return;

    if (e.target.classList.contains("task-check")) {
        taskItem.classList.toggle("completed");
        tasks[index].completed = e.target.checked;
        saveTasks();
        applyFilter(currentFilter);
    }

    if (e.target.classList.contains("delete-btn")) {
        taskItem.classList.add("removing");

        setTimeout(() => {
            taskItem.remove();
            tasks.splice(index, 1);
            saveTasks();
            updateTaskCount();
            checkEmptyState();
        }, 300);
    }
});

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    taskList.innerHTML = "";
    tasks.forEach(createTaskElement);
    saveTasks();
    updateTaskCount();
    checkEmptyState();
});

// ==============================
// DARK MODE
// ==============================

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");

    themeToggle.textContent = dark ? "☀️" : "🌙";
});

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    }
}

// ==============================
// FILTRO BOTÕES
// ==============================

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        currentFilter = filter;

        localStorage.setItem("filter", filter);
        applyFilter(filter);
    });
});

// ==============================
// INIT
// ==============================

loadTasks();
loadTheme();

const savedFilter = localStorage.getItem("filter") || "all";
currentFilter = savedFilter;

filterButtons.forEach(btn => {
    if (btn.dataset.filter === savedFilter) {
        btn.classList.add("active");
    }
});

applyFilter(savedFilter);

updateTaskCount();
checkEmptyState();