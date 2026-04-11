/*Seleção de elementos */
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn"); 
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");

/* Função: adicionar tarefas */

function addTask() {
    const taskText = taskInput.value.trim();

    /* Evita adicionar tarefa vazia  */
    if (taskText === "") {
        alert("Digite uma tarefa!");
        return;
    }

    /* Criando elemento da tarefa (li) */
    const li = document.createElement("li")
    li.classList.add("task");

    /* Estrutura interna da tarefa */
    li.innerHTML=`
    <input type="checkbox" class="task-check">
    <span>${taskText}</span>
    <button class="delete-btn">🗑️</button>
    `;

    /* Adiciona na lista */
    taskList.appendChild(li);

    /* Limpar o campo input */
    taskInput.value = "";

    /* Atualiza contador */
    updateTaskCount();
}

    /* Eventos de adição de tarefa */
    /* Clique no botão */
    addTaskBtn.addEventListener("click", addTask);

    /* Pressionar enter no input */
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    } );

   /* EVENTOS NA LISTA (DELEÇÃO E CHECK) */ 
   taskList.addEventListener("click", function (e) {

    // Marcar como concluída
    if (e.target.classList.contains("task-check")) {
        const taskItem = e.target.parentElement;
        taskItem.classList.toggle("completed");
    }

    // Deletar tarefa
    if (e.target.classList.contains("delete-btn")) {
        const taskItem = e.target.parentElement;
        taskItem.remove();

        updateTaskCount();
    }

});

    /* CONTADOR DE TAREFAS */
    function updateTaskCount() {
    const total = taskList.children.length;
    taskCount.textContent = `${total} tarefas`;
}

    /* LIMPAR TAREFAS CONCLUÍDAS */
    clearCompletedBtn.addEventListener("click", function () {

    const completedTasks = document.querySelectorAll(".task.completed");

    completedTasks.forEach(task => task.remove());

    updateTaskCount();
});