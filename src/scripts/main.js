// note: متغیرها

// note: لیست همه ی تسک ها
let tasks = [];

// note: اولویتی که توی فرم انتخاب شده
let selectedPriority = "low";

// note: آیدی تسکی که داریم ویرایشش می کنیم (null یعنی هیچ کدام)
let editingTaskId = null;

// note: عنصرهای صفحه
const taskForm = document.getElementById("task-form");
const submitButton = document.getElementById("task-form-submit");
const cancelButton = document.getElementById("cancel-edit-btn");
const addTaskSection = document.getElementById("add-task-section");
const createTaskSection = document.getElementById("create-task-section");
const titleInput = document.querySelector("[name='task-title']");
const descriptionInput = document.querySelector("[name='task-description']");

const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const todoCountText = document.getElementById("todo-count");
const doneCountText = document.getElementById("done-count");
const emptyState = document.getElementById("empty-state");
const doneSection = document.getElementById("done-section");

// note: بخش تگ ها (اولویت) در فرم
const tagsButton = document.getElementById("tags-btn");
const tagsSvg = document.getElementById("tags-svg");
const tagsIcon = document.getElementById("tags-icon");
const tagsBox = document.getElementById("tags-box");
const selectedPriorityBox = document.getElementById("selected-priority");
const selectedPriorityLabel = document.getElementById("selected-priority-label");

// note: اسم و رنگ هر اولویت
const priorities = {
    high: {label: "بالا", color: "orange"},
    medium: {label: "متوسط", color: "yellow"},
    low: {label: "پایین", color: "turquoise"}
};


// note: local storage
function setData(key, value) {
    localStorage.setItem(key, value);
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data;
}

function removeData(key) {
    localStorage.removeItem(key);
}
function clearData() {
    localStorage.clear()
}

// note: اسم مخصوص این پروژه، تا با داده ی پروژه های دیگه روی localhost قاطی نشه
const tasksKey = "todolist-quera-tasks";

// note: ذخیره ی تسک ها
function saveTasks() {
    setData(tasksKey, JSON.stringify(tasks));
}

// note: خواندن تسک ها
function loadTasks() {
    const data = getData(tasksKey);
    if (data) {
        tasks = JSON.parse(data);
    }
}

// note: ذخیره ی تم
function saveTheme(themeMode) {
    setData("theme", themeMode);
}

// note: خواندن تم
function loadTheme() {
    let themeMode = getData("theme");
    if (themeMode === null) {
        themeMode = "light";
    }
    toggleTheme(themeMode);
}


// note: Create Task

