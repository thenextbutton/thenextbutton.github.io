document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Function to load content
    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            console.log('Attempting to fetch content from:', url); // Log the URL being fetched
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to load content from: ${url}. HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            let contentColumn = contentArea.querySelector('.content-column');

            // Handle content injection and animation
            if (isInitialLoad) {
                // For initial load, just set the content and ensure it's visible.
                // CSS handles default visibility.
                if (!contentColumn) {
                    contentColumn = document.createElement('div');
                    contentColumn.classList.add('content-column');
                    contentArea.appendChild(contentColumn);
                }
                contentColumn.innerHTML = data;
                // Ensure no lingering inline styles from previous attempts
                contentColumn.style.opacity = '';
                contentColumn.style.transform = '';
            } else {
                // For subsequent navigation, perform fade-out then fade-in
                if (contentColumn) {
                    // Start fade-out
                    contentColumn.style.opacity = '0';
                    contentColumn.style.transform = 'translateY(20px)';
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

                    // Trigger reflow/repaint to ensure transition starts from the new state
                    contentColumn.offsetHeight; // eslint-disable-line no-unused-expressions

                    // Trigger fade-in
                    contentColumn.style.opacity = '1';
                    contentColumn.style.transform = 'translateY(0)';

                }, 700); // This delay should match the CSS transition duration for fade-out
            }

            // Update URL hash without triggering a full page reload, but only if it's different
            // This prevents adding duplicate history entries or unnecessary hash changes
            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`;
            console.log(`Current hash: "${currentHash}", New hash: "${newHash}"`); // Debugging
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
                console.log(`URL hash updated to: ${window.location.hash}`); // Debugging
            } else {
                console.log('URL hash is already correct, no update needed.'); // Debugging
            }


            // Re-initialize font controls and header scroll check after new content is loaded
            if (typeof initFontControls === 'function') {
                initFontControls();
            }
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
        }
    }

    // Function to get the current active page from the URL hash
    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        console.log(`getCurrentPageFromHash: Current window.location.hash is "${hash}"`); // Debugging
        if (hash.startsWith('/#/')) {
            const pagePart = hash.substring(3); // Remove '/#/'
            const pageName = pagePart.split('.')[0]; // Get "home", "about_me", "github"
            console.log(`getCurrentPageFromHash: Derived page name is "${pageName}"`); // Debugging
            return pageName;
        }
        // If no hash, or invalid hash, default to 'home'
        console.log('getCurrentPageFromHash: No valid hash found, defaulting to "home"'); // Debugging
        return 'home';
    }

    // Handle navigation clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            const currentPage = getCurrentPageFromHash();

            console.log(`Clicked page: "${page}", Current active page (from hash): "${currentPage}"`); // Debugging

            // Only load content if the clicked page is different from the current page
            if (page !== currentPage) {
                const url = `/content/${page}_content.html`;
                loadContent(url, page, false); // Not an initial load
            } else {
                // If already on the page, just update active class and log, no reload
                console.log(`Already on ${page} page. No reload or animation needed.`);
            }
            
            // Update active class for navigation regardless of reload
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Initial content load based on URL hash or default to home
    const initialPage = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    console.log(`Initial load: Page "${initialPage}", URL "${initialUrl}"`); // Debugging
    loadContent(initialUrl, initialPage, true); // This is the initial load

    // Set initial active class based on the loaded page
    const initialActiveLink = document.querySelector(`.main-nav a[data-page="${initialPage}"]`);
    if (initialActiveLink) {
        initialActiveLink.classList.add('active');
    }
});
