// note: local storage
function setData(key, value) {
    localStorage.setItem(key, value);
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data;
}

// info: جهت تست؛ فعلاً در پروژه استفاده نمی شود
function removeData(key) {
    localStorage.removeItem(key);
}

// info: جهت تست؛ فعلاً در پروژه استفاده نمی شود
// note: کل localStorage (حتی داده ی پروژه های دیگر روی localhost) را پاک می کند
function clearData() {
    localStorage.clear()
}


// note: theme mode
function toggleTheme(themeMode) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("class", themeMode);

    // note: موقع کلیک، رنگ ها آرام عوض می شوند و بعد از 300 میلی ثانیه کلاس برداشته می شود
    htmlElement.classList.add("theme-transition");
    setTimeout(function () {
        htmlElement.classList.remove("theme-transition");
    }, 300);

    saveTheme(themeMode);
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
    // note: موقع باز شدن صفحه، تم بدون transition اعمال می شود تا پرش نداشته باشد
    document.documentElement.setAttribute("class", themeMode);
}


// note: on load
loadTheme();
