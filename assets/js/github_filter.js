window.initGithubCategoryFilter = function () {
  const checkboxes = document.querySelectorAll('.filter-controls input[type="checkbox"]');
  const items = document.querySelectorAll('.github-project-item');

  function applyFilters() {
    const activeCategories = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    items.forEach(item => {
      const category = item.getAttribute('data-category');
      item.classList.toggle('hidden', !activeCategories.includes(category));
    });
  }

  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  applyFilters(); // initial run
};
