/**
 * 30-Day Data Engineering Study Plan
 * ====================================
 * PLAN DATA: Edit the `PLAN` array below to add, remove, or modify days.
 * Each entry has:
 *   day   (number)   – Day number (1–30)
 *   topic (string)   – Short headline shown in the collapsed card
 *   tasks (string)   – Full task description shown when expanded
 *   time  (string)   – Estimated study time, e.g. "4h"
 *
 * ADDING A DAY: Copy an existing object, change the day number, update topic/tasks/time.
 * REMOVING A DAY: Delete the object from the array. Progress keys remain harmless.
 */

// ─── PLAN DATA ────────────────────────────────────────────────────────────────
const PLAN = [
  { day: 1,  topic: "Linux Basics",             tasks: "Learn filesystem, ls, cd, grep; create project folders",                  time: "3h" },
  { day: 2,  topic: "Linux CLI Tools",           tasks: "Practice curl, wget, cron; download dataset",                            time: "3h" },
  { day: 3,  topic: "SQL Fundamentals",          tasks: "SELECT, WHERE, GROUP BY exercises",                                       time: "4h" },
  { day: 4,  topic: "SQL Joins",                 tasks: "Practice INNER and LEFT joins",                                           time: "4h" },
  { day: 5,  topic: "Advanced SQL",              tasks: "Window functions, CTEs",                                                  time: "4h" },
  { day: 6,  topic: "Data Modeling",             tasks: "Design star schema",                                                      time: "3h" },
  { day: 7,  topic: "PostgreSQL Setup",          tasks: "Install PostgreSQL; load dataset",                                        time: "4h" },
  { day: 8,  topic: "Python ETL",                tasks: "Build script CSV → database",                                            time: "4h" },
  { day: 9,  topic: "ETL Structure",             tasks: "Modular pipeline functions",                                              time: "4h" },
  { day: 10, topic: "Columnar Storage",          tasks: "Convert CSV to Parquet",                                                  time: "3h" },
  { day: 11, topic: "Spark Introduction",        tasks: "Install PySpark; read dataset",                                           time: "4h" },
  { day: 12, topic: "Spark Transformations",     tasks: "Filtering and aggregations",                                              time: "4h" },
  { day: 13, topic: "Spark Pipeline",            tasks: "Spark job writing Parquet",                                               time: "4h" },
  { day: 14, topic: "Airbyte Ingestion",         tasks: "Ingest API dataset",                                                      time: "4h" },
  { day: 15, topic: "Kafka Basics",              tasks: "Producer and consumer example",                                           time: "4h" },
  { day: 16, topic: "Streaming Ingestion",       tasks: "Build Kafka producer",                                                    time: "4h" },
  { day: 17, topic: "Data Warehouse Setup",      tasks: "Create Snowflake or BigQuery environment",                                time: "3h" },
  { day: 18, topic: "Load Warehouse",            tasks: "Load Parquet data",                                                       time: "3h" },
  { day: 19, topic: "dbt Introduction",          tasks: "Create dbt project",                                                      time: "4h" },
  { day: 20, topic: "dbt Transformations",       tasks: "Staging and mart models",                                                 time: "4h" },
  { day: 21, topic: "Airflow Orchestration",     tasks: "Build DAG pipeline",                                                      time: "4h" },
  { day: 22, topic: "Data Quality",              tasks: "Great Expectations tests",                                                 time: "3h" },
  { day: 23, topic: "Metadata Catalog",          tasks: "Explore Amundsen or DataHub",                                             time: "3h" },
  { day: 24, topic: "Feature Store",             tasks: "Create feature table using Feast",                                        time: "3h" },
  { day: 25, topic: "Model Serving",             tasks: "Simple ML model API",                                                     time: "4h" },
  { day: 26, topic: "Pipeline Automation",       tasks: "Airflow scheduling",                                                      time: "4h" },
  { day: 27, topic: "Monitoring",                tasks: "Logging and alerts",                                                      time: "3h" },
  { day: 28, topic: "Dashboard",                 tasks: "Create BI dashboard",                                                     time: "3h" },
  { day: 29, topic: "Documentation",             tasks: "GitHub repo cleanup",                                                     time: "3h" },
  { day: 30, topic: "Final Deployment",          tasks: "Pipeline demo and validation",                                            time: "4h" },
];

