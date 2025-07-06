// Function to initialize scroll animations for elements with the 'github-project-item' class.
// This function is designed to be called when the DOM is ready and also after new content
// is dynamically loaded (e.g., by spa_loader.js).
function initScrollAnimations() {
    // Define options for the Intersection Observer.
    // 'root: null' means the viewport is used as the observing root.
    // 'rootMargin: "0px"' means no extra margin around the root.
    // 'threshold: 0.1' means the callback will fire when 10% of the target element
    // is visible within the root.
    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    // Create a new Intersection Observer instance.
    // The callback function will be executed when a target element's visibility changes.
    const observer = new IntersectionObserver((entries, observer) => {
        // Loop through each entry (each element whose visibility has changed).
        entries.forEach(entry => {
            // If the element is currently intersecting (i.e., visible in the viewport).
            if (entry.isIntersecting) {
                // Remove the "hidden-scroll" class. This will trigger the CSS transition
                // to make the element visible and apply its animation.
                entry.target.classList.remove("hidden-scroll");
                // Stop observing this element, as it has already animated into view.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions); // Pass the defined options to the observer.

    // Select all elements that are intended to have the scroll animation.
    const scrollAnimatedItems = document.querySelectorAll(".github-project-item, .tech-skills-grid div"); // Including tech-skills-grid div as per initial analysis

    // Iterate over each selected item.
    scrollAnimatedItems.forEach(item => {
        // Get the size and position of the element relative to the viewport.
        const rect = item.getBoundingClientRect();

        // Determine if the item is initially visible in the viewport when the page loads.
        // It's considered visible if its top edge is above the bottom of the viewport
        // and its bottom edge is below the top of the viewport.
        const isInitiallyVisible = (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0
        );

        // If the item is NOT initially visible in the viewport.
        if (!isInitiallyVisible) {
            // Add the "hidden-scroll" class. This class (defined in style.css)
            // will make the element transparent and potentially apply a transform
            // to prepare it for the animation.
            item.classList.add("hidden-scroll");
            // Start observing this item. The observer will detect when it scrolls into view.
            observer.observe(item);
        }
        // If the item IS initially visible, we do nothing. It will load immediately
        // without the fade-in animation, as per the user's request.
    });
}

// Attach the initScrollAnimations function to the DOMContentLoaded event.
// This ensures the script runs only after the entire HTML document has been loaded and parsed.
document.addEventListener("DOMContentLoaded", initScrollAnimations);
