const filterTags = document.querySelectorAll('.all-tags .tag');
const projectItems = document.querySelectorAll('.github-project-item');

filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const category = tag.getAttribute('data-category');

        // Update active state of tags
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');

        projectItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                // Show the item
                item.style.display = ''; // Reset display to default (e.g., 'block' or 'grid-item')
                setTimeout(() => {
                    item.classList.remove('hidden');
                }, 10); // A small delay to allow the browser to register the display change before starting the animation
            } else {
                // Hide the item
                item.classList.add('hidden');
                // Wait for the transition to finish, then set display to none
                item.addEventListener('transitionend', function handler(event) {
                    if (event.propertyName === 'opacity' && item.classList.contains('hidden')) {
                        item.style.display = 'none';
                        item.removeEventListener('transitionend', handler);
                    }
                });
            }
        });
    });
});