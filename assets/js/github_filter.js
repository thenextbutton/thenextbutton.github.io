function initGitHubFilter() {
  const filterButtons = document.querySelectorAll('.all-tags .tag');
  const projectItems = document.querySelectorAll('.github-project-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove 'active' class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add 'active' class to the clicked button
      button.classList.add('active');

      const category = button.getAttribute('data-category');

      // Iterate through project items and show/hide based on category
      projectItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}
