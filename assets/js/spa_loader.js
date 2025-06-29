document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Function to load content into the content area
    async function loadContent(pageName, pushState = true) {
        try {
            const response = await fetch(`content/${pageName}_content.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            contentArea.innerHTML = content;

            // Re-initialize font controls for the newly loaded content
            // The initFontControls function is defined in font_controls.js
            if (typeof initFontControls === 'function') {
                initFontControls();
            }

            // Update URL in browser history without reloading the page
            if (pushState) {
                // For 'home', use the root path '/'. For others, use '/pagename.html' for clarity.
                const urlPath = pageName === 'home' ? '/' : `${pageName}.html`;
                history.pushState({ page: pageName }, '', urlPath);
            }

            // Optional: Scroll to top of content area for better UX
            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error loading content:', error);
            // Display a user-friendly error message
            contentArea.innerHTML = `<div class="content-column"><p>Error loading content. Please try again later.</p></div>`;
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior (full page reload)
            const pageName = event.target.dataset.page; // Get the page name from data-page attribute
            if (pageName) {
                loadContent(pageName);
            }
        });
    });

    // Handle browser back/forward buttons (popstate event)
    window.addEventListener('popstate', (event) => {
        // If there's state (meaning it's a history entry we pushed), load that page
        if (event.state && event.state.page) {
            loadContent(event.state.page, false); // Don't push state again for popstate
        } else {
            // If popstate is triggered on initial load or no state (e.g., direct URL access), load home
            loadContent('home', false);
        }
    });

    // Load default content on initial page load
    // This checks the current URL path to determine which content to load
    const initialPath = window.location.pathname.split('/').pop();
    let initialPage = 'home'; // Default to home

    if (initialPath && initialPath !== 'index.html' && initialPath !== '') {
        // Extract page name from URL (e.g., 'about_me.html' -> 'about_me')
        initialPage = initialPath.replace('.html', '');
    }
    loadContent(initialPage, false); // Don't push state on initial load
});
