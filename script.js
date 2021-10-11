// target all necessary elements
// listen on input(keyup) and btn element(onclick) 
// display list of tasks

// Access elements from html/DOM
const input = document.querySelector('.task-input');
const addButton = document.querySelector('.add-button');
const pendingTodoList = document.querySelector('.task-list-pending');
const completedTodoList = document.querySelector('.task-list-completed');
const pendingTasks = document.querySelector('.pending-tasks');
const completedTasks = document.querySelector('.completed-tasks');
const deleteIcon = document.querySelectorAll('.delete-icon');
const clearPendingTaskBtn = document.querySelector('.clear-pending');
const clearCompletedTaskBtn = document.querySelector('.clear-completed');
const clearAllTaskBtn = document.querySelector('.clear-all');

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodo);
input.addEventListener('keyup', inputHandler);
input.addEventListener('blur', () => input.classList.remove('.active'))
addButton.addEventListener('click', addTodo);
pendingTodoList.addEventListener('click', deleteCheck);
completedTodoList.addEventListener('click', deleteCheck);
clearPendingTaskBtn.addEventListener('click', clearPendingTasks);
clearCompletedTaskBtn.addEventListener('click', clearCompletedTasks)
clearAllTaskBtn.addEventListener('click', clearAllTasks)

// Functions
function inputHandler(e) {
    let newTodo = input.value;

    if (newTodo.trim() != 0) {
        addButton.classList.add('active')
    } else {
        addButton.classList.remove('active')
    }

    // check if enter key was pressed
    if (e.key === 'Enter') {
        addButton.click()
    }
}

function pendingTodoItem(task) {
    // create li tag
    let li = document.createElement('li');
    li.classList.add('px-3', 'px-md-5', 'py-3', 'mb-4', 'd-flex', 'justify-content-between', 'align-items-center');

    // create div in li tag
    let div = document.createElement('div');
    div.classList.add('d-flex', 'align-items-center');

    // create check button in div tag
    let checkButton = document.createElement('i');
    checkButton.classList.add('bi', 'bi-square');
    div.appendChild(checkButton);

    // todo task
    let span = document.createElement('span');
    span.classList.add('ms-4')
    span.innerText = task;
    div.appendChild(span);

    // delete button
    let deleteButton = document.createElement('i');
    deleteButton.classList.add('bi', 'bi-trash-fill');

    //append div and deleteButton to li tag
    li.appendChild(div);
    li.appendChild(deleteButton);
    
    // append li to todo-list
    pendingTodoList.prepend(li);
}

function completedTodoItem(task) {
    // create li tag
    let li = document.createElement('li');
    li.classList.add('px-3', 'px-md-5', 'py-3', 'mb-4', 'd-flex', 'justify-content-between', 'align-items-center');

    // create div in li tag
    let div = document.createElement('div');
    div.classList.add('d-flex', 'align-items-center');

    // create check button in div tag
    let checkButton = document.createElement('i');
    checkButton.classList.add('bi', 'bi-check2-square');
    div.appendChild(checkButton);

    // todo task
    let span = document.createElement('span');
    span.classList.add('ms-4', 'completed')
    span.innerText = task;
    div.appendChild(span);

    // delete button
    let deleteButton = document.createElement('i');
    deleteButton.classList.add('bi', 'bi-trash-fill');

    //append div and deleteButton to li tag
    li.appendChild(div);
    li.appendChild(deleteButton);
    
    // append li to todo-list
    completedTodoList.prepend(li);
}

function addTodo(e) {
    // prevent form submission
    e.preventDefault();

    // save todo to local storage
    savePendingTodo(input.value)

    // create the todo list item
    pendingTodoItem(input.value)

    // change input value back to empty string
    input.value = '';
    addButton.classList.remove('active')
    addButton.blur()
}

function deleteCheck(e) {
    const item = e.target;
    let task = item.nextSibling;

    // delete TODO
    if (item.classList[1] === 'bi-trash-fill') {
        const todo = item.parentElement;
        todo.remove()
        let todoText = item.previousSibling.children[1].innerText;
        deleteTodo(todoText)
    }
    
    // check todo as completed
    if (item.classList[1] === 'bi-square') {
        moveToCompletedTodo(task.innerText)
      
    } else if (item.classList[1] === 'bi-check2-square') {
        moveToPendingTodo(task.innerText)
    }
}

