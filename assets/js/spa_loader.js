document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    /**
     * Loads content into the main content area with a fade effect.
     * @param {string} url - The URL of the content to load.
     * @param {string} pageName - The name of the page (e.g., 'home', 'about_me').
     * @param {boolean} isInitialLoad - True if this is the initial page load.
     */
    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            // Hide the entire content area before loading new content
            contentArea.style.opacity = '0';
            // Add a small delay to allow the opacity transition to start visually
            await new Promise(resolve => setTimeout(resolve, 100)); // Increased delay slightly for better visual effect

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            let contentColumn = contentArea.querySelector('.content-column');

            // If contentColumn doesn't exist, create it (ensures it's always there)
            if (!contentColumn) {
                contentColumn = document.createElement('div');
                contentColumn.classList.add('content-column');
                contentArea.appendChild(contentColumn);
            }

            // Inject the new content into the contentColumn
            contentColumn.innerHTML = data;

            // Crucially, after content is in the DOM, initialize scroll animations
            // This will add the 'hidden-scroll' class to .github-project-item elements
            // BEFORE the contentArea is made fully visible.
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }
            // Also re-initialize auto-linker for the new content
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }
            // ADD THIS LINE: Call the function to update the last commit date for 'now_content.html'
            if (pageName === 'now' && typeof window.updateNowPageLastCommit === 'function') {
                window.updateNowPageLastCommit();
            }
            // Make the content area visible again
            // The individual github-project-item elements are now correctly hidden by JS
            contentArea.style.opacity = '1';

            // Scroll to the top of the page
            window.scrollTo(0, 0);

            // Update browser history for SPA navigation
            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`;
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
            }

            // Re-initialize other page-specific scripts if they exist
            if (typeof initFontControls === 'function') {
                initFontControls();
            }
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }

            // ADDED: Update active class for navigation links
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                if (navLink.getAttribute('data-page') === pageName) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
            contentArea.style.opacity = '1'; // Ensure content area is visible even on error
        }
    }

    /**
     * Determines the current page name from the URL hash.
     * @returns {string} The name of the current page.
     */
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const pagePart = hash.substring(2); // Remove '#/'
            const pageName = pagePart.split('.')[0]; // Get 'home', 'about_me', 'github'
            return pageName;
        }
        return 'home'; // Default to 'home' if no valid hash
    }

    // Event listeners for navigation links
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const clickedPageData = event.target.getAttribute('data-page');
            const currentPageFromHash = getCurrentPageFromHash();

            // Load content only if clicking on a different page
            if (clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false); // Not initial load
            }
            // The active class is now handled inside loadContent for consistency
        });
    });

    // Initial load of content based on URL hash or default to home
    const initialPage = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, true); // Mark as initial load

    // The active class for the initially loaded page's navigation link is now set by loadContent
});
