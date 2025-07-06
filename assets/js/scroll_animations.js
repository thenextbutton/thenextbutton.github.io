// Function to initialize scroll animations for elements with the 'github-project-item' class.
// This function is designed to be called when the DOM is ready and also after new content
// is dynamically loaded (e.g., by spa_loader.js).

// Make controlsObserver globally accessible
let controlsObserver;

function initScrollAnimations() {
    // Define options for the Intersection Observer.
    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    // Create a new Intersection Observer instance for general scroll animations.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("hidden-scroll");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Get all elements that should animate on scroll (e.g., GitHub project items).
    const scrollAnimatedItems = document.querySelectorAll(".github-project-item, .tech-skills-grid > div");

    // Initialize visibility and observe items that are not initially visible.
    scrollAnimatedItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isInitiallyVisible = (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0
        );

        if (!isInitiallyVisible) {
            item.classList.add("hidden-scroll");
            observer.observe(item);
        }
    });

    // --- MODIFIED: Specific Observer for the bottom-right control box ---
    // This observer will be accessible via the global 'controlsObserver' variable
    controlsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');
            if (!controlsWrapper) return; // Exit if controls not found

            if (entry.isIntersecting) {
                controlsWrapper.classList.remove('fade-out-controls');
            } else {
                controlsWrapper.classList.add('fade-out-controls');
            }
        });
    }, observerOptions); // Use the same options

    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');
    if (controlsWrapper) {
        controlsObserver.observe(controlsWrapper);
    }
    // --- END MODIFIED PART ---
}

// Attach the initScrollAnimations function to the DOMContentLoaded event.
document.addEventListener("DOMContentLoaded", initScrollAnimations);