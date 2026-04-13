// ==============================
// ARMAZENAMENTO
// ==============================

let tasks = [];

// ==============================
// ELEMENTOS
// ==============================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");

// mensagem de lista vazia
const emptyMessage = document.getElementById("emptyMessage");


// ==============================
// SALVAR / CARREGAR
// ==============================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("tasks");

    if (stored) {
        tasks = JSON.parse(stored);
        tasks.forEach(createTaskElement);
    }
}


// ==============================
// ESTADO VAZIO
// ==============================

function checkEmptyState() {
    // mostra ou esconde mensagem
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}


// ==============================
// CRIAR TAREFA
// ==============================

function createTaskElement(task) {
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
}


// ==============================
// ADICIONAR TAREFA
// ==============================

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Digite uma tarefa!");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.push(task);
    createTaskElement(task);

    taskInput.value = "";

    saveTasks();
    updateTaskCount();
    checkEmptyState(); // atualiza estado vazio
}


// ==============================
// EVENTOS
// ==============================

// botão
addTaskBtn.addEventListener("click", addTask);

// enter
taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

// lista (check + delete)
taskList.addEventListener("click", e => {

    const taskItem = e.target.closest(".task");
    if (!taskItem) return;

    const id = Number(taskItem.getAttribute("data-id"));
    const index = tasks.findIndex(t => t.id === id);

    // marcar como concluída
    if (e.target.classList.contains("task-check")) {
        taskItem.classList.toggle("completed");
        tasks[index].completed = e.target.checked;
        saveTasks();
    }

    // deletar
    if (e.target.classList.contains("delete-btn")) {
        taskItem.remove();

        tasks.splice(index, 1);
        saveTasks();
        updateTaskCount();
        checkEmptyState(); // atualiza estado vazio
    }
});


// ==============================
// CONTADOR
// ==============================

function updateTaskCount() {
    const total = tasks.length;

    taskCount.textContent =
        total === 1 ? "1 tarefa" : `${total} tarefas`;
}


// ==============================
// LIMPAR CONCLUÍDAS
// ==============================

clearCompletedBtn.addEventListener("click", () => {

    tasks = tasks.filter(t => !t.completed);

    taskList.innerHTML = "";

    tasks.forEach(createTaskElement);

    saveTasks();
    updateTaskCount();
    checkEmptyState(); // atualiza estado vazio
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
// FILTROS
// ==============================

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        document.querySelectorAll(".task").forEach(task => {

            const done = task.classList.contains("completed");

            task.style.display =
                filter === "all" ? "flex" :
                filter === "completed" && done ? "flex" :
                filter === "pending" && !done ? "flex" : "none";
        });
    });
});


// ==============================
// INICIALIZAÇÃO
// ==============================

loadTasks();
loadTheme();
updateTaskCount();
checkEmptyState(); // verifica ao iniciar