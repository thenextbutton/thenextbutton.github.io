// Function to initialize scroll animations for elements with the 'github-project-item' class.
// This function is designed to be called when the DOM is ready and also after new content
// is dynamically loaded (e.g., by spa_loader.js).

function initScrollAnimations() {
    // Define options for the Intersection Observer for general scroll animations.
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

    // Select all elements that are intended to have the scroll animation.
    const scrollAnimatedItems = document.querySelectorAll(".github-project-item, .tech-skills-grid > div");

    // --- MODIFIED LOGIC HERE ---
    // Forcibly add 'hidden-scroll' to ALL relevant items.
    // The IntersectionObserver will then remove it when they come into view.
    scrollAnimatedItems.forEach(item => {
        item.classList.add("hidden-scroll");
        observer.observe(item);
    });
    // --- END MODIFIED LOGIC ---

    // --- Control Box Always Visible Logic ---
    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');
    if (controlsWrapper) {
        controlsWrapper.classList.remove('fade-out-controls');
    }
    // --- END Control Box Always Visible Logic ---
}

// Attach the initScrollAnimations function to the DOMContentLoaded event for initial page load.
document.addEventListener("DOMContentLoaded", initScrollAnimations);