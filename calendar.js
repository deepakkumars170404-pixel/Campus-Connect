const START_YEAR = 2026;
const END_YEAR = 2035;
const today = new Date();
let view = new Date(Math.max(START_YEAR, Math.min(END_YEAR, today.getFullYear())), today.getMonth(), 1);
let editingId = null;
let events = JSON.parse(localStorage.getItem('academic-calendar-events') || '[]');

const calendar = document.querySelector('#calendar');
const monthLabel = document.querySelector('#month-label');
const yearSelect = document.querySelector('#year-select');
const eventList = document.querySelector('#event-list');
const emptyState = document.querySelector('#empty-state');
const dialog = document.querySelector('#event-dialog');
const form = document.querySelector('#event-form');
const titleInput = document.querySelector('#event-title');
const dateInput = document.querySelector('#event-date');
const notesInput = document.querySelector('#event-notes');

for (let year = START_YEAR; year <= END_YEAR; year++) yearSelect.add(new Option(year, year));
const iso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const prettyDate = value => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
const save = () => localStorage.setItem('academic-calendar-events', JSON.stringify(events));

function renderCalendar() {
  const year = view.getFullYear(), month = view.getMonth();
  monthLabel.textContent = view.toLocaleDateString(undefined, { month:'long', year:'numeric' });
  yearSelect.value = year;
  document.querySelector('#previous').disabled = year === START_YEAR && month === 0;
  document.querySelector('#next').disabled = year === END_YEAR && month === 11;
  calendar.replaceChildren();
  for (let i = 0; i < new Date(year, month, 1).getDay(); i++) calendar.append(Object.assign(document.createElement('div'), { className:'day blank' }));
  const days = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= days; day++) {
    const date = new Date(year, month, day), key = iso(date), cell = document.createElement('div');
    cell.className = `day${key === iso(today) ? ' today' : ''}`;
    cell.innerHTML = `<span class="day-number">${day}</span>`;
    events.filter(event => event.date === key).forEach(event => {
      const button = document.createElement('button'); button.className = 'day-event'; button.textContent = event.title; button.title = `Edit ${event.title}`;
      button.addEventListener('click', () => openEditor(event)); cell.append(button);
    });
    calendar.append(cell);
  }
}
function renderEvents() {
  const ordered = [...events].sort((a,b) => a.date.localeCompare(b.date));
  emptyState.hidden = ordered.length > 0; eventList.replaceChildren();
  ordered.forEach(event => {
    const item = document.createElement('li'); item.className = 'event-row';
    item.innerHTML = `<span class="event-date">${prettyDate(event.date)}</span><span class="event-content"><strong></strong><small></small></span><button class="delete">Remove</button>`;
    item.querySelector('strong').textContent = event.title; item.querySelector('small').textContent = event.notes || 'No additional notes';
    item.querySelector('.event-content').addEventListener('click', () => openEditor(event));
    item.querySelector('.delete').addEventListener('click', () => { events = events.filter(item => item.id !== event.id); save(); render(); });
    eventList.append(item);
  });
}
function render() { renderCalendar(); renderEvents(); }
function openEditor(event) {
  editingId = event?.id || null; document.querySelector('#dialog-title').textContent = editingId ? 'Edit event' : 'Add event';
  titleInput.value = event?.title || ''; dateInput.value = event?.date || iso(view); notesInput.value = event?.notes || ''; dialog.showModal(); titleInput.focus();
}
document.querySelector('#add-event').addEventListener('click', () => openEditor());
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#cancel').addEventListener('click', () => dialog.close());
document.querySelector('#previous').addEventListener('click', () => { view.setMonth(view.getMonth() - 1); renderCalendar(); });
document.querySelector('#next').addEventListener('click', () => { view.setMonth(view.getMonth() + 1); renderCalendar(); });
document.querySelector('#today').addEventListener('click', () => { view = new Date(Math.max(START_YEAR, Math.min(END_YEAR, today.getFullYear())), today.getMonth(), 1); renderCalendar(); });
yearSelect.addEventListener('change', () => { view.setFullYear(Number(yearSelect.value)); renderCalendar(); });
form.addEventListener('submit', () => { const event = { id: editingId || crypto.randomUUID(), title:titleInput.value.trim(), date:dateInput.value, notes:notesInput.value.trim() }; events = editingId ? events.map(item => item.id === editingId ? event : item) : [...events, event]; save(); dialog.close(); view = new Date(`${event.date}T00:00:00`); view.setDate(1); render(); });
render();
