document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            // Step 1: Hide the entire content area before loading new content
            contentArea.style.opacity = '0';
            // Add a small delay to allow the opacity transition to start visually
            await new Promise(resolve => setTimeout(resolve, 50)); // This creates a brief fade-out effect for the old content

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            let contentColumn = contentArea.querySelector('.content-column');

            // If contentColumn doesn't exist, create it (ensures it's always there)
            if (!contentColumn) {
                contentColumn = document.createElement('div');
                contentColumn.classList.add('content-column');
                contentArea.appendChild(contentColumn);
            }

            // Step 2: Inject the new content into the contentColumn
            contentColumn.innerHTML = data;

            // Step 3: Crucially, after content is in the DOM, initialize scroll animations
            // This will add the 'hidden-scroll' class to .github-project-item elements
            // BEFORE the contentArea is made fully visible.
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }
            // Also re-initialize auto-linker for the new content
            if (typeof initAutoLinker === 'function') {
                initAutoLinker();
            }

            // Step 4: Make the content area visible again
            // The individual github-project-item elements are now correctly hidden by JS
            contentArea.style.opacity = '1';

            // Scroll to the top of the page
            window.scrollTo(0, 0);

            // Update browser history for SPA navigation
            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`;
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
            }

            // Re-initialize other page-specific scripts if they exist
            if (typeof initFontControls === 'function') {
                initFontControls();
            }
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
            contentArea.style.opacity = '1'; // Ensure content area is visible even on error
        }
    }

    // Function to determine the current page from the URL hash
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const pagePart = hash.substring(2); // Remove '#/'
            const pageName = pagePart.split('.')[0]; // Get 'home', 'about_me', 'github'
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
            if (clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false); // Not initial load
            }
            
            // Update active class for navigation links
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Initial load of content based on URL hash or default to home
    const initialPage = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, true); // Mark as initial load

    // Set active class for the initially loaded page's navigation link
    const initialActiveLink = document.querySelector(`.main-nav a[data-page="${initialPage}"]`);
    if (initialActiveLink) {
        initialActiveLink.classList.add('active');
    }
});
