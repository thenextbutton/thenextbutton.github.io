document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Function to load content
    async function loadContent(url) {
        try {
            console.log('Attempting to fetch content from:', url);
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to load content from: ${url}. HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            const contentColumn = contentArea.querySelector('.content-column');

            // Remove fade-in class immediately to start fade-out (if already visible)
            if (contentColumn) {
                contentColumn.classList.remove('fade-in');
            }

            // Add a small delay before injecting new content and applying fade-in
            // This ensures the browser registers the 'removed' fade-in state before re-applying it
            // and allows the transition to properly trigger.
            setTimeout(() => {
                if (contentColumn) {
                    contentColumn.innerHTML = data;
                    // Apply fade-in to the existing column AFTER content is set
                    setTimeout(() => { // Nested setTimeout to ensure reflow
                        contentColumn.classList.add('fade-in');
                    }, 50);
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

                // Re-initialize font controls and header scroll check after new content is loaded
                if (typeof initFontControls === 'function') {
                    initFontControls();
                }
                if (typeof window.triggerHeaderScrollCheck === 'function') {
                    window.triggerHeaderScrollCheck();
                }
            }, 50); // Initial small delay for content fade-out before new content appears.
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
