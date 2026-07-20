/* =========================================================
   Device theme detection (light / dark)
   The actual color swap is done in styles.css via the
   `prefers-color-scheme` media query, which the browser applies
   automatically and keeps in sync with the OS setting live. This
   listener just keeps the mobile browser chrome color (the
   <meta name="theme-color"> tag) matching, and re-checks whenever
   the device's setting changes without needing a page reload.
   ========================================================= */
function applyThemeColorMeta(isDark) {
  const meta = document.getElementById("themeColorMeta");
  if (meta) meta.setAttribute("content", isDark ? "#1E1C19" : "#F5F4EE");
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
}

function initThemeWatcher() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  applyThemeColorMeta(media.matches);
  // addEventListener is the modern API; addListener is a Safari<14 fallback
  if (media.addEventListener) {
    media.addEventListener("change", (e) => applyThemeColorMeta(e.matches));
  } else if (media.addListener) {
    media.addListener((e) => applyThemeColorMeta(e.matches));
  }
}

/* =========================================================
   Term 3 Weighted Assessment data (from the school schedule)
   Dates are ISO strings for the fixed test weeks. English's
   two performance tasks (Weeks 1-4) don't have exact printed
   dates, so they're treated as a flexible early deadline.
   ========================================================= */
const TESTS = [
  // Weeks 1-4 - flexible, no fixed date printed
  { subject: "English", level: "G3", topic: "Podcast Project (Alternative Assessment)", marks: 15, format: "Performance Task", flexible: true, weekLabel: "Weeks 1–4" },
  { subject: "English", level: "G2", topic: "Podcast Project (Alternative Assessment)", marks: 15, format: "Performance Task", flexible: true, weekLabel: "Weeks 1–4" },
  { subject: "English", level: "G1", topic: "Oral Personal Recount Task (Alternative Assessment)", marks: 25, format: "Performance Task", flexible: true, weekLabel: "Weeks 1–4" },

  // Week 6: 03/08 - 07/08/2026
  { subject: "History", level: "G3", topic: "Source-based & structured-question skills — Ch.7 People's Reaction to British Rule post-WWII", marks: 22, format: "Written Test", start: "2026-08-03", end: "2026-08-07", weekLabel: "Week 6" },
  { subject: "History", level: "G2", topic: "Source-based & structured-question skills — Ch.7 People's Reaction to British Rule post-WWII", marks: 23, format: "Written Test", start: "2026-08-03", end: "2026-08-07", weekLabel: "Week 6" },

  // Week 7: 10/08 - 14/08/2026
  { subject: "Mathematics", level: "G3", topic: "Ch.6 Algebraic Fractions, Ch.7 Direct & Inverse Proportion, Ch.8 Congruence & Similarity, Ch.9 Pythagoras' Thm, Ch.10 Trig Ratios", marks: 30, format: "Written Test", start: "2026-08-10", end: "2026-08-14", weekLabel: "Week 7" },
  { subject: "Mathematics", level: "G2", topic: "Ch.6 Algebraic Fractions, Ch.7 Direct & Inverse Proportion, Ch.8 Polygons & Constructions, Ch.9 Congruence & Similarity, Ch.10 Pythagoras' Thm", marks: 30, format: "Written Test", start: "2026-08-10", end: "2026-08-14", weekLabel: "Week 7" },
  { subject: "Mathematics", level: "G1", topic: "Ch.7 Maths in Practical Situations, Ch.8 Congruence & Similarity, Ch.9 Pythagoras' Theorem", marks: 25, format: "Written Test", start: "2026-08-10", end: "2026-08-14", weekLabel: "Week 7" },
  { subject: "Geography", level: "G3", topic: "Structured Questions — Ch.6 Forests, Ch.10.1-10.2 Transport", marks: 20, format: "Written Test", start: "2026-08-10", end: "2026-08-14", weekLabel: "Week 7" },
  { subject: "Geography", level: "G2", topic: "Structured Questions — Ch.6 Forests, Ch.10.1-10.2 Transport", marks: 20, format: "Written Test", start: "2026-08-10", end: "2026-08-14", weekLabel: "Week 7" },

  // Week 8: 17/08 - 21/08/2026
  { subject: "Science", level: "G3", topic: "Ch.16 Human Sexual Reproductive System, Ch.13 Electrical System", marks: 30, format: "Written Test", start: "2026-08-17", end: "2026-08-21", weekLabel: "Week 8" },
  { subject: "Science", level: "G2", topic: "Ch.16 Human Sexual Reproductive System, Ch.13 Electrical System", marks: 25, format: "Written Test", start: "2026-08-17", end: "2026-08-21", weekLabel: "Week 8" },
  { subject: "Science", level: "G1", topic: "Topic 11 Human Reproduction, Topic 12 Taking Good Care of My Body", marks: 25, format: "Written Test", start: "2026-08-17", end: "2026-08-21", weekLabel: "Week 8" },
  { subject: "Literature", level: "G3", topic: "Essay: Unseen Poetry", marks: 25, format: "Written Test", start: "2026-08-17", end: "2026-08-21", weekLabel: "Week 8" },
  { subject: "Literature", level: "G2", topic: "Essay: Unseen Poetry", marks: 25, format: "Written Test", start: "2026-08-17", end: "2026-08-21", weekLabel: "Week 8" },

  // Week 9: 24/08 - 28/08/2026
  { subject: "Mother Tongue", level: "G3", mtType: "Higher", lang: "CL", topic: "P2 Language Usage Components: Ch.3 & 4", marks: 50, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G3", mtType: "Higher", lang: "TL", topic: "P2 Language Usage and Comprehension", marks: 40, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G3", mtType: "Higher", lang: "ML", topic: "Paper 2: Section B, C2 & D (Language Use, Objective Comprehension & Summary Writing)", marks: 40, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G3", mtType: "Standard", lang: "CL", topic: "P2 Language Usage and Comprehension: Ch.3 & 4", marks: 50, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G2", mtType: "Standard", lang: "CL", topic: "P2 Components (Comprehension passage): Vocabulary Unit 3 & 4", marks: 50, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G1", mtType: "Standard", lang: "CL", topic: "P2 Language Usage and Comprehension", marks: 25, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G3", mtType: "Standard", lang: "ML", topic: "Paper 2: Section B1 & C (Language & Subjective Comprehension)", marks: 40, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G2", mtType: "Standard", lang: "ML", topic: "Paper 2: Section B1 & C (Language & Subjective Comprehension)", marks: 40, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G1", mtType: "Standard", lang: "ML", topic: "Reading Aloud & Listening Comprehension", marks: 35, format: "Performance Task + Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G3", mtType: "Standard", lang: "TL", topic: "P2 Language Usage and Comprehension", marks: 40, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G2", mtType: "Standard", lang: "TL", topic: "P2 Language Usage and Comprehension", marks: 40, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
  { subject: "Mother Tongue", level: "G1", mtType: "Standard", lang: "TL", topic: "P2 Language Usage and Comprehension", marks: 25, format: "Written Test", start: "2026-08-24", end: "2026-08-28", weekLabel: "Week 9" },
];

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const LAST_TEST_DATE = "2026-08-28";

/* ---------- storage helpers ---------- */
const LS_KEY_COMMIT = "sp_commitments";
const LS_KEY_SETTINGS = "sp_settings";

function loadCommitments() {
  try { return JSON.parse(localStorage.getItem(LS_KEY_COMMIT)) || []; }
  catch (e) { return []; }
}
function saveCommitments(list) {
  localStorage.setItem(LS_KEY_COMMIT, JSON.stringify(list));
}
function loadSettings() {
  const defaults = {
    band: "G3", mtLang: "none", mtHigher: false,
    weekdayStart: "17:30", weekdayEnd: "21:30",
    weekendStart: "09:30", weekendEnd: "18:00"
  };
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY_SETTINGS));
    return Object.assign(defaults, saved || {});
  } catch (e) { return defaults; }
}
function saveSettings(s) {
  localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(s));
}

