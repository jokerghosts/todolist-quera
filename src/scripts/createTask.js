let tasks = [];
export function addTask() {
  const task = {
    id: Date.now(),
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    // prority: document.getElementById("btn_priority").value,
  };
  tasks = [...tasks, task];
  return tasks;
}
