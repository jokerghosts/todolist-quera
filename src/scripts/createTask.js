let tasks = [];
let selectedPriority = "";
export function setPriority(value) {
  selectedPriority = value;
}
export function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) return tasks;

  const task = {
    id: Date.now(),
    title,
    description: document.getElementById("taskDescription").value.trim(),
    priority: selectedPriority,
    done: false,
  };
  tasks = [...tasks, task];
  return tasks;
}