// ─── WEEK LABELS ──────────────────────────────────────────────────────────────
const WEEK_LABELS = {
  1: "Week 1 — Foundation",
  2: "Week 2 — Pipelines",
  3: "Week 3 — Streaming & Orchestration",
  4: "Week 4 — Production",
};

// ─── STORAGE KEY ──────────────────────────────────────────────────────────────
// All per-day completion flags are stored under this namespace.
// Key format:  "de30_day_N"  where N is the day number.
const STORAGE_PREFIX = "de30_day_";

/**
 * PROGRESS SYSTEM
 * ─────────────────
 * Completion state lives in localStorage as individual boolean flags.
 * e.g. localStorage["de30_day_1"] = "true"
 *
 * If localStorage is unavailable (private browsing, storage quota), the
 * fallback `memoryStore` object is used instead — progress will be lost on
 * page refresh, but the app remains fully functional.
 */
let storageAvailable = false;
const memoryStore = {};

(function checkStorage() {
  try {
    const key = "__de30_test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    storageAvailable = true;
  } catch (e) {
    storageAvailable = false;
  }
})();

/** Read a stored flag. Returns boolean. */
function getFlag(day) {
  const key = STORAGE_PREFIX + day;
  if (storageAvailable) {
    return localStorage.getItem(key) === "true";
  }
  return memoryStore[key] === true;
}

/** Write a stored flag. */
function setFlag(day, value) {
  const key = STORAGE_PREFIX + day;
  if (storageAvailable) {
    if (value) {
      localStorage.setItem(key, "true");
    } else {
      localStorage.removeItem(key);
    }
  } else {
    memoryStore[key] = value;
  }
}

// ─── DOM REFS ─────────────────────────────────────────────────────────────────
const planGrid    = document.getElementById("planGrid");
const progressFill = document.getElementById("progressFill");
const progressPct  = document.getElementById("progressPct");
const progressFraction = document.getElementById("progressFraction");
const progressTrack = document.getElementById("progressTrack");
const exportBtn   = document.getElementById("exportBtn");
const resetBtn    = document.getElementById("resetBtn");

// ─── BUILD PLAN CARDS ─────────────────────────────────────────────────────────
(function buildPlan() {
  const DAYS_PER_WEEK = 7;

  // Group days into weeks
  const weeks = {};
  PLAN.forEach(entry => {
    const weekNum = Math.ceil(entry.day / DAYS_PER_WEEK);
    if (!weeks[weekNum]) weeks[weekNum] = [];
    weeks[weekNum].push(entry);
  });

  Object.keys(weeks).forEach(weekNum => {
    const group = document.createElement("div");
    group.className = "week-group";
    group.setAttribute("aria-label", `Week ${weekNum}`);

    // Week header
    const header = document.createElement("div");
    header.className = "week-header";
    const label = document.createElement("span");
    label.className = "week-label";
    label.textContent = WEEK_LABELS[weekNum] || `Week ${weekNum}`;
    const divider = document.createElement("div");
    divider.className = "week-divider";
    header.appendChild(label);
    header.appendChild(divider);
    group.appendChild(header);

    // Day cards
    weeks[weekNum].forEach(entry => {
      group.appendChild(createDayCard(entry));
    });

    planGrid.appendChild(group);
  });
})();