/* ---------- date helpers ---------- */
function toDate(iso) { const [y,m,d] = iso.split("-").map(Number); return new Date(y, m-1, d); }
function isoOf(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function addDays(d, n) { const nd = new Date(d); nd.setDate(nd.getDate()+n); return nd; }
function timeToMinutes(t) { const [h,m] = t.split(":").map(Number); return h*60+m; }
function minutesToTime(mins) { const h = Math.floor(mins/60), m = mins%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`; }
function fmtTime12(t) {
  const [h,m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2,"0")} ${period}`;
}

/* ---------- filter tests by student's settings ---------- */
function relevantTests(settings) {
  const out = [];
  TESTS.forEach(t => {
    if (t.subject === "Mother Tongue") {
      if (settings.mtLang === "none") return;
      if (settings.mtHigher) {
        if (t.mtType === "Higher" && t.lang === settings.mtLang) out.push(t);
      } else {
        if (t.mtType === "Standard" && t.lang === settings.mtLang && t.level === settings.band) out.push(t);
      }
      return;
    }
    if (t.level === "CMN") { out.push(t); return; }
    if (t.level === settings.band) out.push(t);
  });
  return out;
}

/* ---------- build one entry per subject with its test date & weight ---------- */
function subjectTimeline(tests, planStart) {
  const bySubject = {};
  tests.forEach(t => {
    const key = t.subject;
    if (!bySubject[key]) {
      bySubject[key] = { subject: key, marks: 0, topics: [], format: t.format, flexible: false, testDate: null };
    }
    bySubject[key].marks += t.marks;
    bySubject[key].topics.push(t.topic);
    if (t.flexible) {
      bySubject[key].flexible = true;
    } else if (t.start) {
      const d = toDate(t.start);
      if (!bySubject[key].testDate || d < bySubject[key].testDate) bySubject[key].testDate = d;
      bySubject[key].testStart = t.start;
      bySubject[key].testEnd = t.end;
    }
  });
  // flexible subjects (English) get a soft deadline: 10 days after plan start,
  // capped to before the first hard test date, whichever is earlier.
  const firstHard = Object.values(bySubject)
    .filter(s => s.testDate)
    .map(s => s.testDate)
    .sort((a,b) => a-b)[0];
  Object.values(bySubject).forEach(s => {
    if (s.flexible && !s.testDate) {
      const soft = addDays(planStart, 10);
      s.testDate = firstHard && firstHard < soft ? addDays(firstHard, -1) : soft;
      s.testStart = isoOf(s.testDate);
      s.testEnd = s.testStart;
    }
  });
  return Object.values(bySubject);
}

/* ---------- expand commitments into concrete busy intervals for a date ---------- */
function commitmentsForDate(commitments, dateObj) {
  const iso = isoOf(dateObj);
  const dow = dateObj.getDay();
  return commitments.filter(c => {
    if (c.day === "once") return c.date === iso;
    return Number(c.day) === dow;
  }).map(c => ({
    label: c.label, type: c.type,
    startMin: timeToMinutes(c.start),
    endMin: timeToMinutes(c.start) + Number(c.duration)
  }));
}

/* ---------- build the free study slots for a day, minus commitments ---------- */
function freeIntervalsForDay(dateObj, settings, commitments) {
  const dow = dateObj.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const winStart = timeToMinutes(isWeekend ? settings.weekendStart : settings.weekdayStart);
  const winEnd = timeToMinutes(isWeekend ? settings.weekendEnd : settings.weekdayEnd);
  let intervals = [{ start: winStart, end: winEnd }];
  const busy = commitmentsForDate(commitments, dateObj).sort((a,b) => a.startMin - b.startMin);

  busy.forEach(b => {
    const next = [];
    intervals.forEach(iv => {
      if (b.endMin <= iv.start || b.startMin >= iv.end) { next.push(iv); return; }
      if (b.startMin > iv.start) next.push({ start: iv.start, end: Math.min(b.startMin, iv.end) });
      if (b.endMin < iv.end) next.push({ start: Math.max(b.endMin, iv.start), end: iv.end });
    });
    intervals = next.filter(iv => iv.end - iv.start >= 15);
  });
  return intervals;
}

/* ---------- split free intervals into 45-min study + 10-min break chunks ---------- */
function chunkInterval(iv) {
  const blocks = [];
  let cursor = iv.start;
  while (cursor + 30 <= iv.end) {
    const studyLen = Math.min(45, iv.end - cursor);
    blocks.push({ type: "study", start: cursor, end: cursor + studyLen });
    cursor += studyLen;
    if (cursor + 10 <= iv.end && cursor + 30 <= iv.end + 10) {
      blocks.push({ type: "break", start: cursor, end: cursor + 10 });
      cursor += 10;
    } else break;
  }
  return blocks;
}

/* ---------- weighted round-robin subject picker ---------- */
function makeSubjectPicker(subjects) {
  const counters = {};
  subjects.forEach(s => counters[s.subject] = 0);
  return function pick(activeList) {
    if (activeList.length === 0) return null;
    activeList.forEach(s => counters[s.subject] += s._weight);
    let best = activeList[0];
    activeList.forEach(s => { if (counters[s.subject] > counters[best.subject]) best = s; });
    counters[best.subject] -= activeList.reduce((sum, s) => sum + s._weight, 0);
    return best;
  };
}

/* ---------- MAIN generator ---------- */
function generateSchedule(settings, commitments) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const lastDay = toDate(LAST_TEST_DATE);
  if (today > lastDay) return { done: true };

  const tests = relevantTests(settings);
  const subjects = subjectTimeline(tests, today);

  // urgency weight recalculated per day inside the loop
  const pick = makeSubjectPicker(subjects);

  const days = [];
  for (let d = new Date(today); d <= lastDay; d = addDays(d, 1)) {
    days.push(new Date(d));
  }

  const testsByDate = {}; // iso -> [subjectNames]
  tests.forEach(t => {
    if (t.flexible) return;
    const s = toDate(t.start), e = toDate(t.end);
    for (let d = new Date(s); d <= e; d = addDays(d,1)) {
      const iso = isoOf(d);
      testsByDate[iso] = testsByDate[iso] || [];
      testsByDate[iso].push(t.subject + (t.lang ? " ("+t.lang+")" : "") + " — " + t.format);
    }
  });
  // add English flexible deadline day
  subjects.filter(s => s.flexible).forEach(s => {
    const iso = isoOf(s.testDate);
    testsByDate[iso] = testsByDate[iso] || [];
    testsByDate[iso].push(s.subject + " — deliverable due");
  });

  const dayPlans = days.map(dateObj => {
    const iso = isoOf(dateObj);
    const dow = dateObj.getDay();
    const isSunday = dow === 0;

    // which subjects are still "in play" (test window not yet fully passed)
    const active = subjects.filter(s => toDate(s.testEnd) >= dateObj);
    active.forEach(s => {
      const daysUntil = Math.round((s.testDate - dateObj) / 86400000);
      let urgency = 1;
      if (daysUntil <= 1) urgency = 4;
      else if (daysUntil <= 3) urgency = 2.6;
      else if (daysUntil <= 7) urgency = 1.6;
      s._weight = (s.marks / 10) * urgency;
    });

    const freeIntervals = freeIntervalsForDay(dateObj, settings, commitments);
    let blocks = [];

    // commitments as blocks
    commitmentsForDate(commitments, dateObj).forEach(c => {
      blocks.push({ kind: "commit", start: c.startMin, end: c.endMin, label: c.label, type: c.type });
    });

    if (isSunday) {
      // light day: only first free interval, one 30-min light review block
      if (freeIntervals.length && active.length) {
        const iv = freeIntervals[0];
        const len = Math.min(30, iv.end - iv.start);
        const subj = pick(active);
        if (subj) blocks.push({ kind: "rest", start: iv.start, end: iv.start+len, label: `Light review — ${subj.subject}` });
      }
    } else {
      freeIntervals.forEach(iv => {
        chunkInterval(iv).forEach(chunk => {
          if (chunk.type === "break") {
            blocks.push({ kind: "break", start: chunk.start, end: chunk.end, label: "Break" });
          } else {
            const subj = pick(active);
            if (subj) {
              blocks.push({ kind: "study", start: chunk.start, end: chunk.end, label: `${subj.subject}`, sub: subjectFocusNote(subj, dateObj) });
            }
          }
        });
      });
    }

    // test banner
    const testLabels = testsByDate[iso] || [];

    blocks.sort((a,b) => a.start - b.start);
    return { dateObj, dow, iso, blocks, testLabels };
  });

  return { done: false, dayPlans };
}

