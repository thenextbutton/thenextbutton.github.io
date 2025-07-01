document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Function to load content
    async function loadContent(url, isInitialLoad = false) {
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
                // CSS will make it visible by default.
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
            const url = `/content/${page}_content.html`; // Keep corrected path
            loadContent(url, false); // Not an initial load
            
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
    loadContent(initialUrl, true); // This is the initial load

    // Set initial active class for home
    const homeLink = document.querySelector('.main-nav a[data-page="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});