/** Creates a collapsible day card element. */
function createDayCard(entry) {
  const isComplete = getFlag(entry.day);

  const card = document.createElement("article");
  card.className = "day-card" + (isComplete ? " completed" : "");
  card.setAttribute("aria-label", `Day ${entry.day}: ${entry.topic}`);

  // ── Card Header (always visible) ──
  const cardHeader = document.createElement("div");
  cardHeader.className = "day-card-header";
  cardHeader.setAttribute("role", "button");
  cardHeader.setAttribute("tabindex", "0");
  cardHeader.setAttribute("aria-expanded", "false");
  cardHeader.setAttribute("aria-controls", `day-body-${entry.day}`);

  // Checkbox (stops toggle when clicked directly)
  const cbWrap = document.createElement("label");
  cbWrap.className = "day-checkbox-wrap";
  cbWrap.setAttribute("aria-label", `Mark day ${entry.day} complete`);

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.className = "day-checkbox";
  cb.checked = isComplete;
  cb.setAttribute("aria-label", `Day ${entry.day} complete`);
  cb.addEventListener("change", e => {
    e.stopPropagation();   // don't toggle expand
    setFlag(entry.day, cb.checked);
    card.classList.toggle("completed", cb.checked);
    updateProgress();
  });
  cbWrap.appendChild(cb);

  // Day number
  const num = document.createElement("span");
  num.className = "day-num";
  num.textContent = `Day ${String(entry.day).padStart(2, "0")}`;

  // Topic
  const topic = document.createElement("span");
  topic.className = "day-topic";
  topic.textContent = entry.topic;

  // Meta: time + chevron
  const meta = document.createElement("div");
  meta.className = "day-meta";

  const time = document.createElement("span");
  time.className = "day-time";
  time.textContent = entry.time;

  const chevron = document.createElement("svg");
  chevron.setAttribute("width", "14");
  chevron.setAttribute("height", "14");
  chevron.setAttribute("viewBox", "0 0 24 24");
  chevron.setAttribute("fill", "none");
  chevron.setAttribute("stroke", "currentColor");
  chevron.setAttribute("stroke-width", "2.5");
  chevron.setAttribute("aria-hidden", "true");
  chevron.className = "day-chevron";
  chevron.innerHTML = '<polyline points="6 9 12 15 18 9"/>';

  meta.appendChild(time);
  meta.appendChild(chevron);

  cardHeader.appendChild(cbWrap);
  cardHeader.appendChild(num);
  cardHeader.appendChild(topic);
  cardHeader.appendChild(meta);

  // ── Card Body (expandable) ──
  const cardBody = document.createElement("div");
  cardBody.className = "day-card-body";
  cardBody.id = `day-body-${entry.day}`;

  const tasksLabel = document.createElement("div");
  tasksLabel.className = "day-tasks-label";
  tasksLabel.textContent = "Tasks";

  const tasksText = document.createElement("p");
  tasksText.className = "day-tasks-text";
  tasksText.textContent = entry.tasks;

  const badge = document.createElement("span");
  badge.className = "day-complete-badge";
  badge.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Completed`;

  cardBody.appendChild(tasksLabel);
  cardBody.appendChild(tasksText);
  cardBody.appendChild(badge);

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  // ── Toggle expand logic ──
  function toggleCard(e) {
    // Don't toggle if click was on the checkbox or its label
    if (e.target.closest(".day-checkbox-wrap")) return;

    const isOpen = card.classList.toggle("open");
    cardHeader.setAttribute("aria-expanded", String(isOpen));
  }

  cardHeader.addEventListener("click", toggleCard);
  cardHeader.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCard(e);
    }
  });

  return card;
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
/** Recalculates and updates the progress bar and label from current storage. */
function updateProgress() {
  const total = PLAN.length;
  const done  = PLAN.filter(e => getFlag(e.day)).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  progressFill.style.width = pct + "%";
  progressPct.textContent  = pct + "%";
  progressFraction.textContent = `${done} / ${total} days complete`;
  progressTrack.setAttribute("aria-valuenow", pct);
}

// Initial render
updateProgress();

// ─── WEEK QUICK ACTIONS ───────────────────────────────────────────────────────
document.querySelectorAll(".week-btn[data-week]").forEach(btn => {
  btn.addEventListener("click", () => {
    const week = parseInt(btn.dataset.week, 10);
    const start = (week - 1) * 7 + 1;
    const end   = week * 7;

    // Set flags for this week's days
    PLAN.forEach(entry => {
      if (entry.day >= start && entry.day <= end) {
        setFlag(entry.day, true);
        // Update checkbox in DOM
        const cb = document.querySelector(`#day-body-${entry.day}`)
          ?.closest(".day-card")
          ?.querySelector(".day-checkbox");
        if (cb) {
          cb.checked = true;
          cb.closest(".day-card").classList.add("completed");
        }
      }
    });

    updateProgress();
  });
});

// ─── RESET ALL ────────────────────────────────────────────────────────────────
resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all progress? This cannot be undone.")) return;

  PLAN.forEach(entry => {
    setFlag(entry.day, false);
    const cb = document.querySelector(`#day-body-${entry.day}`)
      ?.closest(".day-card")
      ?.querySelector(".day-checkbox");
    if (cb) {
      cb.checked = false;
      cb.closest(".day-card").classList.remove("completed");
    }
  });

  updateProgress();
});

// ─── EXPORT PDF ───────────────────────────────────────────────────────────────
exportBtn.addEventListener("click", () => {
  window.print();
});
