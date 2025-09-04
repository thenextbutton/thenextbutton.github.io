document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    /**
     * Loads content into the main content area with a fade effect.
     * This function now assumes all pre-load animations are complete.
     * @param {string} url - The URL of the content to load.
     * @param {string} pageName - The name of the page (e.g., 'home', 'about_me', 'now').
     */
    async function loadContent(url, pageName) {
        try {
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
                const filePath = `content/${pageName}_content.html`;
                window.updateGithubFileCommitDate(filePath);
            }

            contentArea.style.opacity = '1';
        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<p>Sorry, an error occurred while loading this page.</p>';
            contentArea.style.opacity = '1';
            document.body.classList.remove('hide-scrollbar-visually');
        }
    }

    /**
     * Handles the full SPA navigation and animation sequence.
     * This is the function that will be called on link clicks.
     * @param {string} pageName - The name of the page to load.
     */
    async function handleNavigation(pageName) {
        const url = `/content/${pageName}_content.html`;

        // Hide the main scrollbar to prevent flashing
        document.body.classList.add('hide-scrollbar-visually');

        // Start the content fade-out and the scrollbar animation simultaneously
        contentArea.style.opacity = '0';
        const scrollbarAnimationPromise = window.handlePageTransition ? window.handlePageTransition() : Promise.resolve();
        const contentFadePromise = new Promise(resolve => {
            const handleTransitionEnd = (event) => {
                if (event.propertyName === 'opacity') {
                    contentArea.removeEventListener('transitionend', handleTransitionEnd);
                    resolve();
                }
            };
            contentArea.addEventListener('transitionend', handleTransitionEnd);
            // Fallback for immediate state
            setTimeout(() => resolve(), 500);
        });

        // Wait for both animations to finish
        await Promise.all([scrollbarAnimationPromise, contentFadePromise]);

        // Smoothly scroll to the top of the page after animations are done
        await new Promise(resolve => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Wait for a brief moment for the scroll to complete
            setTimeout(resolve, 300);
        });

        // Now, load the new content
        await loadContent(url, pageName);
        
        // Update URL hash and active navigation link
        window.location.hash = `#/${pageName}.html`;
        setActiveNavLink(pageName);
    }

    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const pageName = hash.split('/').pop().split('.')[0];
            return pageName.replace('_content', '');
        }
        return 'home';
    }

    function setActiveNavLink(pageName) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
    }

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const clickedPageData = event.target.getAttribute('data-page');
            const currentPageFromHash = getCurrentPageFromHash();

            if (clickedPageData && clickedPageData !== currentPageFromHash) {
                await handleNavigation(clickedPageData);
            }
        });
    });

    window.addEventListener('popstate', async () => {
        const page = getCurrentPageFromHash();
        await handleNavigation(page);
    });

    const initialPage = getCurrentPageFromHash();
    loadContent(`/content/${initialPage}_content.html`, initialPage);
    setActiveNavLink(initialPage);
});