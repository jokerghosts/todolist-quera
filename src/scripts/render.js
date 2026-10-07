export function renderTasks(tasks) {
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");

    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
    `;

    taskList.appendChild(taskElement);
  });
}
