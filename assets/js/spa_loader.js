document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Function to load content into the content area with transitions
    async function loadContent(pageName, pushState = true) {
        // 1. Fade out current content (if any)
        const currentContentColumn = contentArea.querySelector('.content-column');
        if (currentContentColumn) {
            currentContentColumn.classList.remove('fade-in'); // Ensure it's not fading in
            // Wait for the fade-out transition to complete before changing content
            await new Promise(resolve => {
                const transitionDuration = parseFloat(getComputedStyle(currentContentColumn).transitionDuration) * 1000;
                setTimeout(resolve, transitionDuration || 0); // Use 0 if no transition or not a number
            });
        }

        try {
            const response = await fetch(`content/${pageName}_content.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            contentArea.innerHTML = content; // Replace content instantly after fade-out

            // 2. Fade in new content
            const newContentColumn = contentArea.querySelector('.content-column');
            if (newContentColumn) {
                // Force reflow to ensure transition starts from initial state
                void newContentColumn.offsetWidth;
                newContentColumn.classList.add('fade-in');
            }

            // Re-initialize font controls for the newly loaded content
            if (typeof initFontControls === 'function') {
                initFontControls();
            }

            // Update URL in browser history using hash-based routing
            if (pushState) {
                const hashPath = pageName === 'home' ? '#/' : `/#/${pageName}.html`;
                history.pushState({ page: pageName }, '', hashPath);
            }

            // Optional: Scroll to top of content area for better UX
            // Only scroll if it's a user-initiated navigation, not back/forward
            if (pushState) {
                contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }


        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<div class="content-column fade-in"><p>Error loading content. Please try again later.</p></div>`;
            // Ensure error message also fades in
            const errorMessageColumn = contentArea.querySelector('.content-column');
            if (errorMessageColumn) {
                void errorMessageColumn.offsetWidth; // Trigger reflow
                errorMessageColumn.classList.add('fade-in');
            }
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageName = event.target.dataset.page;
            if (pageName) {
                loadContent(pageName);
            }
        });
    });

    // Handle browser back/forward buttons (popstate event)
    window.addEventListener('popstate', (event) => {
        const hash = window.location.hash;
        let pageNameFromHash = 'home';

        if (hash.startsWith('#/')) {
            pageNameFromHash = hash.substring(2).replace('.html', '');
        } else if (hash === '#') {
            pageNameFromHash = 'home';
        }

        loadContent(pageNameFromHash, false);
    });

    // Initial page load logic
    const initialHash = window.location.hash;
    let initialPage = 'home';

    if (initialHash.startsWith('#/')) {
        initialPage = initialHash.substring(2).replace('.html', '');
    } else if (initialHash === '#') {
        initialPage = 'home';
    }

    loadContent(initialPage, false);
});
