(() => {
  const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
  const STATUS_OPTIONS = ["○", "△", "×", "―"];
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
  const savedStatusStore = {};
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

  function getDirtyCount() {
    return Object.keys(statusStore).filter((isoDate) => statusStore[isoDate] !== savedStatusStore[isoDate]).length;
  }

  function updateChangeSummary() {
    const dirtyCount = getDirtyCount();
    changeCountText.textContent = dirtyCount === 0 ? "未保存の変更はありません" : `${dirtyCount}件の変更があります`;
    saveBtn.disabled = dirtyCount === 0;
  }

  function syncRowDirtyState(tr, isoDate) {
    tr.classList.toggle("is-dirty", statusStore[isoDate] !== savedStatusStore[isoDate]);
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

  function createCourseBadge(course) {
    const span = document.createElement("span");
    span.classList.add("course-badge");

    if (course === "special") {
      span.classList.add("course-special");
      span.textContent = "special";
      return span;
    }

    if (course === "standard") {
      span.classList.add("course-standard");
      span.textContent = "standard";
      return span;
    }

    span.classList.add("course-none");
    span.textContent = "-";
    return span;
  }

  function createRow(date) {
    const isoDate = formatIsoDate(date);
    const dayNumber = String(date.getDate()).padStart(2, "0");
    const weekday = WEEKDAY_LABELS[date.getDay()];
    const course = getCourse(date);

    if (!Object.prototype.hasOwnProperty.call(statusStore, isoDate)) {
      statusStore[isoDate] = getDefaultStatus(course);
    }
    if (!Object.prototype.hasOwnProperty.call(savedStatusStore, isoDate)) {
      savedStatusStore[isoDate] = statusStore[isoDate];
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
    courseTd.appendChild(createCourseBadge(course));

    const statusTd = document.createElement("td");
    statusTd.dataset.label = "ステータス";
    statusTd.appendChild(createStatusSelect(isoDate, statusStore[isoDate], tr));

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
    Object.keys(statusStore).forEach((isoDate) => {
      savedStatusStore[isoDate] = statusStore[isoDate];
    });
    adminTableBody.querySelectorAll("tr.is-dirty").forEach((tr) => {
      tr.classList.remove("is-dirty");
    });
    updateChangeSummary();
    alert("保存しました（ダミー）");
  });

  renderMonth();
})();
