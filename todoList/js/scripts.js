// Classe

class ToDo {
  Texto
  Prioridade
  Feito = false
  constructor(texto, prioridade) {
    this.Texto = texto;
    this.Prioridade = prioridade;
  }

}

// arrayTodos
let arrayTodos = [];

//funções projeto

function CriarToDo(texto, prioridade, arrayTodos) {
  let objetoTodo = new ToDo (texto, prioridade)

  let toDoInserido = arrayTodos.some(todo => todo.Texto === objetoTodo.Texto);

    if(toDoInserido === false) {
      
      arrayTodos.push(objetoTodo);

      return objetoTodo;
    }
}

function AtualizarToDo(textoAntigo, textoNovo, arrayTodos) {
  for(let i = 0; i < arrayTodos.length; i++) {

    if(arrayTodos[i].Texto === textoAntigo) {

      arrayTodos[i].Texto = textoNovo;

      return true;
    }
  }

  return false;
}

function ConcluirToDo(arrayTodos, texto) {
  for(let i = 0; i < arrayTodos.length; i++) {

    if(arrayTodos[i].Texto === texto) {

      arrayTodos[i].Feito = !arrayTodos[i].Feito;

      return true;
    } 
  }

  return false;
}

function ExcluirToDo(arrayTodos, texto) {
  for(let i = 0; i < arrayTodos.length; i++) {

    if(arrayTodos[i].Texto === texto) {

      arrayTodos.splice(i, 1);

      return true;
    }
  }

  return false;
}

function PesquisarToDo(arrayTodos, texto) {
  for(let i = 0; i < arrayTodos.length; i++) {

    if(arrayTodos[i].Texto === texto) {

      return true;
    }
  }

  return false; 
}

function OrdenarCrescente(arrayTodos) {
  arrayTodos.sort((a, b) => a.Prioridade - b.Prioridade);

  return arrayTodos;
}
function OrdenarDecrescente(arrayTodos) {
  arrayTodos.sort((a, b) => b.Prioridade - a.Prioridade);

  return arrayTodos;
}

// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoInput2 = document.querySelector("#todo-input-2");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;



// Funções
const saveTodo = (text, rating, done = 0, save = 1) => {
  let objetoTodo = CriarToDo(text, rating, arrayTodos)

  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = objetoTodo.Texto;
  todo.appendChild(todoTitle);

  const todoRating = document.createElement("h3");
  todoRating.innerText = objetoTodo.Prioridade;
  todo.appendChild(todoRating);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, rating, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput2.value = "";


};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");
  let targetTodo
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    if (todoTitle.innerText === oldInputValue) {
      targetTodo = todoTitle
    }

  });

  let atualizado = AtualizarToDo(targetTodo.innerText, text,arrayTodos)

  if (atualizado) {
    targetTodo.innerText = text;
    // Utilizando dados da localStorage
    updateTodoLocalStorage(oldInputValue, text);
  }
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  let pesquisa = PesquisarToDo(arrayTodos, search)

  if (pesquisa) {
    todos.forEach((todo) => {
      const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

      todo.style.display = "flex";

      if (!todoTitle.includes(search)) {
        todo.style.display = "none";
      }
    });
  };
}



const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "cresc":
      todos.forEach((todo) => {
        todo.remove()
        removeTodoLocalStorage(todo.querySelector("h3").innerText)
      })
      arrayTodos = OrdenarCrescente(arrayTodos)
      arrayTodos.forEach((todo) => saveTodo(todo.Texto, todo.Prioridade, done = 0, save = 1))
      break;

    case "decresc":
      todos.forEach((todo) => {
        todo.remove()
        removeTodoLocalStorage(todo.querySelector("h3").innerText)
      })
      arrayTodos = OrdenarDecrescente(arrayTodos)
      arrayTodos.forEach((todo) => saveTodo(todo.Texto, todo.Prioridade, done = 0, save = 1))
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  const inputValue2 = todoInput2.value;

  if (inputValue && inputValue2) {
    saveTodo(inputValue, inputValue2);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    todoTitle = parentEl.querySelector("h3").innerText
    let concluido = ConcluirToDo(arrayTodos, todoTitle)
    if (concluido) {
      parentEl.classList.toggle("done");
      updateTodoStatusLocalStorage(todoTitle);
    }
  }

  if (targetEl.classList.contains("remove-todo")) {
    todoTitle = parentEl.querySelector("h3").innerText
    let removido = ExcluirToDo(arrayTodos, todoTitle)
    if (removido) {
      parentEl.remove();

      // Utilizando dados da localStorage
      removeTodoLocalStorage(todoTitle);
    }

  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.rating, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
