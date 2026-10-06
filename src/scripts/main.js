// note: بخش ویرایش و حذف تسک

// note: اولویتی که توی فرم انتخاب شده
let selectedPriority = "low";

// note: آیدی تسکی که داریم ویرایشش می کنیم
let editingTaskId = null;

const taskForm = document.getElementById("task-form");
const submitButton = document.getElementById("task-form-submit");

// note: 21. تیک زدن تسک
function toggleTaskCompletion(id) {
    // todo: نیاز به تکمیل دارد
}

// note: 22. باز کردن ویرایش تسک
function openEditTask(id) {
    // todo: نیاز به تکمیل دارد
}

// note: 23. بستن ویرایش تسک
function closeEditTask() {
    editingTaskId = null;
    taskForm.reset();
    selectedPriority = "low";
    submitButton.textContent = "اضافه کردن تسک";
}

// todo: 24. ویرایش عنوان تسک (توی updateTask)
// todo: 25. ویرایش توضیحات تسک (توی updateTask)

// note: 26. انتخاب اولویت
function selectPriority(priority) {
    selectedPriority = priority;
}

// note: 27. آپدیت تسک
function updateTask() {
    // todo: نیاز به تکمیل دارد
    // note: 24. عنوان جدید
    // note: 25. توضیحات جدید
    // note: 26. اولویت جدید
}

// note: 28. باز کردن منوی حذف
function openDeleteAction(id) {
    const menu = document.getElementById("menu-" + id);
    menu.classList.toggle("hidden");
}

// note: 29. حذف تسک
// todo: تا tasks و saveTasks و renderTasks نوشته نشن کار نمی کنه
function deleteTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks.splice(i, 1);
        }
    }

    saveTasks();
    renderTasks();
}
