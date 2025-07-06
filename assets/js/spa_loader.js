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

                transitionEndTimeout = setTimeout(() => {
                    contentArea.removeEventListener('transitionend', handleTransitionEnd);
                    resolve();
                    console.log('Transition to opacity 0 completed via timeout (fallback).');
                }, 600);
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
            contentColumn.innerHTML = data;
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

            // 4. Scroll to the top of the page
            console.log('Step 4: Scrolling to top of page.');
            window.scrollTo(0, 0);

            // 5. Verify the page has scrolled to the top before proceeding.
            console.log('Step 5: Verifying scroll position is 0.');
            await new Promise(resolve => {
                let scrollVerifyTimeout;
                const checkScroll = () => {
                    if (window.pageYOffset === 0 || document.documentElement.scrollTop === 0) {
                        clearTimeout(scrollVerifyTimeout);
                        console.log('Scroll to top verified.');
                        resolve();
                    } else {
                        requestAnimationFrame(checkScroll);
                    }
                };
                requestAnimationFrame(checkScroll);

                scrollVerifyTimeout = setTimeout(() => {
                    console.warn('Scroll to top verification timed out after 1 second. Proceeding anyway.');
                    resolve();
                }, 1000);
            });

            // 6. Initialize animations on the hidden, scrolled-to-top content
            console.log('Step 6: Initializing scroll animations for new content.');
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }

            // 7. Make the content visible
            console.log('Step 7: Making content visible (fading in).');
            contentArea.style.opacity = '1';

            // Run other initializations now that content is visible
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }
            if (pageName === 'now' && typeof window.updateNowPageLastCommit === 'function') {
                window.updateNowPageLastCommit();
            }
            console.log('Step 8: Content loading process complete. Re-enabling scrollbar.');

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
            contentArea.style.opacity = '1';
        } finally {
            // Always remove the class to make scrollbar visible again, even if an error occurs
            document.body.classList.remove('hide-scrollbar-visually');
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