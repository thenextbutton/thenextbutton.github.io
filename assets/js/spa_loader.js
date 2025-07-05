document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    /**
     * Loads content into the main content area with a fade effect.
     * @param {string} url - The URL of the content to load.
     * @param {string} pageName - The name of the page (e.g., 'home', 'about_me', 'now', 'github').
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

            // After content is loaded, make it visible with a fade-in effect
            contentArea.style.opacity = '1';

            // Update the URL hash without triggering a full page reload
            if (!isInitialLoad) {
                window.location.hash = `/${pageName}.html`;
            }

            // Update active navigation link
            document.querySelectorAll('.main-nav a').forEach(link => {
                if (link.getAttribute('data-page') === pageName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Re-initialize scripts that need to run after new content is loaded
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }

            // MODIFIED: Call updateNowPageLastCommit specifically for the 'now' page
            if (pageName === 'now' && typeof window.updateNowPageLastCommit === 'function') {
                window.updateNowPageLastCommit();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content. Please try again later.</p>`;
            contentArea.style.opacity = '1'; // Show error message
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
            const pageName = pagePart.split('.')[0]; // Get 'home', 'about_me', 'github', 'now'
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
