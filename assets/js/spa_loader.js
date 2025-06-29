document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.main-nav a');

    async function loadContent(pageName, pushState = true) {
        try {
            const response = await fetch(`content/${pageName}_content.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            contentArea.innerHTML = content;

            if (typeof initFontControls === 'function') {
                initFontControls();
            }

            if (pushState) {
                const hashPath = pageName === 'home' ? '#/' : `/#/${pageName}.html`;
                history.pushState({ page: pageName }, '', hashPath);
            }

            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<div class="content-column"><p>Error loading content. Please try again later.</p></div>`;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const pageName = event.target.dataset.page; 
            if (pageName) {
                loadContent(pageName);
            }
        });
    });

    window.addEventListener('popstate', (event) => {
        const hash = window.location.hash;
        let pageNameFromHash = 'home'; 

        if (hash === '#/') { 
            pageNameFromHash = 'home';
        } else if (hash.startsWith('#/')) {
            pageNameFromHash = hash.substring(2).replace('.html', '');
        } else if (hash === '#') {
            pageNameFromHash = 'home';
        }

        loadContent(pageNameFromHash, false); 
    });


    const initialHash = window.location.hash;
    let initialPage = 'home'; 

    if (initialHash === '#/') { 
        initialPage = 'home';
    } else if (initialHash.startsWith('#/')) {
        initialPage = initialHash.substring(2).replace('.html', '');
    } else if (initialHash === '#') {
        initialPage = 'home';
    }

    loadContent(initialPage, false); 
});
