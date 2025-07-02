document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    async function loadContent(url, pageName, isInitialLoad = false) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            let contentColumn = contentArea.querySelector('.content-column');

            if (isInitialLoad) {
                if (!contentColumn) {
                    contentColumn = document.createElement('div');
                    contentColumn.classList.add('content-column');
                    contentArea.appendChild(contentColumn);
                }
                contentColumn.innerHTML = data;
                contentColumn.style.opacity = '';
                contentColumn.style.transform = '';
            } else {
                if (contentColumn) {
                    contentColumn.style.opacity = '0';
                    contentColumn.style.transform = 'translateY(20px)';
                }

                setTimeout(() => {
                    if (!contentColumn) {
                        contentColumn = document.createElement('div');
                        contentColumn.classList.add('content-column');
                        contentArea.appendChild(contentColumn);
                    }

                    contentColumn.innerHTML = data;
                    contentColumn.offsetHeight; // Trigger reflow/repaint
                    contentColumn.style.opacity = '1';
                    contentColumn.style.transform = 'translateY(0)';

                    // Call initScrollAnimations after new content is loaded
                    if (typeof initScrollAnimations === 'function') {
                        initScrollAnimations();
                    }

                }, 700);
            }

            const currentHash = window.location.hash;
            const newHash = `/#/${pageName}.html`;
            if (currentHash !== newHash) {
                history.pushState(null, '', newHash);
            }

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

    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const pagePart = hash.substring(2);
            const pageName = pagePart.split('.')[0];
            return pageName;
        }
        return 'home';
    }

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedPageData = event.target.getAttribute('data-page');
            const currentPageFromHash = getCurrentPageFromHash();

            if (clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, false);
            }
            
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            event.target.classList.add('active');
        });
    });

    const initialPage = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, true);

    const initialActiveLink = document.querySelector(`.main-nav a[data-page="${initialPage}"]`);
    if (initialActiveLink) {
        initialActiveLink.classList.add('active');
    }
});
