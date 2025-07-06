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
            // Step 1: Hide the entire content area before loading new content
            contentArea.style.opacity = '0';
            // Add a small delay to allow the opacity transition to start visually (before fetch)
            await new Promise(resolve => setTimeout(resolve, 100));

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

            // Step 2: Inject the new content into the (still hidden) area
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
                history.pushState(null, '', `/#/${pageName}`);
            } else {
                if (window.location.hash === '' || window.location.hash === '#/') {
                    history.replaceState(null, '', '/#/home');
                }
            }

            // --- CRUCIAL NEW ORDER OF OPERATIONS ---

            // 1. Scroll to the top immediately after injecting content, while still hidden.
            window.scrollTo(0, 0);

            // 2. Wait a slightly longer moment for the scroll to visually complete.
            // Increased to 150ms for better robustness.
            await new Promise(resolve => setTimeout(resolve, 150));

            // 3. Re-initialize animations. This runs *after* the scroll has settled, and *before* content is visible.
            // So, `initScrollAnimations` should now correctly apply `hidden-scroll` classes to
            // elements that are truly below the (now reset) viewport.
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }

            // 4. Finally, make the content visible. It will now fade in correctly.
            contentArea.style.opacity = '1';

            // 5. Run other initializations now that content is visible
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }
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
            const pagePart = hash.substring(2);
            const pageName = pagePart.split('.')[0];
            return pageName;
        }
        return 'home';
    }

    // Event listeners for navigation links
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedPageData = event.target.getAttribute('data-page');
            const currentPageFromHash = getCurrentPageFromHash();

            if (clickedPageData && clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false);
            } else if (!clickedPageData && link.href) {
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
    loadContent(initialUrl, initialPage, true);
});