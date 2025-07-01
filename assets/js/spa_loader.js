document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Function to load content
    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            console.log(`[loadContent] Attempting to fetch content from: ${url} for page: ${pageName}, Initial Load: ${isInitialLoad}`);
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`[loadContent] Failed to load content from: ${url}. HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            let contentColumn = contentArea.querySelector('.content-column');

            // Handle content injection and animation
            if (isInitialLoad) {
                // For initial load, just set the content and ensure it's visible.
                if (!contentColumn) {
                    contentColumn = document.createElement('div');
                    contentColumn.classList.add('content-column');
                    contentArea.appendChild(contentColumn);
                }
                contentColumn.innerHTML = data;
                // Ensure no lingering inline styles from previous attempts
                contentColumn.style.opacity = '';
                contentColumn.style.transform = '';
                console.log(`[loadContent] Initial content for ${pageName} loaded and visible.`);
            } else {
                // For subsequent navigation, perform fade-out then fade-in
                if (contentColumn) {
                    // Start fade-out
                    contentColumn.style.opacity = '0';
                    contentColumn.style.transform = 'translateY(20px)';
                    console.log(`[loadContent] Starting fade-out for previous content.`);
                }

                // Use a timeout to allow the fade-out transition to complete (0.7s from CSS)
                // before injecting new content and starting the fade-in.
                setTimeout(() => {
                    if (!contentColumn) {
                        contentColumn = document.createElement('div');
                        contentColumn.classList.add('content-column');
                        contentArea.appendChild(contentColumn);
                    }

                    // Set the new content
                    contentColumn.innerHTML = data;
                    console.log(`[loadContent] New content for ${pageName} injected.`);

                    // Trigger reflow/repaint to ensure transition starts from the new state
                    contentColumn.offsetHeight; // eslint-disable-line no-unused-expressions
                    console.log(`[loadContent] Triggering reflow for ${pageName}.`);

                    // Trigger fade-in
                    contentColumn.style.opacity = '1';
                    contentColumn.style.transform = 'translateY(0)';
                    console.log(`[loadContent] Starting fade-in for ${pageName}.`);

                }, 700); // This delay should match the CSS transition duration for fade-out
            }

            // Update URL hash without triggering a full page reload, but only if it's different
            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`; // This is the format we want to enforce
            console.log(`[loadContent] Current hash: "${currentHash}", Proposed new hash: "${newHash}"`);
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
                console.log(`[loadContent] URL hash updated to: ${window.location.hash}`);
            } else {
                console.log(`[loadContent] URL hash is already correct (${newHash}), no update needed.`);
            }

            // Re-initialize font controls and header scroll check after new content is loaded
            if (typeof initFontControls === 'function') {
                initFontControls();
                console.log('[loadContent] initFontControls re-initialized.');
            }
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
                console.log('[loadContent] triggerHeaderScrollCheck called.');
            }

        } catch (error) {
            console.error('[loadContent] Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
        }
    }

    // Function to get the current active page from the URL hash
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        console.log(`[getCurrentPageFromHash] Raw hash: "${hash}"`);
        // UPDATED: Changed condition to correctly match hash format "#/"
        if (hash.startsWith('#/')) { // Changed from '/#/' to '#/'
            const pagePart = hash.substring(2); // Remove '#/'
            const pageName = pagePart.split('.')[0]; // Get "home", "about_me", "github"
            console.log(`[getCurrentPageFromHash] Derived page name: "${pageName}"`);
            return pageName;
        }
        // If no hash, or invalid hash, default to 'home'
        console.log('[getCurrentPageFromHash] No valid hash found, defaulting to "home"');
        return 'home';
    }

    // Handle navigation clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior (full page reload)
            const clickedPageData = event.target.getAttribute('data-page');
            const currentPageFromHash = getCurrentPageFromHash();

            console.log(`[Navigation Click] Clicked data-page: "${clickedPageData}", Current page from hash: "${currentPageFromHash}"`);

            // Only load content if the clicked page is different from the current page
            if (clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false); // Not an initial load
                console.log(`[Navigation Click] Loading new page: ${clickedPageData}`);
            } else {
                // If already on the page, just update active class and log, no reload
                console.log(`[Navigation Click] Already on ${clickedPageData} page. No reload or animation needed.`);
            }
            
            // Update active class for navigation regardless of reload
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
            console.log(`[Navigation Click] Active class set for: ${clickedPageData}`);
        });
    });

    // Initial content load based on URL hash or default to home
    const initialPage = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    console.log(`[DOMContentLoaded] Initial load sequence started for page: "${initialPage}", URL: "${initialUrl}"`);
    loadContent(initialUrl, initialPage, true); // This is the initial load

    // Set initial active class based on the loaded page
    const initialActiveLink = document.querySelector(`.main-nav a[data-page="${initialPage}"]`);
    if (initialActiveLink) {
        initialActiveLink.classList.add('active');
        console.log(`[DOMContentLoaded] Initial active class set for: ${initialPage}`);
    } else {
        console.warn(`[DOMContentLoaded] Could not find initial active link for data-page="${initialPage}"`);
    }
});