// note: 11. ساختن تسک جدید
function createTask() {
    // note: 13. عنوان تسک (اجباری)
    const title = titleInput.value.trim();
    // note: 14. توضیحات تسک (اختیاری)
    const description = descriptionInput.value.trim();

    if (title === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        priority: selectedPriority, // note: 15. اولویت تسک
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    closeEditTask();
}

// note: فرم مشترک ساختن و ویرایش تسک
// note: isEdit = true یعنی ویرایش تسک، false یعنی ساختن تسک جدید
function openTaskForm(isEdit, task) {
    // note: اگر فرم قبلاً باز بود، اول بسته و خالی می شود
    closeEditTask();

    if (isEdit) {
        editingTaskId = task.id;
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        selectPriority(task.priority);
        submitButton.textContent = "ویرایش تسک";

        // note: فرم دقیقاً جای کارت همان تسک قرار می گیرد و کارت مخفی می شود
        const card = document.getElementById("task-" + task.id);
        card.before(createTaskSection);
        card.classList.add("hidden");
    } else {
        submitButton.textContent = "اضافه کردن تسک";
    }

    updateSubmitButton();

    // note: وقتی فرم باز است، کل بخش دکمه ی افزودن مخفی می شود
    // note: (فقط دکمه نه، وگرنه بخش خالی فاصله ی اضافه می سازد)
    addTaskSection.classList.add("hidden");
    // note: دکمه ی ضربدر برای بستن فرم بدون ثبت
    cancelButton.classList.remove("hidden");
    createTaskSection.classList.remove("hidden");
    titleInput.focus();
}

// note: 12. باز کردن فرم ساختن تسک (بالای لیست)
function toggleCreateTaskDropdown() {
    openTaskForm(false);
}

// note: دکمه ی ثبت تا وقتی عنوان خالیه غیرفعال می مونه
function updateSubmitButton() {
    if (titleInput.value.trim() === "") {
        submitButton.disabled = true;
    } else {
        submitButton.disabled = false;
    }
}

titleInput.addEventListener("input", updateSubmitButton);

// note: رنگ پس زمینه و متن برچسب هر اولویت (ضربدر هم رنگ متن می شود)
const priorityChipColors = {
    high: "bg-orange/20 text-orange",
    medium: "bg-yellow/20 text-yellow",
    low: "bg-turquoise-light text-turquoise"
};
const priorityChipClass = "flex w-fit items-center gap-2 rounded-8 px-3 py-1.5 text-xs font-semibold";

// note: شکل آیکون تگ
// note: باکس باز: آیکون پر و ایستاده / باکس بسته: آیکون توخالی و خوابیده (چرخش 90 درجه)
function updateTagsIcon(isOpen) {
    if (isOpen) {
        tagsIcon.setAttribute("fill", "currentColor");
        tagsSvg.classList.remove("-rotate-90");
    } else {
        tagsIcon.setAttribute("fill", "none");
        tagsSvg.classList.add("-rotate-90");
    }
}

// note: باز و بسته کردن باکس اولویت ها با دکمه ی تگ ها
function toggleTagsBox() {
    tagsBox.classList.toggle("hidden");

    const isOpen = !tagsBox.classList.contains("hidden");
    updateTagsIcon(isOpen);
}

// note: 15. انتخاب اولویت
function selectPriority(priority) {
    selectedPriority = priority;

    // note: تگ ها و دو اولویت دیگر مخفی می شوند و فقط اولویت انتخاب شده می ماند
    tagsButton.classList.add("hidden");
    tagsBox.classList.add("hidden");
    updateTagsIcon(false);

    selectedPriorityLabel.textContent = priorities[priority].label;
    selectedPriorityBox.className = priorityChipClass + " " + priorityChipColors[priority];
}

// note: حذف اولویت انتخاب شده با ضربدر، و برگشت دکمه ی تگ ها
function removePriority() {
    selectedPriority = "low";
    selectedPriorityBox.className = "hidden";
    tagsButton.classList.remove("hidden");
}


// note: Task List & Rendering

// note: 19. مرتب کردن تسک ها بر اساس اولویت
function sortTasks() {
    const order = {high: 1, medium: 2, low: 3};
    tasks.sort((a, b) => order[a.priority] - order[b.priority]);
}

// note: 18. تعداد تسک ها
function updateTaskCount() {
    let todoCount = 0;
    let doneCount = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            doneCount++;
        } else {
            todoCount++;
        }
    }

    // note: عددها با رقم فارسی
    const todoNumber = todoCount.toLocaleString("fa-IR");
    const doneNumber = doneCount.toLocaleString("fa-IR");

    if (todoCount > 0) {
        todoCountText.textContent = `${todoNumber} تسک را باید انجام بدهید.`;
    } else {
        todoCountText.textContent = "تسکی برای انجام وجود ندارد.";
    }
    doneCountText.textContent = `${doneNumber} تسک انجام شده است.`;

    // note: اگر تسکی نبود عکس خالی را نشان بده
    if (todoCount === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }

    // note: اگر تسک انجام شده ای نبود آن بخش را مخفی کن
    if (doneCount === 0) {
        doneSection.classList.add("hidden");
    } else {
        doneSection.classList.remove("hidden");
    }
}

// note: کلاس های کارت تسک
const cardClass = "relative rounded-12 border border-card-border bg-card px-4 py-5";
const checkboxLabelClass = "relative inline-grid size-6 shrink-0 cursor-pointer place-items-center";
const checkboxBoxClass = "size-5 rounded-[6px] border-2 border-gray/60 peer-checked:border-check peer-checked:bg-check";
const checkIconClass = "pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100";
const moreButtonClass = "grid size-8 shrink-0 cursor-pointer place-items-center rounded-8 hover:bg-blue-light hover:text-blue";
const menuClass = "hidden absolute left-7 top-12 z-10 flex items-center overflow-hidden rounded-8 border border-card-border bg-menu-bg";
const deleteButtonClass = "grid size-10 cursor-pointer place-items-center text-gray hover:bg-orange/15 hover:text-orange";
const editButtonClass = "grid size-10 cursor-pointer place-items-center text-gray hover:bg-blue-light hover:text-blue";

