document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

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

            let contentColumn = contentArea.querySelector('.content-column');

            // If contentColumn exists, update its content
            if (contentColumn) {
                contentColumn.innerHTML = data;
                // Removed: contentColumn.classList.add('fade-in'); // No longer needed for immediate visibility
            } else {
                // If contentColumn doesn't exist (e.g., initial load), create it
                contentColumn = document.createElement('div');
                contentColumn.classList.add('content-column');
                contentArea.appendChild(contentColumn);
                contentColumn.innerHTML = data;
                // Removed: setTimeout(() => { newContentColumn.classList.add('fade-in'); }, 50);
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
