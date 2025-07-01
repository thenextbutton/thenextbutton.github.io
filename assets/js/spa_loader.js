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

            // If contentColumn exists, remove fade-in class to trigger fade-out
            if (contentColumn) {
                contentColumn.classList.remove('fade-in');
            }

            // Use a timeout to allow the fade-out transition to complete (0.7s from CSS)
            // before injecting new content and starting the fade-in.
            setTimeout(() => {
                if (!contentColumn) {
                    // If contentColumn doesn't exist (e.g., initial load), create it
                    contentColumn = document.createElement('div');
                    contentColumn.classList.add('content-column');
                    contentArea.appendChild(contentColumn);
                }

                // Set the new content
                contentColumn.innerHTML = data;

                // Use requestAnimationFrame (double-wrapped for robustness) to ensure
                // the browser has rendered the new content (and its initial hidden state)
                // before applying the 'fade-in' class, which triggers the transition.
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        contentColumn.classList.add('fade-in');
                    });
                });

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
            const url = `/content/${page}_content.html`; // Keep corrected path
            loadContent(url);

            // Update active class for navigation
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    // Initial content load (e.g., home page)
    const initialPage = 'home';
    const initialUrl = `/content/${initialPage}_content.html`; // Keep corrected path
    loadContent(initialUrl);

    // Set initial active class for home
    const homeLink = document.querySelector('.main-nav a[data-page="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});
