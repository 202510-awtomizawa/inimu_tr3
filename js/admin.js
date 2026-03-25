(() => {
  const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
  const STATUS_OPTIONS = ["○", "△", "×", "―"];
  const COURSE_OPTIONS = ["standard", "special", "-"];
  const HOLIDAY_SET = new Set([
    "2026-03-20"
  ]);

  const currentMonthLabel = document.getElementById("currentMonthLabel");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");
  const saveBtn = document.getElementById("saveBtn");
  const changeCountText = document.getElementById("changeCountText");
  const adminTableBody = document.getElementById("adminTableBody");

  const statusStore = {};
  const courseStore = {};
  const savedStatusStore = {};
  const savedCourseStore = {};
  let viewDate = new Date(2026, 2, 1);

  function formatMonthLabel(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}.${m}`;
  }

  function formatIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function isHoliday(date) {
    return HOLIDAY_SET.has(formatIsoDate(date));
  }

  function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function isLastWeekWeekend(date) {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const lastWeekStart = new Date(lastDay);
    lastWeekStart.setDate(lastDay.getDate() - 6);
    return isWeekend(date) && date >= lastWeekStart;
  }

  function getCourse(date) {
    if (isLastWeekWeekend(date)) {
      return "special";
    }
    if (isWeekend(date) || isHoliday(date)) {
      return "standard";
    }
    return "-";
  }

  function getDefaultStatus(course) {
    return course === "-" ? "―" : "○";
  }

  function isRowDirty(isoDate) {
    return statusStore[isoDate] !== savedStatusStore[isoDate] || courseStore[isoDate] !== savedCourseStore[isoDate];
  }

  function getDirtyCount() {
    return Object.keys(statusStore).filter((isoDate) => isRowDirty(isoDate)).length;
  }

  function updateChangeSummary() {
    const dirtyCount = getDirtyCount();
    changeCountText.textContent = dirtyCount === 0 ? "未保存の変更はありません" : `${dirtyCount}件の変更があります`;
    saveBtn.disabled = dirtyCount === 0;
  }

  function syncRowDirtyState(tr, isoDate) {
    tr.classList.toggle("is-dirty", isRowDirty(isoDate));
  }

  function createStatusSelect(isoDate, initialStatus, tr) {
    const select = document.createElement("select");
    select.className = "status-select";
    select.setAttribute("aria-label", `${isoDate} のステータス`);

    STATUS_OPTIONS.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      select.appendChild(option);
    });

    select.value = initialStatus;
    select.addEventListener("change", (event) => {
      statusStore[isoDate] = event.target.value;
      syncRowDirtyState(tr, isoDate);
      updateChangeSummary();
    });

    return select;
  }

  function syncStatusAvailability(isoDate, statusSelect, statusHelp) {
    const isCourseUnset = courseStore[isoDate] === "-";
    if (isCourseUnset && statusStore[isoDate] !== "―") {
      statusStore[isoDate] = "―";
      statusSelect.value = "―";
    }
    statusSelect.disabled = isCourseUnset;
    statusHelp.hidden = !isCourseUnset;
  }

  function createCourseSelect(isoDate, initialCourse, statusSelect, statusHelp, tr) {
    const select = document.createElement("select");
    select.className = "status-select course-select";
    select.setAttribute("aria-label", `${isoDate} のコース`);

    COURSE_OPTIONS.forEach((course) => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      select.appendChild(option);
    });

    select.value = initialCourse;
    select.addEventListener("change", (event) => {
      const nextCourse = event.target.value;
      courseStore[isoDate] = nextCourse;

      if (nextCourse === "-") {
        if (statusStore[isoDate] !== "―") {
          statusStore[isoDate] = "―";
          statusSelect.value = "―";
        }
      } else if (statusStore[isoDate] === "―") {
        statusStore[isoDate] = "○";
        statusSelect.value = "○";
      }

      syncStatusAvailability(isoDate, statusSelect, statusHelp);
      syncRowDirtyState(tr, isoDate);
      updateChangeSummary();
    });

    return select;
  }

  function createRow(date) {
    const isoDate = formatIsoDate(date);
    const dayNumber = String(date.getDate()).padStart(2, "0");
    const weekday = WEEKDAY_LABELS[date.getDay()];
    const course = getCourse(date);

    if (!Object.prototype.hasOwnProperty.call(statusStore, isoDate)) {
      statusStore[isoDate] = getDefaultStatus(course);
    }
    if (!Object.prototype.hasOwnProperty.call(courseStore, isoDate)) {
      courseStore[isoDate] = course;
    }
    if (!Object.prototype.hasOwnProperty.call(savedStatusStore, isoDate)) {
      savedStatusStore[isoDate] = statusStore[isoDate];
    }
    if (!Object.prototype.hasOwnProperty.call(savedCourseStore, isoDate)) {
      savedCourseStore[isoDate] = courseStore[isoDate];
    }

    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.dataset.label = "日付";
    dateTd.textContent = dayNumber;

    const weekdayTd = document.createElement("td");
    weekdayTd.dataset.label = "曜日";
    weekdayTd.textContent = weekday;
    if (isHoliday(date)) {
      weekdayTd.classList.add("day-holiday");
    }

    const courseTd = document.createElement("td");
    courseTd.dataset.label = "コース";
    const statusTd = document.createElement("td");
    statusTd.dataset.label = "ステータス";
    statusTd.classList.add("status-cell");
    const statusSelect = createStatusSelect(isoDate, statusStore[isoDate], tr);
    const statusHelp = document.createElement("small");
    statusHelp.className = "status-help";
    statusHelp.textContent = "コース未設定のため変更できません";
    const courseSelect = createCourseSelect(isoDate, courseStore[isoDate], statusSelect, statusHelp, tr);
    courseTd.appendChild(courseSelect);
    statusTd.appendChild(statusSelect);
    statusTd.appendChild(statusHelp);
    syncStatusAvailability(isoDate, statusSelect, statusHelp);

    tr.appendChild(dateTd);
    tr.appendChild(weekdayTd);
    tr.appendChild(courseTd);
    tr.appendChild(statusTd);
    syncRowDirtyState(tr, isoDate);

    return tr;
  }

  function renderMonth() {
    currentMonthLabel.textContent = formatMonthLabel(viewDate);
    adminTableBody.innerHTML = "";

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const endDay = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= endDay; day += 1) {
      const date = new Date(year, month, day);
      adminTableBody.appendChild(createRow(date));
    }
    updateChangeSummary();
  }

  prevMonthBtn.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderMonth();
  });

  nextMonthBtn.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderMonth();
  });

  saveBtn.addEventListener("click", () => {
    const hasInvalidRow = Object.keys(statusStore).some((isoDate) => courseStore[isoDate] === "-" && statusStore[isoDate] !== "―");
    if (hasInvalidRow) {
      alert("先にコースを設定してください");
      return;
    }

    Object.keys(statusStore).forEach((isoDate) => {
      savedStatusStore[isoDate] = statusStore[isoDate];
      savedCourseStore[isoDate] = courseStore[isoDate];
    });
    adminTableBody.querySelectorAll("tr.is-dirty").forEach((tr) => {
      tr.classList.remove("is-dirty");
    });
    updateChangeSummary();
    alert("保存しました（ダミー）");
  });

  renderMonth();
})();
