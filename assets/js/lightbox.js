/**
 * lightbox.js
 * Handles the functionality for opening and closing a full-screen image lightbox.
 * This script is designed to be reusable across dynamically loaded content.
 */

// Define initLightbox globally or on window to be accessible from spa_loader.js
window.initLightbox = function() {
    // Get references to DOM elements - these should exist in the main index.html
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

    // Ensure lightbox elements exist before proceeding
    if (!lightboxOverlay || !lightboxImage || !lightboxDescription || !lightboxCloseBtn) {
        console.warn('Lightbox elements not found. Lightbox functionality may not work.');
        return;
    }

    /**
     * Opens the lightbox with the specified image and description.
     * @param {string} imgSrc - The source URL of the image to display.
     * @param {string} imgAlt - The alt text of the image, used as a description.
     */
    function openLightbox(imgSrc, imgAlt) {
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt; // Set alt for accessibility and as fallback
        lightboxDescription.textContent = imgAlt || ''; // Display alt text as description, or empty string if no alt

        // Add 'active' class to show the lightbox and 'blur-content' to blur the body
        lightboxOverlay.classList.add('active');
        document.body.classList.add('blur-content');
    }

    /**
     * Closes the lightbox.
     */
    function closeLightbox() {
        // Remove 'active' class to hide the lightbox and 'blur-content' from the body
        lightboxOverlay.classList.remove('active');
        document.body.classList.remove('blur-content');

        // Clear image and description to prevent content flashing on next open
        lightboxImage.src = '';
        lightboxImage.alt = '';
        lightboxDescription.textContent = '';
    }

    // Remove any existing click listeners to prevent duplicates if initLightbox is called multiple times
    // This is crucial for SPA where content is reloaded
    const oldTriggerImages = document.querySelectorAll('.lightbox-trigger-img.listener-added');
    oldTriggerImages.forEach(image => {
        image.removeEventListener('click', image._lightboxClickListener); // Remove by specific listener
        image.classList.remove('listener-added');
    });

    // Get all images that should trigger the lightbox in the currently loaded content.
    const currentLightboxTriggerImages = document.querySelectorAll('.lightbox-trigger-img');

    // Attach click event listeners to all new trigger images
    currentLightboxTriggerImages.forEach(image => {
        // Store the listener function on the element itself to easily remove it later
        image._lightboxClickListener = (event) => {
            event.preventDefault(); // Prevent default link behavior if the image is wrapped in an <a> tag
            const imgSrc = image.src;
            const imgAlt = image.alt;
            openLightbox(imgSrc, imgAlt);
        };
        image.addEventListener('click', image._lightboxClickListener);
        image.classList.add('listener-added'); // Mark that a listener has been added
    });

    // Attach click event listener to the close button (only once, as it's in index.html)
    // We check if a listener has already been added to avoid duplicates
    if (!lightboxCloseBtn._hasClickListener) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxCloseBtn._hasClickListener = true; // Mark that listener is added
    }

    // Attach click event listener to the overlay itself to close when clicking outside the image
    if (!lightboxOverlay._hasClickListener) {
        lightboxOverlay.addEventListener('click', (event) => {
            if (event.target === lightboxOverlay) { // Only close if the click was directly on the overlay
                closeLightbox();
            }
        });
        lightboxOverlay._hasClickListener = true;
    }

    // Close lightbox with Escape key (only once)
    if (!document._hasEscapeListener) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
                closeLightbox();
            }
        });
        document._hasEscapeListener = true;
    }
};

// Initial call to initLightbox when the script loads (for the first page load)
document.addEventListener('DOMContentLoaded', () => {
    window.initLightbox();
});