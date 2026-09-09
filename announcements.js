const defaults = [
  { id: 1, category: "placement", tagLabel: "💼 Placement", title: "Placement Drive",
    body: "A campus recruitment drive will be conducted soon. Interested students should register before the deadline.",
    date: "September 1, 2026" },
  { id: 2, category: "events", tagLabel: "🎉 Events", title: "Cultural Event",
    body: "Students can participate in various cultural programs. Registration is now open.",
    date: "September 2, 2026" },
  { id: 3, category: "aptitude", tagLabel: "🧠 Aptitude Test", title: "Weekly Aptitude Test",
    body: "The aptitude test will be conducted for final-year students. Students are requested to attend on time.",
    date: "September 3, 2026" },
  { id: 4, category: "holidays", tagLabel: "🏖️ Holidays", title: "Holiday Announcement",
    body: "The college will remain closed due to a public holiday. Regular classes will resume the following day.",
    date: "September 4, 2026" },
  { id: 5, category: "academic", tagLabel: "📚 Academic Updates", title: "Schedule Update",
    body: "Students are informed about the updated class schedule for the upcoming academic week.",
    date: "September 5, 2026" },
  { id: 6, category: "notice", tagLabel: "📌 Important Notices", title: "Important Information for Students",
    body: "All students are requested to regularly check the Campus Connect portal for important updates.",
    date: "September 6, 2026" }
];

const categoryLabels = {
  placement: "💼 Placement",
  events: "🎉 Events",
  aptitude: "🧠 Aptitude Test",
  holidays: "🏖️ Holidays",
  academic: "📚 Academic Updates",
  notice: "📌 Important Notices"
};

const KEY = "campusConnectAnnouncements_v1";
let announcements = load();
let activeFilter = "all";
let editingId = null;

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch (e) {}
  return structuredClone(defaults);
}
function save() { localStorage.setItem(KEY, JSON.stringify(announcements)); }
function esc(v) { return String(v).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }
function todayLabel() { return new Date().toLocaleDateString(undefined, { month:"long", day:"numeric", year:"numeric" }); }

const grid = document.getElementById("announcementGrid");
const emptyState = document.getElementById("emptyState");
const categoriesBar = document.getElementById("categories");

function render() {
  const list = activeFilter === "all"
    ? announcements
    : announcements.filter(a => a.category === activeFilter);

  grid.innerHTML = list.map(a => `
    <div class="card" data-category="${a.category}">
      <span class="tag">${a.tagLabel}</span>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.body)}</p>
      <div class="date">📅 Posted: ${esc(a.date)}</div>
      <div class="card-buttons">
        <button type="button" class="edit-btn" data-id="${a.id}">✏️ Edit</button>
      </div>
    </div>`).join("");

  emptyState.hidden = list.length > 0;

  grid.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => openEditor(Number(btn.dataset.id)));
  });
}

categoriesBar.addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  categoriesBar.querySelectorAll(".cat-btn").forEach(b => b.classList.toggle("active", b === btn));
  render();
});

const dialog = document.getElementById("announceDialog");
const form = document.getElementById("announceForm");
const dialogTitle = document.getElementById("dialogTitle");
const submitBtn = document.getElementById("submitBtn");
const fTitle = document.getElementById("fTitle");
const fCategory = document.getElementById("fCategory");
const fBody = document.getElementById("fBody");

function openAdder() {
  editingId = null;
  dialogTitle.textContent = "Add Announcement";
  submitBtn.textContent = "Add";
  form.reset();
  dialog.showModal();
  fTitle.focus();
}
function openEditor(id) {
  const a = announcements.find(x => x.id === id);
  if (!a) return;
  editingId = id;
  dialogTitle.textContent = "Edit Announcement";
  submitBtn.textContent = "Save Changes";
  fTitle.value = a.title;
  fCategory.value = a.category;
  fBody.value = a.body;
  dialog.showModal();
  fTitle.focus();
}

document.getElementById("openAdd").addEventListener("click", openAdder);
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
document.getElementById("cancelDialog").addEventListener("click", () => dialog.close());

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    category: fCategory.value,
    tagLabel: categoryLabels[fCategory.value],
    title: fTitle.value.trim(),
    body: fBody.value.trim()
  };
  if (editingId) {
    const a = announcements.find(x => x.id === editingId);
    if (a) Object.assign(a, data);
  } else {
    announcements.push({ id: Date.now(), date: todayLabel(), ...data });
  }
  save();
  dialog.close();
  render();
});

render();
