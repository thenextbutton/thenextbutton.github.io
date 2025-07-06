document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    /**
     * Loads content into the main content area with a fade effect.
     * @param {string} url - The URL of the content to load.
     * @param {string} pageName - The name of the page (e.g., 'home', 'about_me', 'now').
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

            // Inject the new content
            contentColumn.innerHTML = data;

            // Update active class for navigation
            document.querySelectorAll('.main-nav a').forEach(link => {
                if (link.getAttribute('data-page') === pageName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update URL hash without causing a page reload
            if (!isInitialLoad) {
                // Ensure the hash reflects the current page if it's not the initial load
                // Use replaceState to avoid adding to browser history on link clicks within the same page,
                // or pushState if you want back/forward button support for SPA navigation.
                history.pushState(null, '', `/#/${pageName}`);
            } else {
                // For initial load, if hash is empty, set it to home
                if (window.location.hash === '' || window.location.hash === '#/') {
                    history.replaceState(null, '', '/#/home');
                }
            }

            // After content is loaded and DOM is updated, make it visible
            contentArea.style.opacity = '1';

            // --- NEW ORDER: Scroll to the top of the page FIRST ---
            // This is crucial for ensuring initScrollAnimations evaluates visibility correctly.
            window.scrollTo(0, 0);

            // --- IMPORTANT: Re-initialize scripts that operate on the new content ---
            // These functions need to be called AFTER the new HTML is injected into the DOM
            // AND after the page has scrolled to the top.

            // Re-run scroll animations for any new elements that need the fade-in effect.
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }

            // Re-run auto-linker for any new text content that needs auto-linking.
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }

            // If the loaded page is 'now_content', trigger its specific last commit update.
            if (pageName === 'now' && typeof window.updateNowPageLastCommit === 'function') {
                window.updateNowPageLastCommit();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p>Error loading content. Please try again.</p>';
            contentArea.style.opacity = '1'; // Make sure the error message is visible
        }
    }

    // Helper to get page name from URL hash
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

            // Load content only if clicking on a different page or if the hash doesn't match
            // This handles cases where user clicks current nav item but hash might be wrong.
            if (clickedPageData && clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false); // Not initial load
            } else if (!clickedPageData && link.href) { // Fallback for links without data-page
                const defaultPage = link.href.split('/').pop().split('.')[0].replace('_content', '');
                 if (defaultPage && defaultPage !== currentPageFromHash) {
                    const url = `/content/${defaultPage}_content.html`;
                    loadContent(url, defaultPage, false);
                 }
            }
        });
    });

    // Handle back/forward button browser navigation
    window.addEventListener('popstate', () => {
        const page = getCurrentPageFromHash();
        const url = `/content/${page}_content.html`;
        loadContent(url, page, false);
    });

    // Initial load of content based on URL hash or default to home
    const initialPage = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, true); // Mark as initial load
});