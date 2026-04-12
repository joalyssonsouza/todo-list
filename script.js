// ==============================
// ARMAZENAMENTO DE TAREFAS
// ==============================

let tasks = [];

// salva no navegador
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// carrega ao iniciar
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);

        tasks.forEach(task => createTaskElement(task));
    }
}


// ==============================
// SELEÇÃO DE ELEMENTOS
// ==============================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");


// ==============================
// FILTRO DE TAREFAS
// ==============================

function filterTasks(filter) {
    const allTasks = document.querySelectorAll(".task");

    allTasks.forEach(task => {
        const isCompleted = task.classList.contains("completed");

        if (filter === "all") {
            task.style.display = "flex";
        } 
        else if (filter === "completed") {
            task.style.display = isCompleted ? "flex" : "none";
        } 
        else if (filter === "pending") {
            task.style.display = !isCompleted ? "flex" : "none";
        }
    });
}


// ==============================
// CRIAR ELEMENTO DA TAREFA
// ==============================

function createTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add("task");

    // ID único no elemento HTML
    li.setAttribute("data-id", task.id);

    if (task.completed) {
        li.classList.add("completed");
    }

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
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Digite uma tarefa!");
        return;
    }

    const task = {
        id: Date.now(), // ID único
        text: taskText,
        completed: false
    };

    tasks.push(task);

    createTaskElement(task);

    taskInput.value = "";

    saveTasks();
    updateTaskCount();
}


// ==============================
// EVENTOS
// ==============================

// botão
addTaskBtn.addEventListener("click", addTask);

// enter
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});


// ==============================
// EVENTO DOS FILTROS
// ==============================

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        // remove ativo de todos
        filterButtons.forEach(btn => btn.classList.remove("active"));

        // adiciona ativo no clicado
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        filterTasks(filter);
    });
});


// ==============================
// EVENTOS NA LISTA
// ==============================

taskList.addEventListener("click", function (e) {

    const taskItem = e.target.parentElement;

    // pega ID da tarefa
    const taskId = Number(taskItem.getAttribute("data-id"));

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    // concluir
    if (e.target.classList.contains("task-check")) {
        taskItem.classList.toggle("completed");

        tasks[taskIndex].completed = e.target.checked;
        saveTasks();
    }

    // deletar
    if (e.target.classList.contains("delete-btn")) {
        taskItem.remove();

        tasks.splice(taskIndex, 1);
        saveTasks();
        updateTaskCount();
    }
});

    // ==============================
// DARK MODE
// ==============================

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // muda ícone
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});


// ==============================
// CONTADOR
// ==============================

function updateTaskCount() {
    taskCount.textContent = `${tasks.length} tarefas`;
}


// ==============================
// LIMPAR CONCLUÍDAS
// ==============================

clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(task => !task.completed);

    taskList.innerHTML = "";

    tasks.forEach(task => createTaskElement(task));

    saveTasks();
    updateTaskCount();
});


// ==============================
// INICIALIZAÇÃO
// ==============================

loadTasks();
updateTaskCount();