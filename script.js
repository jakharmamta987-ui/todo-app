// global array
let tasks = [];

// dom elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

addBtn.disabled = true;
input.addEventListener("input", () => {
    if(input.value.trim() === "") {
        addBtn.disabled = true;
    } else {
        addBtn.disabled = false;
    }
});

const savedData = localStorage.getItem("tasks");
    if(savedData){

        tasks = JSON.parse(savedData);

    }

    function saveTasks() {
        localStorage.setItem("tasks",JSON.stringify(tasks));

    }



// add  task from localstorage

function addTask() {
    const taskText = input.value.trim();
    
    if(taskText === "") return;

    tasks.push({

       id: Date.now(),
       text:taskText,
       completed:false
    });

    input.value = "";
    saveTasks();
    renderTasks();

        
}

// Render tasks 

function renderTasks(taskArray = tasks) {
    list.innerHTML = "";

    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.filter(task => !task.completed).length;
    document.getElementById("taskcounter").innerText = `Total: ${totalCount} | completed: ${completedCount} | pending: ${pendingCount} `;


    //empty 
    if (taskArray.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.innerText = "No tasks found";
        list.appendChild(empty);
        return; // stop further rendering
  }


    taskArray.forEach((task, index) => {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;



        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();

        });

        const span = document.createElement("span");
        span.textContent = task.text;


        if (task.completed) {
             span.style.textDecoration = "line-through";
        }

        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("delete");

        delBtn.onclick = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        };

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("edit");

        editBtn.onclick = () => {
            const newTask = prompt("edit your task:",task.text);
            if(newTask !==null && newTask.trim() !== ""){
                tasks = tasks.map(t => {
                    if(t.id === task.id){
                        return{ ...t, text: newTask };
                    }
                    return t;
                });
                saveTasks();
                renderTasks();
            }
        };


        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        li.appendChild(editBtn);
        list.appendChild(li);

        
    });


}

function filterTasks(type) {
    let filteredTasks;


    if(type === "completed"){
        filteredTasks = tasks.filter(task => task.completed);
    }

    else if(type === "pending"){
        filteredTasks = tasks.filter(task => !task.completed);
    }
    else{
        filteredTasks = tasks;
    }

    renderTasks(filteredTasks);


}

function searchTasks() {
    const searchText = searchInput.value.toLowerCase();

    if (searchText === "") {
        renderTasks(tasks);
        return;
    }

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    renderTasks(filteredTasks);
}

searchInput.addEventListener("input",searchTasks);

// Button click
addBtn.addEventListener("click",addTask);

// enter key support
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// update UI
renderTasks();
