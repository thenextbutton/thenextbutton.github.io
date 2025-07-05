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

            // Set the hash in the URL without triggering a full page reload
            // This allows direct linking and browser history navigation
            if (!isInitialLoad) {
                window.location.hash = `/${pageName}.html`;
            }

            // Update active class for navigation links
            document.querySelectorAll('.main-nav a').forEach(link => {
                if (link.getAttribute('data-page') === pageName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Show the content area after content is loaded
            contentArea.style.opacity = '1';

            // Re-initialize any scripts that need to run on new content
            // Check if functions exist before calling them
            if (typeof window.initScrollAnimations === 'function') {
                window.initScrollAnimations();
            }
            if (typeof window.initAutoLinker === 'function') {
                window.initAutoLinker();
            }

            // *** IMPORTANT ADDITION HERE ***
            // Call the GitHub last commit update function if on the GitHub page
            if (pageName === 'github' && typeof window.updateNowPageLastCommit === 'function') {
                console.log("[spa_loader.js] Calling window.updateNowPageLastCommit for GitHub page.");
                window.updateNowPageLastCommit();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading page: ${error.message}</p>`;
            contentArea.style.opacity = '1'; // Ensure content area is visible even on error
        }
    }

    /**
     * Extracts the page name from the URL hash.
     * @returns {string} The page name (e.g., 'home', 'about_me', 'github').
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
