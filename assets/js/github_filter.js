function initGitHubFilter() {
  // Select all the filter buttons and all the project items.
  const filterTagsContainer = document.querySelector('.all-tags');
  const projectItems = document.querySelectorAll('.github-project-item');
  const tags = document.querySelectorAll('.tag');

  // Check if the necessary elements exist before proceeding.
  if (!filterTagsContainer || projectItems.length === 0 || tags.length === 0) {
    console.warn('One or more necessary elements for filtering are missing.');
    return;
  }

  // Use event delegation on the parent container.
  filterTagsContainer.addEventListener('click', (event) => {
    // Check if the clicked element is a filter tag.
    const clickedTag = event.target.closest('.tag');
    if (!clickedTag) {
      return;
    }

    const selectedCategory = clickedTag.dataset.category;

    // Remove the 'active' class from the previously active tag.
    tags.forEach(tag => tag.classList.remove('active'));
    // Add the 'active' class to the newly clicked tag.
    clickedTag.classList.add('active');

    // Loop through all project items and show/hide them based on the category.
    projectItems.forEach(item => {
      const itemCategory = item.dataset.category;
      // If the selected category is 'all' or the item's category matches the selected one, show it.
      if (selectedCategory === 'all' || itemCategory === selectedCategory) {
        item.style.display = 'block'; // Or 'flex' or 'grid' depending on your CSS display property.
      } else {
        item.style.display = 'none';
      }
    });
  });
}
