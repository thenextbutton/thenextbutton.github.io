window.triggerHeaderScrollCheck = function() {
    const header = document.querySelector('.main-header-fixed');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', window.triggerHeaderScrollCheck);

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    function updatePageMetadata(pageName, projectTitle = null, projectDescription = null) {
        let pageTitle = "My Corner of the Internet";
        let metaDescription = "A portfolio showcasing my projects and professional journey.";

        switch(pageName) {
            case 'github':
                if (projectTitle) {
                    pageTitle = `${projectTitle} - GitHub Projects`;
                    metaDescription = projectDescription || `View details about the ${projectTitle} project on GitHub.`;
                } else {
                    pageTitle = "My GitHub Projects";
                    metaDescription = "A collection of my key projects and scripts on GitHub.";
                }
                break;
            case 'now':
                pageTitle = "What I'm Doing Now";
                metaDescription = "A look into my current personal and professional focus.";
                break;
            case 'home':
            default:
                pageTitle = "Hello, World! - My Corner of the Internet";
                metaDescription = "A portfolio and personal blog showcasing my professional and personal projects.";
                break;
        }

        document.title = pageTitle;
        document.querySelector('meta[name=\"description\"]').setAttribute('content', metaDescription);
        document.querySelector('meta[property=\"og:title\"]').setAttribute('content', pageTitle);
        document.querySelector('meta[property=\"og:description\"]').setAttribute('content', metaDescription);
    }

    async function loadContent(url, pageName, anchor) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            contentArea.innerHTML = html;
            updatePageMetadata(pageName);
            setActiveNavLink(pageName);

            // This is the key change: Run the page-specific script here.
            switch (pageName) {
                case 'github':
                    // Check if the initGitHubFilter function exists before calling it.
                    if (typeof initGitHubFilter === 'function') {
                        initGitHubFilter();
                    } else {
                        console.error('initGitHubFilter function not found. Make sure github_filter.js is loaded.');
                    }
                    break;
                case 'now':
                    // Add logic to call other page-specific scripts here if needed.
                    break;
            }

            if (anchor) {
                const targetElement = document.getElementById(anchor);
                if (targetElement) {
                    targetElement.scrollIntoView();
                }
            }

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `<p>Error loading page. Please try again later.</p>`;
        }
    }

    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const [page, anchor] = hash.substring(2).split('#');
            return {
                pageName: page.split('.')[0],
                anchor
            };
        }
        return {
            pageName: 'home',
            anchor: null
        };
    }

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const clickedPageData = link.getAttribute('data-page');
            const { pageName: currentPageFromHash } = getCurrentPageFromHash();

            if (clickedPageData && clickedPageData !== currentPageFromHash) {
                const url = `/content/${clickedPageData}_content.html`;
                loadContent(url, clickedPageData, null);
            } else if (!clickedPageData && link.href) {
                const defaultPage = link.href.split('/').pop().split('.')[0].replace('_content', '');
                if (defaultPage && defaultPage !== currentPageFromHash) {
                    const url = `/content/${defaultPage}_content.html`;
                    loadContent(url, defaultPage, null);
                }
            }
        });
    });

    window.addEventListener('popstate', () => {
        const { pageName, anchor } = getCurrentPageFromHash();
        const url = `/content/${pageName}_content.html`;
        loadContent(url, pageName, anchor);
    });

    const { pageName: initialPage, anchor: initialAnchor } = getCurrentPageFromHash();
    const initialUrl = `/content/${initialPage}_content.html`;
    loadContent(initialUrl, initialPage, initialAnchor);

    function setActiveNavLink(pageName) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink(initialPage);
});
