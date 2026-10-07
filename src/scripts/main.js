import { addTask } from "./createTask.js";
import { renderTasks } from "./render.js";
const form = document
  .getElementById("taskForm")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    const tasks = addTask();
    console.log(tasks);
    renderTasks(tasks);
    form.reset(); //clear the inputs
  });
