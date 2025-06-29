document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Helper function to get the current page name from the URL hash
    function getCurrentPageNameFromHash() {
        const hash = window.location.hash;
        if (hash === '#/' || hash === '#') {
            return 'home';
        } else if (hash.startsWith('#/')) {
            return hash.substring(2).replace('.html', '');
        }
        return 'home'; // Default to 'home' if no valid hash
    }

    // Function to load content into the content area with transitions
    async function loadContent(pageName, pushState = true) {
        // 1. Fade out current content (if any)
        const currentContentColumn = contentArea.querySelector('.content-column');
        if (currentContentColumn) {
            currentContentColumn.classList.remove('fade-in');
            await new Promise(resolve => {
                const transitionDuration = parseFloat(getComputedStyle(currentContentColumn).transitionDuration) * 1000;
                setTimeout(resolve, transitionDuration || 0);
            });
        }

        try {
            const response = await fetch(`content/${pageName}_content.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            contentArea.innerHTML = content;

            // 2. Fade in new content
            const newContentColumn = contentArea.querySelector('.content-column');
            if (newContentColumn) {
                void newContentColumn.offsetWidth;
                newContentColumn.classList.add('fade-in');
            }

            // Re-initialize font controls for the newly loaded content
            if (typeof initFontControls === 'function') {
                initFontControls();
            }

            // Update URL in browser history using hash-based routing
            if (pushState) {
                const hashPath = pageName === 'home' ? '#/' : `/#/${pageName}.html`;
                history.pushState({ page: pageName }, '', hashPath);
            }

            // --- MODIFICATION HERE ---
            // Scroll the newly loaded content-column into view, rather than the contentArea
            if (newContentColumn) { // Ensure the element exists
                // Calculate the offset for the fixed header
                const headerHeight = document.querySelector('.main-header-fixed').offsetHeight;
                // Scroll to the top of the new content column, accounting for the fixed header
                window.scrollTo({
                    top: newContentColumn.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }


        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<div class="content-column fade-in"><p>Error loading content. Please try again later.</p></div>`;
            const errorMessageColumn = contentArea.querySelector('.content-column');
            if (errorMessageColumn) {
                void errorMessageColumn.offsetWidth;
                errorMessageColumn.classList.add('fade-in');
            }
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageName = event.target.dataset.page;
            const currentPage = getCurrentPageNameFromHash();

            if (pageName && pageName === currentPage) {
                console.log(`Already on ${pageName} page. Not reloading.`);
                // If already on the page, just scroll to top if not already there
                const newContentColumn = contentArea.querySelector('.content-column');
                if (newContentColumn) {
                    const headerHeight = document.querySelector('.main-header-fixed').offsetHeight;
                     window.scrollTo({
                        top: newContentColumn.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
                return;
            }

            if (pageName) {
                loadContent(pageName);
            }
        });
    });

    // Handle browser back/forward buttons (popstate event)
    window.addEventListener('popstate', (event) => {
        const pageNameFromHash = getCurrentPageNameFromHash();
        loadContent(pageNameFromHash, false);
    });

    // Initial page load logic
    const initialPage = getCurrentPageNameFromHash();
    loadContent(initialPage, false);
});
