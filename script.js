//selector
const root = document.querySelector(".todos");
const list = root.querySelector(".todos-list");
const count = root.querySelector(".todos-count");
const clear = root.querySelector(".todos-clear");

const form = document.forms.todos;
const input = form.elements.todo;

//state management
// let todos;
// if (JSON.parse(localStorage.getItem("todos"))) {
//   todos =JSON.parse(localStorage.getItem("todos"));
// } else {
//   todos = [];
// }

let todos = JSON.parse(localStorage.getItem("todos")) || [];

//functions()
function saveToStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(todos) {
  let todosString = ``;

  //construct
  todos.forEach((todo, index) => {
    todosString += `

       <li id="${index}">
           <input type="checkbox" ${todo.complete ? "checked" : ""}>
           <span>${todo.label}</span>
           <button><i class="fa fa-trash"></i></button>
       </li>
     `;
  });

  list.innerHTML = todosString;
  count.innerText = todos.filter((todo) => !todo.complete).length;

  clear.style.display = todos.filter((todo) => todo.complete).length
    ? "block"
    : "none";
  saveToStorage(todos);
}

function addTodo(event) {
  event.preventDefault();

  const label = input.value.trim();
  const complete = false;

  const todo = { label, complete };
  todos = [...todos, todo];
  renderTodos(todos);
  saveToStorage(todos);
  input.value = "";
}

function updateTodo(event) {
  //console.log(event.target);
  const id = Number(event.target.parentNode.getAttribute("id"));
  //console.log(id);
  const complete = event.target.checked;

  todos = todos.map((todo, index) => {
    if (id === index) {
      const updatedTodo = { ...todo, complete: complete };
      return updatedTodo;
    }
    return todo;
  });
  console.log(todos);
  renderTodos(todos);
  saveToStorage(todos);
}

function editTodo(event) {
  console.log(event.target.nodeName);
  if (event.target.nodeName !== "SPAN") {
    return;
  }
  const id = Number(event.target.parentNode.getAttribute("id"));

  const todoLabel = todos[id].label;

  const input = document.createElement("input");
  input.type = "text";
  input.value = todoLabel;

  event.target.style.display = "none";
  event.target.parentNode.append(input);

  function handleEdit(event) {
    event.stopPropagation();
    const label = this.value;
    if (label !== todoLabel) {
      todos = todos.map((todo, index) => {
        if (index === id) {
          return {
            ...todo,
            label: label,
          };
        }
        return todo;
      });
    }
    renderTodos(todos);
    saveToStorage(todos);
  }

  input.addEventListener("change", handleEdit);
}

function deleteTodo(event) {
  console.log(event.target.nodeName);

  if (confirm("Are you sure you want to delete this?")) {
    if (event.target.nodeName !== "BUTTON") {
      return;
    }
    const id = Number(event.target.parentNode.getAttribute("id"));
    todos = todos.filter((item, index) => index !== id);
  } else {
  }
  // console.log(todos);
  renderTodos(todos);
  saveToStorage(todos);
}

function clearCompleteTodo() {
  let totalClearCount = todos.filter((todo) => todo.complete).length;

  if (totalClearCount === 0) {
    alert("Please complete atleast one task");
  }

  todos = todos.filter((todo) => !todo.complete);
  renderTodos(todos);
  saveToStorage(todos);
}

//init
function initi() {
  saveToStorage(todos);
  renderTodos(todos);
  form.addEventListener("submit", addTodo);
  list.addEventListener("change", updateTodo);
  list.addEventListener("dblclick", editTodo);
  list.addEventListener("click", deleteTodo);
  clear.addEventListener("click", clearCompleteTodo);
}
initi();
