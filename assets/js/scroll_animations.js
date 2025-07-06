// Function to initialize scroll animations for elements with the 'github-project-item' class.
// This function is designed to be called when the DOM is ready and also after new content
// is dynamically loaded (e.g., by spa_loader.js).

// Make controlsObserver globally accessible. This needs to be at the top level of the script.
let controlsObserver;

function initScrollAnimations() {
    // Define options for the Intersection Observer.
    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    // Create a new Intersection Observer instance for general scroll animations (e.g., GitHub project items).
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

    // --- MODIFIED PART FOR CONTROL BOX OBSERVER OPTIONS ---
    // Define specific observer options for the bottom-right control box.
    // We're giving it a large rootMargin to make it less sensitive to small movements.
    const controlsObserverOptions = {
        root: null, // Use the viewport as the container
        // IMPORTANT: Increased rootMargin. This effectively makes the "viewport"
        // for this observer much larger, so the control box is considered
        // intersecting even if it's far outside the actual screen edges.
        rootMargin: "0px 0px -99% 0px", // Top, Right, Bottom, Left. -99% means shrink bottom edge significantly.
                                       // This should ensure it's "intersecting" unless truly scrolled far up.
        threshold: 0 // Trigger as soon as any part of the element enters/leaves the expanded root.
    };

    // Create a NEW Intersection Observer instance specifically for the bottom-right control box.
    // Assign it to the global 'controlsObserver' variable.
    controlsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');
            if (!controlsWrapper) return;

            if (entry.isIntersecting) {
                controlsWrapper.classList.remove('fade-out-controls');
                console.log("Controls Observer (Internal): Controls are intersecting, removing fade-out.");
            } else {
                controlsWrapper.classList.add('fade-out-controls');
                console.log("Controls Observer (Internal): Controls are NOT intersecting, adding fade-out.");
            }
        });
    }, controlsObserverOptions); // Use the NEW specific options here

    // Get the control box element and start observing it.
    const controlsWrapperElement = document.querySelector('.bottom-right-controls-wrapper');
    if (controlsWrapperElement) {
        controlsObserver.observe(controlsWrapperElement);
        console.log("Controls Observer (Internal): Now observing the control box.");
    }
    // --- END MODIFIED PART ---
}

document.addEventListener("DOMContentLoaded", initScrollAnimations);