// function to save todo to local storage
function savePendingTodo(todo) {
    let pendingTodo = JSON.parse(localStorage.getItem('pendingTodos'));
    let todos;
    // check if localstorage has todos
    if(pendingTodo === null) {
        todos = [];
    } else {
        todos = pendingTodo;
    }
    todos.push(todo);
   
    pendingTasks.innerText = todos.length;
    localStorage.setItem('pendingTodos', JSON.stringify(todos))
}

// function to move pending todo to completed todo in local storage
function moveToCompletedTodo(todo) {
    let completedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    let pendingTodos = JSON.parse(localStorage.getItem('pendingTodos'));
    let completedTodos;

    // check if localstorage has todos
    if(completedTodo === null) {
        completedTodos = [];
    } else {
        completedTodos = completedTodo;
    }
    completedTodos.push(todo);
    completedTasks.innerText = completedTodos.length;
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos))
    completedTodoItem(todo)

    let completedTask = pendingTodos.indexOf(todo);
    pendingTodos.splice(completedTask, 1)
    pendingTasks.innerText = pendingTodos.length;
    localStorage.setItem('pendingTodos', JSON.stringify(pendingTodos))
    showPendingTasks(pendingTodos)
}

// function to move completed todo to back to pending todo in local storage
function moveToPendingTodo(todo) {
    let pendingTodos = JSON.parse(localStorage.getItem('pendingTodos'));
    let completedTodos = JSON.parse(localStorage.getItem('completedTodos'));
    
    pendingTodos.push(todo);
    localStorage.setItem('pendingTodos', JSON.stringify(pendingTodos))
    pendingTodoItem(todo)
    pendingTasks.innerText = pendingTodos.length;

    let uncompletedTask = completedTodos.indexOf(todo);
    completedTodos.splice(uncompletedTask, 1)
    completedTasks.innerText = completedTodos.length;
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos))
    showCompletedTasks(completedTodos)
}

// get Todo on reload of page
function getTodo() {
    let pendingTodos = JSON.parse(localStorage.getItem('pendingTodos'));
    let completedTodos = JSON.parse(localStorage.getItem('completedTodos'));

    if (pendingTodos) {
        showPendingTasks(pendingTodos)
    } else {
        pendingTasks.innerText = 0
    }

    if (completedTodos) {
        showCompletedTasks(completedTodos)
    } else {
        completedTasks.innerText = 0
    }
}

// remove item from localstorage on delete
function deleteTodo(todo) {
    let pendingTodos = JSON.parse(localStorage.getItem('pendingTodos'));
    let completedTodos = JSON.parse(localStorage.getItem('completedTodos'));
    
    if (pendingTodos.includes(todo)) {
        pendingTodos.splice(todo, 1);
        localStorage.setItem('pendingTodos', JSON.stringify(pendingTodos));
        showPendingTasks(pendingTodos)
    } else {
        completedTodos.splice(todo, 1);
        localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
        showCompletedTasks(completedTodos)
    }
}

// display pending todos
function showPendingTasks(pendingTodos) {
    pendingTodoList.innerHTML = ''
    pendingTodos.forEach((todo) => {
        pendingTodoItem(todo)
    })
    pendingTasks.innerText = pendingTodos.length;
}

// display completed todos
function showCompletedTasks(completedTodos) {
    completedTodoList.innerHTML = ''
    completedTodos.forEach((todo) => {
        completedTodoItem(todo)
    })
    completedTasks.innerText = completedTodos.length;
}

// clear pending tasks
function clearPendingTasks() {
    pendingTodoList.innerHTML = '';
    localStorage.setItem('pendingTodos', JSON.stringify([]));
    pendingTasks.innerText = 0;
}

// clear completed tasks
function clearCompletedTasks() {
    completedTodoList.innerHTML = '';
    localStorage.setItem('completedTodos', JSON.stringify([]));
    completedTasks.innerText = 0;
}

// clear all tasks 
function clearAllTasks() {
    clearPendingTasks();
    clearCompletedTasks();
}