// Function to initialize scroll animations (from scroll_animations.js)
// This function needs to be available globally or passed to spa_loader.js
// Assuming initScrollAnimations is defined in assets/js/scroll_animations.js and is globally accessible
// or we will define it here if it's not.
if (typeof initScrollAnimations !== 'function') {
    // Basic fallback if initScrollAnimations is not defined elsewhere
    window.initScrollAnimations = function() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('hidden-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.github-project-item').forEach(item => {
            if (!item.classList.contains('hidden-scroll')) {
                item.classList.add('hidden-scroll');
            }
            observer.observe(item);
        });
    };
}


document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Function to load content into the main area
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                // If the specific content page is not found, try to load 404.html
                const errorResponse = await fetch('404.html');
                if (errorResponse.ok) {
                    const errorHtml = await errorResponse.text();
                    // Extract content within the .error-message-container if 404.html has full page structure
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(errorHtml, 'text/html');
                    const errorMessageContainer = doc.querySelector('.error-message-container');
                    contentArea.innerHTML = errorMessageContainer ? errorMessageContainer.innerHTML : errorHtml;
                } else {
                    // Fallback if 404.html also fails
                    contentArea.innerHTML = '<div class="content-column"><h2>Error</h2><p>Content not found and 404 page failed to load.</p></div>';
                }
                console.error(`HTTP error! status: ${response.status} for path: ${path}`);
            } else {
                const html = await response.text();
                contentArea.innerHTML = html;
            }

            // Re-initialize scroll animations for newly loaded content
            if (typeof window.initScrollAnimations === 'function') {
                window.initScrollAnimations();
            }

            // Re-initialize auto-linking for newly loaded content
            if (typeof window.initAutoLinker === 'function') {
                window.initAutoLinker();
            }

            // Trigger header scroll check for newly loaded content height
            if (typeof window.triggerHeaderScrollCheck === 'function') {
                window.triggerHeaderScrollCheck();
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = '<div class="content-column"><h2>Error</h2><p>Failed to load content.</p></div>';
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const page = link.getAttribute('data-page');
            const path = `content/${page}_content.html`; // Construct path to content file
            history.pushState({ page: page }, '', `#/${page}.html`); // Update URL in history
            loadContent(path);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            const page = event.state.page;
            const path = `content/${page}_content.html`;
            loadContent(path);
        } else {
            // Default to home page if popstate is null (e.g., initial load or direct access)
            const initialPath = window.location.hash.substring(1) || 'home.html';
            loadContent(`content/${initialPath}`);
        }
    });

    // Initial content load based on URL hash or default to home
    const initialPath = window.location.hash.substring(1) || 'home.html';
    loadContent(`content/${initialPath}`);
});
