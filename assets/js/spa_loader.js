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
            // Step 1: Explicitly set opacity to 0 immediately to hide the current content.
            // This ensures content is hidden while new content is loaded and page scrolls.
            // The CSS transition on contentArea will handle the fade-out speed of the old content.
            contentArea.style.opacity = '0';

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

            // Step 2: Inject the new content into the (now hidden by opacity:0) area
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

            // --- CRUCIAL ORDER OF OPERATIONS ---

            // 1. Scroll to the top immediately after injecting content, while contentArea opacity is 0.
            window.scrollTo(0, 0);

            // 2. Wait for 3 seconds for the scroll to visually complete.
            await new Promise(resolve => setTimeout(resolve, 3000)); // Increased to 3000ms as requested

            // 3. Re-initialize animations. This runs *after* the scroll has settled, and *before* content is visible.
            // This ensures `initScrollAnimations` correctly applies `hidden-scroll` classes to
            // elements that are truly below the (now reset) viewport, as the content is still hidden.
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }

            // 4. Finally, make the content visible. This will trigger the fade-in for animated elements.
            // The content will fade *in* from its correct scrolled-to-top position.
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
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
            contentArea.style.opacity = '1'; // Ensure content area is visible even on error
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