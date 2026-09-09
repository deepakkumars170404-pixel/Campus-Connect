const KEY = "campusConnectEventRegistrations";
let registered = load();

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(stored)) return stored;
  } catch (e) {}
  return [];
}
function save() { localStorage.setItem(KEY, JSON.stringify(registered)); }

function paintButton(btn, eventName) {
  const isRegistered = registered.includes(eventName);
  btn.textContent = isRegistered ? "✓ Registered" : "Register";
  btn.classList.toggle("registered", isRegistered);
}

document.querySelectorAll(".event-card").forEach(card => {
  const eventName = card.dataset.event;
  const btn = card.querySelector(".register-btn");
  paintButton(btn, eventName);

  btn.addEventListener("click", () => {
    if (registered.includes(eventName)) return;
    registered.push(eventName);
    save();
    paintButton(btn, eventName);
    alert("Successfully registered for " + eventName + "!");
  });
});
