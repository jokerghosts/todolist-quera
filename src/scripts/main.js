import { addTask } from "./createTask.js";

document.getElementById("addTaskBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const tasks = addTask();
  console.log(tasks);
});
console.log("loading");
