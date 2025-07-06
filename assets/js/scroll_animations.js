// Function to initialize scroll animations for elements with the 'github-project-item' class.
// This function is designed to be called when the DOM is ready and also after new content
// is dynamically loaded (e.g., by spa_loader.js).
function initScrollAnimations() {
    // Define options for the Intersection Observer.
    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    // Create a new Intersection Observer instance.
    const observer = new IntersectionObserver((entries, observer) => {
        // Loop through each entry (each element whose visibility has changed).
        entries.forEach(entry => {
            // If the element is currently intersecting (i.e., visible in the viewport).
            if (entry.isIntersecting) {
                // Remove the "hidden-scroll" class. This will trigger the CSS transition
                // to make the element visible and apply its animation.
                entry.target.classList.remove("hidden-scroll");
                // Stop observing this element, as it has now animated into view.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select ALL elements that should have a scroll animation
    const scrollAnimatedItems = document.querySelectorAll('.github-project-item, .tech-skills-grid div');

    // IMPORTANT CHANGE: Always add the "hidden-scroll" class and observe the items.
    // This ensures that they are initially hidden/transformed and will animate
    // when they truly scroll into the view, even if they were "initially visible"
    // at the moment of content injection.
    scrollAnimatedItems.forEach(item => {
        item.classList.add("hidden-scroll");
        observer.observe(item);
    });
}

// Attach the initScrollAnimations function to the DOMContentLoaded event.
// This ensures the script runs only after the entire HTML document has been loaded and parsed.
document.addEventListener("DOMContentLoaded", initScrollAnimations);
