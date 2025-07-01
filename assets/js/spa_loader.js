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

            if (isInitialLoad) {
                // For initial load, ensure contentColumn exists and set its content.
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

            // Update URL hash without triggering a full page reload
            history.pushState(null, '', `/#/${pageName}.html`);

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
        if (hash.startsWith('/#/')) {
            const pagePart = hash.substring(3); // Remove '/#/'
            return pagePart.split('.')[0]; // Get "home", "about_me", "github"
        }
        return 'home'; // Default to 'home' if no hash or invalid hash
    }

    // Handle navigation clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            const currentPage = getCurrentPageFromHash();

            // Only load content if the clicked page is different from the current page
            if (page !== currentPage) {
                const url = `/content/${page}_content.html`;
                loadContent(url, page, false); // Not an initial load
            } else {
                console.log(`Already on ${page} page. No reload needed.`);
            }
            
            // Update active class for navigation regardless of reload
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Initial content load (e.g., home page)
    const initialPage = getCurrentPageFromHash(); // Get initial page from URL hash
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, true); // This is the initial load

    // Set initial active class based on the loaded page
    const homeLink = document.querySelector(`.main-nav a[data-page="${initialPage}"]`);
    if (homeLink) {
        homeLink.classList.add('active');
    }
});
