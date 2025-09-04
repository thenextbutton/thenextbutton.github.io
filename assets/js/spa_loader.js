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
            console.log('Step 1: Initiating fade out of current content and making scrollbar transparent.');
            // Add class to make scrollbar visually transparent
            document.body.classList.add('hide-scrollbar-visually');

            // NEW: Wait for the scroll progress bar animation to complete
            if (window.handlePageTransition) {
                await window.handlePageTransition();
            }

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
                window.location.hash = `#/${pageName}.html`;
                setActiveNavLink(pageName);
            }

            // Scroll to the top of the content area
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Trigger header scroll check to adjust header visibility based on new scroll position
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p>Sorry, an error occurred while loading this page.</p>';
            contentArea.style.opacity = '1';
            document.body.classList.remove('hide-scrollbar-visually');
        }
    }

    /**
     * Gets the current page name from the URL hash.
     * @returns {string} The name of the page, or 'home' if not found.
     */
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const pageName = hash.split('/').pop().split('.')[0];
            return pageName.replace('_content', '');
        }
        return 'home';
    }

    /**
     * Sets the 'active' class on the current navigation link.
     * @param {string} pageName - The name of the current page.
     */
    function setActiveNavLink(pageName) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
    }

    // Handle clicks on navigation links
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