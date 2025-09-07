document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

/**
     * Loads content into the main content area with a fade effect.
     * @param {string} url - The URL of the content to load.
     * @param {string} pageName - The name of the page (e.g., 'home', 'about_me', 'now').
     * @param {string|null} anchor - The anchor ID to scroll to (e.g., 'pi-cow-garage').
     * @param {boolean} isInitialLoad - True if this is the initial page load.
     */
    async function loadContent(url, pageName, anchor = null, isInitialLoad = false) {
        try {
            console.log('Step 1: Initiating fade out of current content and making scrollbar transparent.');
            // Add class to make scrollbar visually transparent
            document.body.classList.add('hide-scrollbar-visually');

            // 1. Fade to 0
            contentArea.style.opacity = '0';

            // 2. Confirm it is faded to 0 by waiting for the opacity transition to end.
            // This promise resolves only when the 'opacity' transition completes.
            await new Promise(resolve => {
                let transitionEndTimeout;

                const handleTransitionEnd = (event) => {
                    if (event.propertyName === 'opacity') {
                        contentArea.removeEventListener('transitionend', handleTransitionEnd);
                        clearTimeout(transitionEndTimeout);
                        resolve();
                        console.log('Transition to opacity 0 confirmed.');
                    }
                };

                contentArea.addEventListener('transitionend', handleTransitionEnd);

                // Fallback timeout in case transitionend doesn't fire (e.g., opacity is already 0)
                transitionEndTimeout = setTimeout(() => {
                    contentArea.removeEventListener('transitionend', handleTransitionEnd);
                    resolve();
                    console.log('Transition timeout triggered (opacity might already be 0).');
                }, parseFloat(getComputedStyle(contentArea).transitionDuration) * 1000 + 100); // Add a small buffer
            });

            console.log('Step 2: Fetching new content from:', url);
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

            console.log('Step 3: Injecting new content and removing scrollbar transparency.');
            // Inject the new content
            contentColumn.innerHTML = data;

            // Remove class to make scrollbar visible again after content is loaded
            // This is done before the content fades in to ensure the scrollbar appears with the content.
            document.body.classList.remove('hide-scrollbar-visually');

            // Call post-load initialization functions
            // Ensure these functions are defined and available in your global scope or included scripts.
            if (typeof initScrollAnimations === 'function') {
               // initScrollAnimations();
            }
            if (typeof window.initAutoLinker === 'function') {
                window.initAutoLinker();
            } 
            if (typeof initLightbox === 'function') {
                initLightbox();
            }
            // Add the social share init function here since content is loaded
            if (typeof window.initSocialShare === 'function') {
                window.initSocialShare();
            }

            // --- GITHUB COMMIT DATE ---
            // Construct the file path relative to the repository root
            // Assuming your content pages are in a 'content' folder at the root.
            const filePath = `content/${pageName}_content.html`;

            // Call the GitHub commit update function if it's available.
            // This relies on github_last_commit.js exposing `window.updateGithubFileCommitDate`.
            if (typeof window.updateGithubFileCommitDate === 'function') {
                window.updateGithubFileCommitDate(filePath);
            }
            // --- END NEW CODE ---

            console.log('Step 4: Fading in new content.');
            // Ensure the content fades in AFTER all dynamic updates (like commit date) are done
            // A very small timeout can sometimes help with rendering before opacity transition starts
            await new Promise(resolve => setTimeout(resolve, 50));
            contentArea.style.opacity = '1';

            // Update URL hash and active navigation link
            if (!isInitialLoad) {
                // If there's an anchor, append it to the hash
                window.location.hash = `#/${pageName}.html${anchor ? '#' + anchor : ''}`;
                setActiveNavLink(pageName);
            }

            // --- NEW: Scroll to the anchor if it exists, otherwise scroll to the top
            if (anchor) {
                const targetElement = document.getElementById(anchor);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn(`Anchor element with ID '${anchor}' not found.`);
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Fallback to top if not found
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // --- END NEW CODE ---

            // Trigger header scroll check to adjust header visibility based on new scroll position
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p>Failed to load content.</p>';
            contentArea.style.opacity = '1'; // Show error immediately
            document.body.classList.remove('hide-scrollbar-visually'); // Ensure scrollbar is visible even on error
        }
    }

    /**
     * Sets the active navigation link based on the current page.
     * @param {string} activePageName - The name of the currently active page.
     */
    function setActiveNavLink(activePageName) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            if (link.getAttribute('data-page') === activePageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Determines the current page name from the URL hash.
     * Defaults to 'home' if no hash is present or recognized.
     * @returns {string} The name of the current page.
     */
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash) {
            // Extract page name from hash like '#/page.html'
            const pageMatch = hash.match(/^#\/(.+)\.html$/);
            if (pageMatch && pageMatch[1]) {
                return pageMatch[1].replace('_content', ''); // Remove '_content' if present
            }
        }
        return 'home'; // Default page
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
                // Fallback for links without data-page, deriving from href
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

    // Set initial active nav link
    setActiveNavLink(initialPage);
});