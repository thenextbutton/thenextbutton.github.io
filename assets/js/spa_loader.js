document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    // Removed: const mainHeader = document.querySelector('.main-header-fixed'); // This line was removed in the revert

    // Function to load content
    async function loadContent(url) {
        try {
            console.log('Attempting to fetch content from:', url); // Log the URL being fetched
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to load content from: ${url}. HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            const contentColumn = contentArea.querySelector('.content-column');

            // Removed: Start fade out for both content and header
            // if (contentColumn) {
            //     contentColumn.classList.remove('fade-in');
            // }
            // if (mainHeader) { // This check was removed as mainHeader is no longer defined
            //     mainHeader.classList.remove('fade-in');
            // }

            // Removed setTimeout wrapper for content loading
            // setTimeout(() => { // This delay should match the CSS transition duration for fade-out
                if (contentColumn) {
                    contentColumn.innerHTML = data;
                    contentColumn.classList.add('fade-in'); // Keep content fade-in
                } else {
                    const newContentColumn = document.createElement('div');
                    newContentColumn.classList.add('content-column');
                    newContentColumn.innerHTML = data;
                    contentArea.appendChild(newContentColumn);
                    setTimeout(() => {
                        newContentColumn.classList.add('fade-in');
                    }, 50);
                }

                // Removed: Fade in the header simultaneously
                // if (mainHeader) { // This check was removed as mainHeader is no longer defined
                //     mainHeader.classList.add('fade-in');
                // }

                // Re-initialize font controls and header scroll check after new content is loaded
                if (typeof initFontControls === 'function') {
                    initFontControls();
                }
                if (typeof window.triggerHeaderScrollCheck === 'function') {
                    window.triggerHeaderScrollCheck();
                }

            // Removed closing for setTimeout
            // }, 700);
        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading content: ${error.message}. Please try again.</p>`;
        }
    }

    // Handle navigation clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            // Keep corrected path for content
            const url = `/content/${page}_content.html`;
            loadContent(url);

            // Update active class for navigation
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Initial content load (e.g., home page)
    const initialPage = 'home'; // Default page to load
    // Keep corrected path for content
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl);

    // Set initial active class for home
    const homeLink = document.querySelector('.main-nav a[data-page="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});