// note: شکل آیکون ها (svg)
const checkIconPath = "M5 12.5L9.5 17L19 7.5";
const deleteIconPath = "M.75 4.75h16m-15 0 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12m-10 0v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m-5 5 4 4m0-4-4 4";
const editIconPath = "M3.75 4.75h-1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1m-1-12 3 3m1.385-1.415a2.1 2.1 0 0 0-2.97-2.97L5.75 9.75v3h3Z";
const iconStroke = `stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`;

// note: آیکون سه نقطه؛ رنگش از متن دکمه می آید (currentColor) تا موقع هاور آبی شود
const moreIcon = `
    <svg class="size-4" viewBox="0 0 4 18" fill="currentColor">
        <circle cx="2" cy="2" r="2" />
        <circle cx="2" cy="9" r="2" />
        <circle cx="2" cy="16" r="2" />
    </svg>
`;

// note: html یک کارت تسک
function createTaskCard(task) {
    // note: اگر اولویت تسک درست نبود، پایین در نظر گرفته می شود
    const priority = priorities[task.priority] || priorities.low;
    const color = priority.color;

    let checked = "";
    let titleClass = "text-lg font-semibold text-gray";
    let moreClass = moreButtonClass;

    const badgeClass = `rounded-8 bg-${color}/20 px-3 py-1 text-xs font-semibold text-${color}`;
    let badge = `<span class="${badgeClass}">${priority.label}</span>`;

    // note: اگر توضیحات خالی بود، تگ p ساخته نمی شود
    const descriptionClass = "mt-3 text-sm leading-7 text-profile-desc";
    let description = "";

    if (task.description) {
        description = `<p class="${descriptionClass}">${task.description}</p>`;
    }

    // note: تسک انجام شده خط می خورد و اولویت و توضیحات ندارد
    if (task.completed) {
        checked = "checked";
        titleClass = "text-gray line-through";
        badge = "";
        description = "";
        // note: سه نقطه ی تسک انجام شده کم رنگ است
        moreClass = moreButtonClass + " text-done-icon";
    }

    return `
        <article id="task-${task.id}" class="${cardClass}">
            <span class="absolute inset-y-3 right-0 w-1 rounded-l-full bg-${color}"></span>

            <div class="flex items-start gap-4">
                <label class="${checkboxLabelClass}">
                    <input type="checkbox" class="peer sr-only" ${checked}
                           onclick="toggleTaskCompletion(${task.id})" />
                    <span class="${checkboxBoxClass}"></span>
                    <svg class="${checkIconClass}" viewBox="0 0 24 24" fill="none">
                        <path d="${checkIconPath}" ${iconStroke} stroke-width="2.5" />
                    </svg>
                </label>

                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-3">
                        <h2 class="${titleClass}">${task.title}</h2>
                        ${badge}
                    </div>
                    ${description}
                </div>

                <button type="button" class="${moreClass}" aria-label="گزینه های بیشتر"
                        onclick="openDeleteAction(${task.id})">
                    ${moreIcon}
                </button>

                <div id="menu-${task.id}" class="${menuClass}">
                    <button type="button" class="${deleteButtonClass}" onclick="deleteTask(${task.id})">
                        <svg class="size-6" fill="none" viewBox="0 0 16 24">
                            <path d="${deleteIconPath}" ${iconStroke} stroke-width="1.5" />
                        </svg>
                    </button>
                    <span class="h-6 w-px bg-gray-light/30"></span>
                    <button type="button" class="${editButtonClass}" onclick="openEditTask(${task.id})">
                        <svg class="size-6" fill="none" viewBox="0 0 16 24">
                            <path d="${editIconPath}" ${iconStroke} stroke-width="1.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// note: 20. نمایش تسک ها
function renderTasks() {
    // note: اگر فرم ویرایش داخل لیست باز بود، اول بسته می شود
    // note: وگرنه با ساختن دوباره ی لیست، خود فرم هم پاک می شود
    if (editingTaskId !== null) {
        closeEditTask();
    }

    // note: تسک های انجام نشده بر اساس اولویت مرتب می شوند
    sortTasks();

    todoList.innerHTML = "";
    doneList.innerHTML = "";

    const doneTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            doneTasks.push(tasks[i]);
        } else {
            // note: 17. تسک های انجام نشده
            todoList.innerHTML += createTaskCard(tasks[i]);
        }
    }

    // note: تسک های انجام شده بر اساس زمان انجام شدن (جدیدترین بالاتر)
    doneTasks.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    for (let i = 0; i < doneTasks.length; i++) {
        // note: 16. تسک های انجام شده
        doneList.innerHTML += createTaskCard(doneTasks[i]);
    }

    // note: 34. آپدیت تعداد بعد از هر تغییر
    updateTaskCount();
}


// note: Update & Delete Task

// note: 21. تیک زدن تسک
function toggleTaskCompletion(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            // note: 30. عوض کردن وضعیت انجام شدن
            tasks[i].completed = !tasks[i].completed;

            // note: زمان انجام شدن ذخیره می شود تا تسک های انجام شده با آن مرتب شوند
            if (tasks[i].completed) {
                tasks[i].completedAt = Date.now();
            } else {
                tasks[i].completedAt = null;
            }
        }
    }

    saveTasks();
    // note: 32. بعد از تغییر وضعیت، تسک جابه جا می شود
    renderTasks();
}

// note: 22. باز کردن ویرایش تسک (جای همان تسک)
function openEditTask(id) {
    // note: منوی حذف و ویرایش بسته می شود
    openDeleteAction(id);

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            openTaskForm(true, tasks[i]);
        }
    }
}

// note: 23. بستن فرم (ساختن یا ویرایش)
function closeEditTask() {
    // note: اگر وسط ویرایش بودیم، کارت همان تسک دوباره نشان داده می شود
    if (editingTaskId !== null) {
        const card = document.getElementById("task-" + editingTaskId);
        if (card) {
            card.classList.remove("hidden");
        }
    }

    // note: فرم به جای اصلی خودش (بالای لیست) برمی گردد
    addTaskSection.after(createTaskSection);

    editingTaskId = null;
    taskForm.reset();
    // note: اولویت پاک می شود و باکس اولویت ها بسته می شود
    removePriority();
    tagsBox.classList.add("hidden");
    updateTagsIcon(false);
    submitButton.textContent = "اضافه کردن تسک";
    updateSubmitButton();
    cancelButton.classList.add("hidden");
    createTaskSection.classList.add("hidden");
    // note: بعد از بسته شدن فرم، دکمه ی افزودن دوباره نشان داده می شود
    addTaskSection.classList.remove("hidden");
}

// note: 27. آپدیت تسک
function updateTask() {
    const title = titleInput.value.trim();

    // note: تسک بدون عنوان ذخیره نمی شود
    if (title === "") {
        return;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === editingTaskId) {
            tasks[i].title = title; // note: 24. عنوان جدید
            // note: 25. توضیحات جدید
            tasks[i].description = descriptionInput.value.trim();
            tasks[i].priority = selectedPriority; // note: 26. و 31. اولویت جدید
        }
    }

    saveTasks();
    // note: 33. بعد از تغییر اولویت، تسک ها دوباره مرتب می شوند
    renderTasks();
    closeEditTask();
}

// note: 28. باز کردن منوی حذف
function openDeleteAction(id) {
    const menu = document.getElementById("menu-" + id);
    menu.classList.toggle("hidden");
}

// note: 29. حذف تسک
function deleteTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks.splice(i, 1);
        }
    }

    // note: اگر همین تسک در حال ویرایش بود، فرم هم بسته می شود
    if (editingTaskId === id) {
        closeEditTask();
    }

    saveTasks();
    renderTasks();
}

// note: دکمه ی فرم هم برای ساختن و هم برای ویرایش است
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editingTaskId !== null) {
        updateTask();
    } else {
        createTask();
    }
});


// note: UI

// note: باز و بسته کردن منوی موبایل
function toggleMobileSidebar() {
    const sidebar = document.getElementById("mobile-sidebar");
    sidebar.classList.toggle("hidden");
}

// note: theme mode
function toggleTheme(themeMode) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("class", themeMode);
    saveTheme(themeMode);
}


// note: datetime
function updateClock() {
    const date = new Date();

    const parts = new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).formatToParts(date);

    const weekday = parts.find(p => p.type === "weekday").value;
    const day = parts.find(p => p.type === "day").value;
    const month = parts.find(p => p.type === "month").value;
    const year = parts.find(p => p.type === "year").value;

    const text = `امروز، ${weekday}، ${day} ${month} ${year}`;
    document.getElementById("today-date").textContent = text;
    document.getElementById("today-date-mobile").textContent = text;
}


// note: on load
loadTheme();
loadTasks();
renderTasks();
updateClock();
setInterval(updateClock, 60000);
