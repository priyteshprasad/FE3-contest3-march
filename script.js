const todoList = JSON.parse(localStorage.getItem("todos")) || [];

const itemNameInput = document.getElementById("item-name");
const dueDateInput = document.getElementById("due-date");
const prioritySelect = document.getElementById("priority");
const addButton = document.getElementById("add-button");
const todayTasksList = document.getElementById("today-tasks");
const futureTasksList = document.getElementById("future-tasks");
const completedTasksList = document.getElementById("completed-tasks");

function addTodo() {
  const name = itemNameInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (name) {
    const todo = {
      name,
      dueDate,
      priority,
      completed: false,
    };
    if(!todo.dueDate){
        todo.dueDate = new Date().toISOString().slice(0, 10);
    }
    todoList.push(todo);
    localStorage.setItem("todos", JSON.stringify(todoList));

    itemNameInput.value = ""; // Clear input fields after adding
    dueDateInput.value = "";

    renderTodos(); // Call function to display updated list
  }
}

function renderTodos() {
  todayTasksList.innerHTML = ""; // Clear existing list items
  futureTasksList.innerHTML = "";
  completedTasksList.innerHTML = "";

  const today = new Date().toISOString().slice(0, 10); // Get today's date

  let todayIndex = 1;
  let futureIndex = 1;
  let completedIndex = 1;

  todoList.forEach((todo) => {
    //create the list item
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");

    //add the task name
    const taskName = document.createElement("span");
    taskName.classList.add("task-name");
    taskName.textContent = todo.name;

    //add the priority
    const priorityType = document.createElement("span");
    priorityType.classList.add("task-name");
    priorityType.textContent = "Priority: "+ todo.priority;

    //add the task date
    const dueDateElement = document.createElement("span");
    dueDateElement.classList.add("task-name");
    dueDateElement.textContent = todo.dueDate;

    //add complete button only if the task is incomplete
    const completeButton = document.createElement("button");
    if (todo.completed == false) {
      completeButton.classList.add("completed");
      completeButton.textContent = "✔";
      completeButton.innerHTML = `<i class="material-icons">check_</i>`;
      completeButton.addEventListener("click", () => {
        todo.completed = !todo.completed;
        localStorage.setItem("todos", JSON.stringify(todoList));
        renderTodos();
      });
    }

    //add delete button
    const deleteButton = document.createElement("div");
    deleteButton.innerHTML = `<i class="material-icons">delete</i>`;
    deleteButton.classList.add("pointer");
    deleteButton.addEventListener("click", () => {
      const todoIndex = todoList.indexOf(todo);
      todoList.splice(todoIndex, 1);
      localStorage.setItem("todos", JSON.stringify(todoList));
      renderTodos();
    });

    if (todo.completed) {
        todo.index = completedIndex++;
        listItem.classList.add("completed-item");
      completedTasksList.appendChild(listItem);
    } else if (todo.dueDate === today) {
        todo.index = todayIndex++;
      todayTasksList.appendChild(listItem);
    } else {
        todo.index = futureIndex++;
      const parsedDueDate = new Date(todo.dueDate);
      if (parsedDueDate > new Date()) {
        futureTasksList.appendChild(listItem);
      } else {
        listItem.classList.add("past-due"); // Mark past due tasks red
        futureTasksList.appendChild(listItem);
      }
    }

    //add index
    const indexElement = document.createElement("span");
    indexElement.textContent = todo.index+". ";


    listItem.appendChild(indexElement);
    listItem.appendChild(taskName);
    listItem.appendChild(dueDateElement);
    listItem.appendChild(priorityType);
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);
  });
}

addButton.addEventListener("click", addTodo);

renderTodos(); // Call on page load to display existing todos
