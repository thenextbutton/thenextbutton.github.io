document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            console.log('Step 1: Initiating fade out of current content and making scrollbar transparent.');
            document.body.classList.add('hide-scrollbar-visually');

            // --- NEW: Call the scroll progress bar transition function ---
            if (window.handlePageTransition) {
                window.handlePageTransition();
            }
            // -----------------------------------------------------------

            contentArea.style.opacity = '0';

            // ... rest of your existing loadContent function ...
            
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
                transitionEndTimeout = setTimeout(() => {
                    contentArea.removeEventListener('transitionend', handleTransitionEnd);
                    resolve();
                    console.log('Transition timeout triggered (opacity might already be 0).');
                }, parseFloat(getComputedStyle(contentArea).transitionDuration) * 1000 + 100);
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
            contentColumn.innerHTML = data;
            document.body.classList.remove('hide-scrollbar-visually');

            if (typeof initScrollAnimations === 'function') {
                 // initScrollAnimations();
            }
            if (typeof window.initAutoLinker === 'function') {
                window.initAutoLinker();
            }
            if (typeof initLightbox === 'function') {
                initLightbox();
            }
            if (typeof window.updateGithubFileCommitDate === 'function') {
                // ... logic to update commit date ...
            }
            
            setTimeout(() => {
                contentArea.style.opacity = '1';
                console.log('Step 4: Fading in new content.');
            }, 100);

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p>Sorry, an error occurred while loading this page.</p>';
            contentArea.style.opacity = '1';
            document.body.classList.remove('hide-scrollbar-visually');
        }
    }

    // Your existing event listeners and initial load logic would follow here.
    // ...
});
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