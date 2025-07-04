// Wrap the scroll animation logic in a function that can be called externally
function initScrollAnimations() {
    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // 'null' means the viewport is the root
        rootMargin: '0px', // No margin around the root
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    // Create a new Intersection Observer
    // We create a new observer instance each time initScrollAnimations is called
    // to ensure it observes only the currently loaded elements.
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
    // This will select elements currently in the DOM
    const projectItems = document.querySelectorAll('.github-project-item');

    // For each project item:
    projectItems.forEach(item => {
        // Ensure the element starts hidden for the animation to work on initial load
        item.classList.add('hidden-scroll');
        observer.observe(item);
    });
}

// Call initScrollAnimations once on initial DOMContentLoaded
// This ensures animations work on the first page load.
document.addEventListener('DOMContentLoaded', initScrollAnimations);
