document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Function to load content dynamically
    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // If content not found, try to load 404 page
                const notFoundResponse = await fetch('404.html');
                if (notFoundResponse.ok) {
                    const notFoundHtml = await notFoundResponse.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(notFoundHtml, 'text/html');
                    const errorMessageContainer = doc.querySelector('.error-message-container');
                    contentArea.innerHTML = errorMessageContainer ? errorMessageContainer.innerHTML : notFoundHtml;
                } else {
                    contentArea.innerHTML = '<div class="content-column"><h2>Error</h2><p>Content not found and 404 page failed to load.</p></div>';
                }
                // Ensure content column is visible in case of error
                const currentContentColumn = contentArea.querySelector('.content-column');
                if (currentContentColumn) {
                    currentContentColumn.style.opacity = '1';
                    currentContentColumn.style.transform = 'translateY(0)';
                }
                return; // Exit if content not found
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

                // Disable header scroll listener before programmatic scroll
                if (typeof window.disableHeaderScrollListener === 'function') {
                    window.disableHeaderScrollListener();
                }
                window.scrollTo(0, 0);
                // Re-enable header scroll listener after a short delay
                setTimeout(() => {
                    if (typeof window.enableHeaderScrollListener === 'function') {
                        window.enableHeaderScrollListener();
                    }
                }, 100); // Give a small delay for scroll event to settle

                if (typeof initAutoLinker === 'function') initAutoLinker();

            } else {
                // For subsequent loads, apply fade-out then fade-in
                if (currentContentColumn) {
                    currentContentColumn.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
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
                    currentContentColumn.offsetHeight; // This forces a reflow

                    currentContentColumn.style.opacity = '1';
                    currentContentColumn.style.transform = 'translateY(0)';

                    if (typeof initScrollAnimations === 'function') initScrollAnimations();
                    if (typeof initAutoLinker === 'function') initAutoLinker();

                    // Disable header scroll listener before programmatic scroll
                    if (typeof window.disableHeaderScrollListener === 'function') {
                        window.disableHeaderScrollListener();
                    }
                    window.scrollTo(0, 0);
                    // Re-enable header scroll listener after a short delay
                    setTimeout(() => {
                        if (typeof window.enableHeaderScrollListener === 'function') {
                            window.enableHeaderScrollListener();
                        }
                    }, 100); // Give a small delay for scroll event to settle

                }, 700); // This timeout should match the CSS transition duration for content-column fade-out
            }

            // Update URL hash without reloading
            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`;
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
            }

            // Re-initialize font controls and header scroll check after new content is loaded
            // The header scroll check is now handled by enable/disable functions
            if (typeof initFontControls === 'function') initFontControls();

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
            const currentContentColumn = contentArea.querySelector('.content-column');
            if (currentContentColumn) {
                currentContentColumn.style.opacity = '1'; // Ensure it's visible even on error
                currentContentColumn.style.transform = 'translateY(0)';
            }
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
            // Add active class to the clicked link
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Handle initial page load based on URL hash or default to home
    const initialPageName = getCurrentPageName();
    const initialContentUrl = `/content/${initialPageName}_content.html`;
    loadContent(initialContentUrl, initialPageName, true); // Mark as initial load

    // Add active class to the initial page link
    const initialNavLink = document.querySelector(`.main-nav a[data-page="${initialPageName}"]`);
    if (initialNavLink) {
        initialNavLink.classList.add('active');
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const pageName = getCurrentPageName();
        const contentUrl = `/content/${pageName}_content.html`;
        loadContent(contentUrl, pageName, true); // Treat popstate as initial load for content display

        // Update active class for navigation links on popstate
        document.querySelectorAll('.main-nav a').forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('data-page') === pageName) {
                navLink.classList.add('active');
            }
        });
    });
});
