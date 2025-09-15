window.initTagFilter = function() {
    const filterButtons = document.querySelectorAll('.tag-filter-btn');
    const projectItems = document.querySelectorAll('.github-project-item');

    filterButtons.forEach(button => {
        // Remove existing listeners to prevent duplicates on subsequent loads
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', () => {
            const selectedTag = newButton.getAttribute('data-tag');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            newButton.classList.add('active');

            projectItems.forEach(item => {
                const tags = item.getAttribute('data-tags').split(',').map(tag => tag.trim());
                if (selectedTag === 'all' || tags.includes(selectedTag)) {
                    item.classList.remove('hidden-by-tag');
                } else {
                    item.classList.add('hidden-by-tag');
                }
            });

            const noProjectsMessage = document.getElementById('no-projects-message');
            const visibleProjects = document.querySelectorAll('.github-project-item:not(.hidden-by-tag)');
            if (visibleProjects.length === 0) {
                if (noProjectsMessage) {
                    noProjectsMessage.style.display = 'block';
                }
            } else {
                if (noProjectsMessage) {
                    noProjectsMessage.style.display = 'none';
                }
            }

            document.body.style.minHeight = document.body.scrollHeight + 'px';
        });
    });

    const initialHash = window.location.hash;
    const initialTag = initialHash.replace('#', '');
    if (initialTag) {
        const initialButton = document.querySelector(`.tag-filter-btn[data-tag="${initialTag}"]`);
        if (initialButton) {
            initialButton.click();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial call on first page load
    window.initTagFilter();
});