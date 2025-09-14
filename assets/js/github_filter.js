window.initGithubCategoryFilter = function () {
  const checkboxes = document.querySelectorAll('.filter-controls input[type="checkbox"]');
  const items = document.querySelectorAll('.github-project-item');

  function applyFilters() {
    const activeCategories = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    items.forEach(item => {
      const category = item.getAttribute('data-category');
      const shouldShow = activeCategories.includes(category);

      if (shouldShow) {
        item.classList.remove('collapsing', 'hidden');
        item.style.display = 'block';

        requestAnimationFrame(() => {
          item.style.maxHeight = '1000px';
          item.style.opacity = '1';
        });
      } else {
        const clone = item.cloneNode(true);
        item.parentNode.replaceChild(clone, item);
        item = clone;

        item.classList.add('collapsing');
        item.style.maxHeight = '0';
        item.style.opacity = '0';

        item.addEventListener('transitionend', () => {
          item.classList.add('hidden');
          item.style.display = 'none';
        }, { once: true });
      }
    });
  }

  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  applyFilters(); // initial run
};
