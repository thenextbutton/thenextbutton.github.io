document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Function to load content dynamically
    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();

            let currentContentColumn = contentArea.querySelector('.content-column');

            if (isInitialLoad) {
                // For initial load, just set content directly without fade effect
                if (!currentContentColumn) {
                    currentContentColumn = document.createElement('div');
                    currentContentColumn.classList.add('content-column');
                    contentArea.appendChild(currentContentColumn);
                }
                currentContentColumn.innerHTML = htmlContent;
                currentContentColumn.style.opacity = ''; // Ensure opacity is reset
                currentContentColumn.style.transform = ''; // Ensure transform is reset
                if (typeof initAutoLinker === 'function') initAutoLinker();
                // Flag to indicate programmatic scroll for header_scroll.js
                window.isProgrammaticScroll = true;
                window.scrollTo(0, 0);
                // Reset flag after a short delay to allow scroll event to fire
                setTimeout(() => {
                    window.isProgrammaticScroll = false;
                }, 200); // Increased delay to 200ms
            } else {
                // For subsequent loads, apply fade-out then fade-in
                if (currentContentColumn) {
                    currentContentColumn.style.opacity = '0';
                    currentContentColumn.style.transform = 'translateY(20px)';
                }

                setTimeout(() => {
                    if (!currentContentColumn) {
                        currentContentColumn = document.createElement('div');
                        currentContentColumn.classList.add('content-column');
                        contentArea.appendChild(currentContentColumn);
                    }
                    currentContentColumn.innerHTML = htmlContent;
                    // Trigger reflow to ensure transition restarts
                    currentContentColumn.offsetHeight;
                    currentContentColumn.style.opacity = '1';
                    currentContentColumn.style.transform = 'translateY(0)';

                    if (typeof initScrollAnimations === 'function') initScrollAnimations();
                    if (typeof initAutoLinker === 'function') initAutoLinker();

                    // Flag to indicate programmatic scroll for header_scroll.js
                    window.isProgrammaticScroll = true;
                    window.scrollTo(0, 0);
                    // Reset flag after a short delay to allow scroll event to fire
                    setTimeout(() => {
                        window.isProgrammaticScroll = false;
                    }, 200); // Increased delay to 200ms

                }, 700); // This timeout should match the CSS transition duration for content-column fade-out
            }

            // Update URL hash without reloading
            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`;
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
            }

            // Re-initialize font controls and header scroll check after new content is loaded
            if (typeof initFontControls === 'function') initFontControls();
            if (typeof window.triggerHeaderScrollCheck === 'function') window.triggerHeaderScrollCheck();


        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
        }
    }

    // Function to get current page name from hash
    function getCurrentPageName() {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const pagePath = hash.substring(2); // Remove '#/'
            const pageName = pagePath.split('.')[0]; // Get name before '.html'
            return pageName;
        }
        return 'home'; // Default to home if no hash or invalid hash
    }

    // Event listeners for navigation links
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const pageName = event.target.getAttribute('data-page');
            const currentPage = getCurrentPageName();

            // Only load if different page
            if (pageName !== currentPage) {
                const contentUrl = `/content/${pageName}_content.html`;
                loadContent(contentUrl, pageName, false); // Not initial load
            }
        });
    });

    // Handle initial page load based on URL hash or default to home
    const initialPageName = getCurrentPageName();
    const initialContentUrl = `/content/${initialPageName}_content.html`;
    loadContent(initialContentUrl, initialPageName, true); // Mark as initial load

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const pageName = getCurrentPageName();
        const contentUrl = `/content/${pageName}_content.html`;
        loadContent(contentUrl, pageName, true); // Treat popstate as initial load for content display
    });
});