function subjectFocusNote(subj, dateObj) {
  const daysUntil = Math.round((subj.testDate - dateObj) / 86400000);
  if (daysUntil <= 1) return "final review";
  if (daysUntil <= 3) return "practice questions";
  if (daysUntil <= 7) return "revise weaker topics";
  return "work through notes";
}

/* ============================ RENDERING ============================ */

function renderToday() {
  const el = document.getElementById("todayChip");
  const now = new Date();
  el.textContent = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function renderCommitList(commitments) {
  const ul = document.getElementById("commitList");
  ul.innerHTML = "";
  if (commitments.length === 0) {
    ul.innerHTML = `<li class="commit-empty" style="border:none;background:none;">No commitments added yet.</li>`;
    return;
  }
  commitments.forEach(c => {
    const li = document.createElement("li");
    const when = c.day === "once" ? c.date : "Every " + DAY_NAMES[Number(c.day)];
    li.innerHTML = `
      <div>
        <div>${escapeHtml(c.label)}</div>
        <div class="ci-meta">${when} · ${fmtTime12(c.start)} · ${c.duration} min</div>
      </div>
      <button data-id="${c.id}">Remove</button>
    `;
    ul.appendChild(li);
  });
  ul.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const updated = loadCommitments().filter(c => String(c.id) !== id);
      saveCommitments(updated);
      renderCommitList(updated);
      refreshSchedule();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function blockClass(kind) {
  return { study: "block-study", break: "block-break", commit: "block-commit", rest: "block-rest" }[kind] || "block-study";
}

function renderSchedule(result) {
  const container = document.getElementById("scheduleOutput");
  container.innerHTML = "";

  if (result.done) {
    container.innerHTML = `<div class="card"><p>All Term 3 weighted assessments (up to 28 Aug) have passed. Nice work getting through them!</p></div>`;
    return;
  }

  // group by ISO week (Mon-Sun), label using the school's week numbers where possible
  let currentWeekKey = null;
  let weekWrap = null;

  result.dayPlans.forEach(day => {
    const monday = addDays(day.dateObj, day.dow === 0 ? -6 : 1 - day.dow);
    const weekKey = isoOf(monday);
    if (weekKey !== currentWeekKey) {
      currentWeekKey = weekKey;
      weekWrap = document.createElement("div");
      weekWrap.className = "week-group";
      const h3 = document.createElement("h3");
      const sunday = addDays(monday, 6);
      h3.textContent = `Week of ${monday.toLocaleDateString(undefined,{month:"short",day:"numeric"})} – ${sunday.toLocaleDateString(undefined,{month:"short",day:"numeric"})}`;
      weekWrap.appendChild(h3);
      container.appendChild(weekWrap);
    }

    const card = document.createElement("div");
    card.className = "day-card" + (day.testLabels.length ? " is-test" : "");

    const head = document.createElement("div");
    head.className = "day-card-head";
    head.innerHTML = `<span class="day-name">${DAY_NAMES[day.dow]}</span><span class="day-date">${day.dateObj.toLocaleDateString(undefined,{month:"short",day:"numeric"})}</span>`;
    card.appendChild(head);

    const blocksWrap = document.createElement("div");
    blocksWrap.className = "blocks";

    if (day.testLabels.length) {
      const tb = document.createElement("div");
      tb.className = "block block-test";
      tb.innerHTML = `<span class="block-time">Today</span><span>📝 ${day.testLabels.map(escapeHtml).join(" · ")}</span>`;
      blocksWrap.appendChild(tb);
    }

    if (day.blocks.length === 0 && day.testLabels.length === 0) {
      const note = document.createElement("div");
      note.className = "empty-note";
      note.textContent = "Free — no study blocks fit around your commitments today.";
      blocksWrap.appendChild(note);
    }

    day.blocks.forEach(b => {
      const div = document.createElement("div");
      div.className = "block " + blockClass(b.kind);
      const timeLabel = `${fmtTime12(minutesToTime(b.start))}–${fmtTime12(minutesToTime(b.end))}`;
      const label = b.kind === "study" ? `${escapeHtml(b.label)} <span style="color:var(--ink-soft); font-weight:400;">(${escapeHtml(b.sub)})</span>` : escapeHtml(b.label);
      div.innerHTML = `<span class="block-time">${timeLabel}</span><span>${label}</span>`;
      blocksWrap.appendChild(div);
    });

    card.appendChild(blocksWrap);
    weekWrap.appendChild(card);
  });
}

function renderReferenceTable(settings) {
  const tests = relevantTests(settings);
  const rows = tests.map(t => `
    <tr>
      <td>${t.weekLabel}</td>
      <td>${escapeHtml(t.subject)}${t.lang ? " ("+t.lang+(t.mtType==="Higher"?", Higher":"")+")" : ""}</td>
      <td>${escapeHtml(t.topic)}</td>
      <td>${t.marks}</td>
      <td>${escapeHtml(t.format)}</td>
    </tr>
  `).join("");
  document.getElementById("referenceTable").innerHTML = `
    <table>
      <thead><tr><th>Week</th><th>Subject</th><th>Topic / Skills</th><th>Marks</th><th>Format</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/* ============================ WIRING ============================ */

function readSettingsFromForm() {
  return {
    band: document.getElementById("bandSelect").value,
    mtLang: document.getElementById("mtLang").value,
    mtHigher: document.getElementById("mtHigher").checked,
    weekdayStart: document.getElementById("weekdayStart").value,
    weekdayEnd: document.getElementById("weekdayEnd").value,
    weekendStart: document.getElementById("weekendStart").value,
    weekendEnd: document.getElementById("weekendEnd").value,
  };
}

function applySettingsToForm(s) {
  document.getElementById("bandSelect").value = s.band;
  document.getElementById("mtLang").value = s.mtLang;
  document.getElementById("mtHigher").checked = s.mtHigher;
  document.getElementById("weekdayStart").value = s.weekdayStart;
  document.getElementById("weekdayEnd").value = s.weekdayEnd;
  document.getElementById("weekendStart").value = s.weekendStart;
  document.getElementById("weekendEnd").value = s.weekendEnd;
}

function refreshSchedule() {
  const settings = readSettingsFromForm();
  saveSettings(settings);
  const commitments = loadCommitments();
  const result = generateSchedule(settings, commitments);
  renderSchedule(result);
  renderReferenceTable(settings);
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeWatcher();
  renderToday();
  applySettingsToForm(loadSettings());
  renderCommitList(loadCommitments());
  refreshSchedule();

  document.getElementById("regenBtn").addEventListener("click", refreshSchedule);
  ["bandSelect","mtLang","mtHigher"].forEach(id => {
    document.getElementById(id).addEventListener("change", refreshSchedule);
  });

  document.getElementById("cDay").addEventListener("change", (e) => {
    document.getElementById("onceDateField").style.display = e.target.value === "once" ? "flex" : "none";
  });

  document.getElementById("commitForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const day = document.getElementById("cDay").value;
    const entry = {
      id: Date.now(),
      label: document.getElementById("cLabel").value.trim() || "Commitment",
      type: document.getElementById("cType").value,
      day: day,
      date: day === "once" ? document.getElementById("cDate").value : null,
      start: document.getElementById("cStart").value,
      duration: document.getElementById("cDuration").value,
    };
    if (day === "once" && !entry.date) { alert("Please pick a date for a one-off commitment."); return; }
    const list = loadCommitments();
    list.push(entry);
    saveCommitments(list);
    renderCommitList(list);
    refreshSchedule();
    e.target.reset();
    document.getElementById("cStart").value = "17:00";
    document.getElementById("cDuration").value = "60";
    document.getElementById("onceDateField").style.display = "none";
  });
});
