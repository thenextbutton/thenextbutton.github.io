document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Helper function to get the current page name from the URL hash
    function getCurrentPageNameFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            return hash.substring(2).replace('.html', '');
        } else if (hash === '#') {
            return 'home';
        }
        return 'home'; // Default to 'home' if no valid hash
    }

    // Function to load content into the content area with transitions
    async function loadContent(pageName, pushState = true) {
        // 1. Fade out current content (if any)
        const currentContentColumn = contentArea.querySelector('.content-column');
        if (currentContentColumn) {
            currentContentColumn.classList.remove('fade-in'); // Ensure it's not fading in
            // Wait for the fade-out transition to complete before changing content
            await new Promise(resolve => {
                const transitionDuration = parseFloat(getComputedStyle(currentContentColumn).transitionDuration) * 1000;
                setTimeout(resolve, transitionDuration || 0); // Use 0 if no transition or not a number
            });
        }

        try {
            const response = await fetch(`content/${pageName}_content.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            contentArea.innerHTML = content; // Replace content instantly after fade-out

            // 2. Fade in new content
            const newContentColumn = contentArea.querySelector('.content-column');
            if (newContentColumn) {
                // Force reflow to ensure transition starts from initial state
                void newContentColumn.offsetWidth;
                newContentColumn.classList.add('fade-in');
            }

            // Re-initialize font controls for the newly loaded content
            // The initFontControls function is defined in font_controls.js
            if (typeof initFontControls === 'function') {
                initFontControls();
            }

            // Update URL in browser history using hash-based routing
            if (pushState) {
                // For 'home', use the root hash '#/'. For others, use '#/pagename.html'.
                const hashPath = pageName === 'home' ? '#/' : `/#/${pageName}.html`;
                history.pushState({ page: pageName }, '', hashPath);
            }

            // Optional: Scroll to top of content area for better UX
            // Only scroll if it's a user-initiated navigation (not back/forward)
            if (pushState) {
                contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } catch (error) {
            console.error('Error loading content:', error);
            // Display a user-friendly error message
            contentArea.innerHTML = `<div class="content-column fade-in"><p>Error loading content. Please try again later.</p></div>`;
            // Ensure error message also fades in
            const errorMessageColumn = contentArea.querySelector('.content-column');
            if (errorMessageColumn) {
                void errorMessageColumn.offsetWidth; // Trigger reflow
                errorMessageColumn.classList.add('fade-in');
            }
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior (full page reload)
            const pageName = event.target.dataset.page; // Get the page name from data-page attribute
            const currentPage = getCurrentPageNameFromHash();

            // Prevent reloading if already on the same page
            if (pageName && pageName === currentPage) {
                console.log(`Already on ${pageName} page. Not reloading.`);
                return; // Exit the function, preventing reload
            }

            if (pageName) {
                loadContent(pageName);
            }
        });
    });

    // Handle browser back/forward buttons (popstate event)
    window.addEventListener('popstate', (event) => {
        const pageNameFromHash = getCurrentPageNameFromHash();
        loadContent(pageNameFromHash, false); // Don't push state again for popstate
    });

    // Initial page load logic
    // Check if there's a hash in the URL (e.g., from a 404.html redirect or direct hash link)
    const initialPage = getCurrentPageNameFromHash();
    loadContent(initialPage, false); // Don't push state on initial load
});
