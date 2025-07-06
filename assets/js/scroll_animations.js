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

    // --- NEW LOGIC: Manage Control Box Visibility based on scroll position ---
    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');
    if (!controlsWrapper) return; // Exit if controls not found

    const scrollThreshold = 100; // Number of pixels from the top to hide/show

    // Function to update the control box visibility
    function updateControlsVisibility() {
        console.log("updateControlsVisibility called!"); // Log when this function runs
        const currentScrollY = window.scrollY;
        console.log(`Current ScrollY: ${currentScrollY}`); // Log current scroll position

        // If scrolled down past the threshold
        if (currentScrollY > scrollThreshold) {
            controlsWrapper.classList.remove('fade-out-controls');
            console.log("Controls: Removing fade-out-controls (scrolled down).");
        } else {
            // If at the very top of the page (or within threshold)
            controlsWrapper.classList.add('fade-out-controls');
            console.log("Controls: Adding fade-out-controls (at top or within threshold).");
        }
    }

    // Attach the updateControlsVisibility function to the scroll event
    window.addEventListener('scroll', updateControlsVisibility);

    // Also call it once on load to set initial state
    updateControlsVisibility();
    // --- END NEW LOGIC ---
}

document.addEventListener("DOMContentLoaded", initScrollAnimations);