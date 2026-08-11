let tasks = JSON.parse(localStorage.getItem("oibsip_tasks")) || [];

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

function saveAndRender() {
  localStorage.setItem("oibsip_tasks", JSON.stringify(tasks));
  render();
}

function render() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  pendingCount.innerText = pendingTasks.length;
  completedCount.innerText = completedTasks.length;

  if (pendingTasks.length === 0) pendingList.innerHTML = '<li class="empty-msg">No pending tasks</li>';
  if (completedTasks.length === 0) completedList.innerHTML = '<li class="empty-msg">No completed tasks</li>';

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    
    const textSpan = document.createElement("span");
    textSpan.className = `task-text ${task.completed ? "completed-text" : ""}`;
    textSpan.innerText = `${task.text} (${task.time})`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-sm btn-complete";
    toggleBtn.innerText = task.completed ? "Undo" : "Complete";
    toggleBtn.onclick = () => { task.completed = !task.completed; saveAndRender(); };

    const editBtn = document.createElement("button");
    editBtn.className = "btn-sm btn-edit";
    editBtn.innerText = "Edit";
    editBtn.onclick = () => {
      const updated = prompt("Edit task:", task.text);
      if (updated && updated.trim()) {
        task.text = updated.trim();
        saveAndRender();
      }
    };

    const delBtn = document.createElement("button");
    delBtn.className = "btn-sm btn-delete";
    delBtn.innerText = "Delete";
    delBtn.onclick = () => { tasks.splice(index, 1); saveAndRender(); };

    actions.append(toggleBtn, editBtn, delBtn);
    li.append(textSpan, actions);

    if (task.completed) completedList.appendChild(li);
    else pendingList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const val = taskInput.value.trim();
  if (!val) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  tasks.push({ text: val, completed: false, time: time });
  taskInput.value = "";
  saveAndRender();
});

render();
