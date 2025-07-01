document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const mainHeader = document.querySelector('.main-header-fixed'); // Get the main header

    // Function to load content
    async function loadContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Log the full URL that caused the 404 for easier debugging
                console.error(`Failed to load content from: ${url}. HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            const contentColumn = contentArea.querySelector('.content-column');

            // Start fade out for both content and header
            if (contentColumn) {
                contentColumn.classList.remove('fade-in');
            }
            if (mainHeader) {
                mainHeader.classList.remove('fade-in');
            }

            // After a short delay (matching CSS transition), swap content and fade in
            setTimeout(() => {
                if (contentColumn) {
                    contentColumn.innerHTML = data;
                    contentColumn.classList.add('fade-in'); // Fade in new content
                } else {
                    // If contentColumn doesn't exist (e.g., initial load), create it
                    const newContentColumn = document.createElement('div');
                    newContentColumn.classList.add('content-column');
                    newContentColumn.innerHTML = data;
                    contentArea.appendChild(newContentColumn);
                    // Add fade-in after appending to trigger animation
                    setTimeout(() => {
                        newContentColumn.classList.add('fade-in');
                    }, 50); // Small delay to ensure reflow before animation
                }

                // Fade in the header simultaneously
                if (mainHeader) {
                    mainHeader.classList.add('fade-in');
                }

                // Re-initialize font controls and header scroll check after new content is loaded
                if (typeof initFontControls === 'function') {
                    initFontControls();
                }
                if (typeof window.triggerHeaderScrollCheck === 'function') {
                    window.triggerHeaderScrollCheck();
                }

            }, 700); // This delay should match the CSS transition duration for fade-out
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
            // Changed path to absolute from root
            const url = `/assets/content/${page}_content.html`;
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
    // Changed path to absolute from root
    const initialUrl = `/assets/content/${initialPage}_content.html`;
    loadContent(initialUrl);

    // Set initial active class for home
    const homeLink = document.querySelector('.main-nav a[data-page="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});
