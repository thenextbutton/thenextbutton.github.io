document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    /**
     * Determines the current page name and anchor ID from the URL hash.
     * @returns {{pageName: string, anchor: string|null}}
     */
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const hashParts = hash.split('#');
            const pageWithExt = hashParts[1] ? hashParts[1].replace('/', '') : null;
            
            if (pageWithExt) {
                const pageName = pageWithExt.split('.')[0];
                const anchor = hashParts[2] || null;
                return { pageName, anchor };
            }
        }
        return { pageName: 'home', anchor: null };
    }

    /**
     * Loads content into the main content area with a fade effect.
     * @param {string} url - The URL of the content to load.
     * @param {string} pageName - The name of the page.
     * @param {string|null} anchor - The anchor ID to scroll to.
     * @param {boolean} isInitialLoad - True if this is the initial page load.
     */
    async function loadContent(url, pageName, anchor = null, isInitialLoad = false) {
        try {
            console.log('Step 1: Initiating fade out of current content and making scrollbar transparent.');
            document.body.classList.add('hide-scrollbar-visually');
            contentArea.style.opacity = '0';

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

            // *** IMPORTANT CHANGE ***
            // Call the social share init function AFTER the content is in the DOM
            if (typeof window.initSocialShare === 'function') {
                window.initSocialShare();
            }

            const filePath = `content/${pageName}_content.html`;
            if (typeof window.updateGithubFileCommitDate === 'function') {
                window.updateGithubFileCommitDate(filePath);
            }

            console.log('Step 4: Fading in new content.');
            await new Promise(resolve => setTimeout(resolve, 50));
            contentArea.style.opacity = '1';

            if (!isInitialLoad) {
                window.location.hash = `#/${pageName}.html${anchor ? '#' + anchor : ''}`;
            }
            setActiveNavLink(pageName);

            if (anchor) {
                const targetElement = document.getElementById(anchor);
                if (targetElement) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    const headerHeight = document.querySelector('.main-header-fixed').offsetHeight;
                    const offset = 15;
                    const topPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

                    window.scrollTo({
                        top: topPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`Anchor element with ID '${anchor}' not found.`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p>Failed to load content.</p>';
            contentArea.style.opacity = '1';
            document.body.classList.remove('hide-scrollbar-visually');
        }
    }

    // Corrected logic for event handlers
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedPageData = event.target.getAttribute('data-page');
            const { pageName: currentPageFromHash } = getCurrentPageFromHash();

            if (clickedPageData && clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, null, false);
            } else if (!clickedPageData && link.href) {
                const defaultPage = link.href.split('/').pop().split('.')[0].replace('_content', '');
                if (defaultPage && defaultPage !== currentPageFromHash) {
                    const url = `/content/${defaultPage}_content.html`;
                    loadContent(url, defaultPage, null, false);
                }
            }
        });
    });

    window.addEventListener('popstate', () => {
        const { pageName, anchor } = getCurrentPageFromHash();
        const url = `/content/${pageName}_content.html`;
        loadContent(url, pageName, anchor, false);
    });

    // Initial load
    const { pageName: initialPage, anchor: initialAnchor } = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, initialAnchor, true);

    function setActiveNavLink(pageName) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Set initial active nav link
    setActiveNavLink(initialPage);
});