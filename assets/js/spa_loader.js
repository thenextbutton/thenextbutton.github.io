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
            console.log('Step 1: Initiating fade out of current content.');
            // 1. Fade to 0
            contentArea.style.opacity = '0';

            // 2. Confirm it is faded to 0 by waiting for the opacity transition to end.
            // This promise resolves only when the 'opacity' transition completes.
            await new Promise(resolve => {
                let transitionEndTimeout; // To handle cases where transitionend might not fire reliably

                const handleTransitionEnd = (event) => {
                    // Ensure it's the opacity transition that ended
                    if (event.propertyName === 'opacity') {
                        contentArea.removeEventListener('transitionend', handleTransitionEnd);
                        clearTimeout(transitionEndTimeout); // Clear the fallback timeout
                        resolve();
                        console.log('Transition to opacity 0 confirmed.');
                    }
                };

                contentArea.addEventListener('transitionend', handleTransitionEnd);

                // Fallback: If no transition or transitionend doesn't fire for some reason,
                // resolve after a short delay (e.g., slightly longer than your CSS transition duration).
                // Assuming CSS transition for opacity is 0.5s, 600ms is a safe fallback.
                transitionEndTimeout = setTimeout(() => {
                    contentArea.removeEventListener('transitionend', handleTransitionEnd); // Clean up
                    resolve();
                    console.log('Transition to opacity 0 completed via timeout (fallback).');
                }, 600); // Adjust this fallback if your CSS transition for opacity is much longer
            });

            console.log('Step 2: Old content fully faded out. Proceeding to fetch new content.');

            // 3. Load the new content (fetch and inject)
            console.log('Step 3: Fetching new content from:', url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            let contentColumn = contentArea.querySelector('.content-column');
            if (!contentColumn) {
                contentColumn = document.createElement('div');
                contentColumn.classList.add('content-column');
                contentArea.appendChild(contentColumn);
            }
            contentColumn.innerHTML = data; // Inject new content while contentArea is at opacity: 0
            console.log('Step 3: New content injected into hidden area.');

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

            // 4. Scroll to the top of the page (new content is now injected but not visible yet)
            console.log('Step 4: Scrolling to top of page.');
            window.scrollTo(0, 0);

            // 5. Wait for 3 seconds for the scroll to visually complete.
            console.log('Step 5: Waiting 3 seconds for scroll to settle and render to stabilize.');
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3000ms delay as requested

            // 6. Initialize animations on the hidden, scrolled-to-top content
            console.log('Step 6: Initializing scroll animations for new content.');
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }

            // 7. Make the content visible (it will now fade in from the top)
            console.log('Step 7: Making content visible (fading in).');
            contentArea.style.opacity = '1';

            // Run other initializations now that content is visible
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }
            if (pageName === 'now' && typeof window.updateNowPageLastCommit === 'function') {
                window.updateNowPageLastCommit();
            }
            console.log('Step 8: Content loading process complete.');

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
        return 'home'; // Default to 'home' if no valid hash
    }

    // Event listeners for navigation links
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const clickedPageData = event.target.getAttribute('data-page');
            const currentPageFromHash = getCurrentPageFromHash();

            // Load content only if clicking on a different page
            if (clickedPageData && clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false); // Not initial load
            } else if (!clickedPageData && link.href) {
                // Fallback for links that might not have data-page, deriving from href
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