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
    // Ensure this includes all relevant animated items on your page.
    const scrollAnimatedItems = document.querySelectorAll(".github-project-item, .tech-skills-grid > div");

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

    // --- MODIFIED LOGIC: Make Control Box ALWAYS visible ---
    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');
    if (controlsWrapper) {
        // Ensure the fade-out-controls class is never present, making the control box always visible.
        controlsWrapper.classList.remove('fade-out-controls');
        // No scroll event listener is needed here for the control box, as its visibility is fixed.
    }
    // --- END MODIFIED LOGIC ---
}

document.addEventListener("DOMContentLoaded", initScrollAnimations);