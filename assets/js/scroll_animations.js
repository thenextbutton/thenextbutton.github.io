document.addEventListener('DOMContentLoaded', () => {
    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // 'null' means the viewport is the root
        rootMargin: '0px', // No margin around the root
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the element is intersecting (in view), remove the hidden class
                entry.target.classList.remove('hidden-scroll');
                // Stop observing the element once it has animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements you want to animate (your GitHub project items)
    const projectItems = document.querySelectorAll('.github-project-item');

    // For each project item:
    projectItems.forEach(item => {
        // Add the hidden-scroll class initially so they start invisible and offset
        item.classList.add('hidden-scroll');
        // Start observing the item
        observer.observe(item);
    });
});
