const searchInput = document.getElementById("searchInput");
const items = Array.from(document.querySelectorAll(".res-item"));
const noResults = document.getElementById("noResults");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  items.forEach(item => {
    const haystack = `${item.dataset.tag} ${item.textContent}`.toLowerCase();
    const matches = haystack.includes(query);
    item.classList.toggle("d-none", !matches);
    if (matches) visibleCount++;
  });

  noResults.classList.toggle("d-none", visibleCount > 0);
});
