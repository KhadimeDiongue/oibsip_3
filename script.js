document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => {
    return document.querySelector(selector);
  };
  const taskRepository = new TaskRepository();
  const currentDate = new Date().toISOString().split("T")[0];
  const pendingList = $("#pendingTasks");
  const completeList = $("#completeTasks")
  const tastNameInput = $("#taskNameInput");
  const btnAddTask = $("#btnAddTask");

  document
    .getElementById("navPendingTasks")
    .addEventListener("click", function () {
      document.getElementById("pending-tasks").classList.remove("hidden");
      document.getElementById("completed-tasks").classList.add("hidden");
    });

  document
    .getElementById("navCompletedTasks")
    .addEventListener("click", function () {
      document.getElementById("completed-tasks").classList.remove("hidden");
      document.getElementById("pending-tasks").classList.add("hidden");
      $('#completedHeading').textContent = `${taskRepository.CompleteTasks.size()} Completed Tasks`;
      RefreshCompleteTaskList();
    });

  btnAddTask.addEventListener("click", () => {
    let taskName = tastNameInput.value;
    if(taskName != "")
    {
      $('#errorMsg').textContent = "";
      taskNameInput.value = "";
      taskRepository.AddTask(new Task(taskName, currentDate));
      RefreshPendingTaskList();
    }
    else 
      $('#errorMsg').textContent = "Please enter task name";
  });
  function DeleteTask(taskId) {
    taskRepository.DeleteTask(taskId);
    RefreshPendingTaskList();
    RefreshCompleteTaskList();
  }
  function CompleteTask(taskId) {
    taskRepository.CompleteTask(taskId);
    RefreshPendingTaskList();
    RefreshCompleteTaskList();
  }
  function RefreshPendingTaskList() {
    pendingList.innerHTML = `<thead>
                                  <th>Name</th>
                                  <td>Date Created</td>
                                  <td>Action</td>
                             </thead>`;

    //print all tasks
    pendingList.innerHTML += taskRepository
      .GetPendingTasks()
      .map((task) => {
        return `<tr>
                  <td>${task._Name}</td>
                  <td>${task._DateCreated}</td>
                  <td>
                    <button class="delete" id="${task._Id}">Delete</button> |
                    <button class="complete" id="${task._Id}">Complete</button> 
                  </td>
                </tr>`;
      })
      .join("");

    //attach event listeners to the delete buttons for each task
    const deleteBtns = document.querySelectorAll(".delete");
    const completeBtns = document.querySelectorAll(".complete");

    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        DeleteTask(btn.getAttribute("id"));
      });
    });

    completeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        CompleteTask(btn.getAttribute("id"));
      });
    });
  }
  function RefreshCompleteTaskList() {
    completeList.innerHTML = `<thead>
                                  <th>Name</th>
                                  <td>Created on</td>
                                  <td>Completed on</td>
                                  <td>Action</td>
                             </thead>`;

    //print all tasks
    completeList.innerHTML += taskRepository
      .GetCompleteTasks()
      .map((task) => {
        return `<tr>
                  <td>${task._Name}</td>
                  <td>${task._DateCreated}</td>
                  <td>${task._DateCompleted}</td>
                  <td>
                    <button class="delete" id="${task._Id}">Delete</button> 
                  </td>
                </tr>`;
      })
      .join("");

    //attach event listeners to the delete buttons for each task
    const deleteBtns = document.querySelectorAll(".delete");

    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        DeleteTask(btn.getAttribute("id"));
      });
    });

    
  }
});


class DynamicList {
  constructor() {
    this.items = [];
  }

  // Add an element to the list
  add(element) {
    this.items.push(element);
  }

  removeById(itemId) {
    const index = this.items.findIndex((item) => item._Id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  getById(itemId) {
    const index = this.items.findIndex((item) => item._Id === itemId);
    if (index !== -1) {
      return this.items[index];
    }
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

}

class TaskRepository {
  constructor() {
    this.PendingTasks = new DynamicList();
    this.CompleteTasks = new DynamicList();
  }

  AddTask = (task) => {
    this.PendingTasks.add(task);
  };

  DeleteTask = (taskId) => {
    this.CompleteTasks.removeById(taskId);
    this.PendingTasks.removeById(taskId);
  };

  CompleteTask(taskId) {
    let task = this.PendingTasks.getById(taskId);
    task.DateCompleted = new Date().toISOString().split("T")[0];
    this.CompleteTasks.add(task);
    this.PendingTasks.removeById(taskId);
  }

  GetPendingTasks() {
    return this.PendingTasks.items;
  }
  GetCompleteTasks() {
    return this.CompleteTasks.items;
  }
}

class Task {
  static generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  constructor(name, dateCreated) {
    this._Id = Task.generateId();
    this._Name = name;
    this._DateCreated = dateCreated;
    this._DateCompleted = null;
  }

  //properties
  get Name() {
    return this._Name;
  }
  set Name(name) {
    this._Name = name;
  }

  get DateCreated() {
    return this._DateCreated;
  }
  set DateCreated(value) {
    this._DateCreated = value;
  }

  get DateCompleted() {
    return this._DateCompleted;
  }
  set DateCompleted(date) {
    this._DateCompleted = date;
  }
  get Id() {
    return this._Id;
  }

  static generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
}
