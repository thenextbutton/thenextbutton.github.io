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
        document.querySelector('meta[property="og:title"]').setAttribute('content', pageTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', metaDescription);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
    }

    function getCurrentPageFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const hashParts = hash.split('#');
            const pageWithExt = hashParts[1] ? hashParts[1].replace('/', '') : null;
            
            if (pageWithExt) {
                const pageName = pageWithExt.split('.')[0];
                const anchor = hashParts[2] || null;
                return { pageName, anchor };
            }
        }
        return { pageName: 'home', anchor: null };
    }

// Inside spa_loader.js
async function loadContent(url, pageName, anchor = null) {
    try {
        document.body.classList.add('hide-scrollbar-visually');
        contentArea.style.opacity = '0';

        await new Promise(resolve => {
            let transitionEndTimeout;
            const handleTransitionEnd = (event) => {
                if (event.propertyName === 'opacity') {
                    contentArea.removeEventListener('transitionend', handleTransitionEnd);
                    clearTimeout(transitionEndTimeout);
                    resolve();
                }
            };
            contentArea.addEventListener('transitionend', handleTransitionEnd);
            transitionEndTimeout = setTimeout(() => {
                contentArea.removeEventListener('transitionend', handleTransitionEnd);
                resolve();
            }, parseFloat(getComputedStyle(contentArea).transitionDuration) * 1000 + 100);
        });

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();

        let contentColumn = contentArea.querySelector('.content-column');
        if (!contentColumn) {
            contentColumn = document.createElement('div');
            contentColumn.classList.add('content-column');
            contentArea.appendChild(contentColumn);
        }
        
        contentColumn.innerHTML = data;
        document.body.classList.remove('hide-scrollbar-visually');

        // NEW: This is where you call the fadeInLists() function.
        // It's crucial to call it here, after the new content is in the DOM.
        if (typeof fadeInLists === 'function') {
            fadeInLists();
        }

        if (typeof initScrollAnimations === 'function') {
            // initScrollAnimations();
        }
        if (typeof window.initAutoLinker === 'function') {
            window.initAutoLinker();
        }
        if (typeof initLightbox === 'function') {
            initLightbox();
        }
        if (typeof window.initSocialShare === 'function') {
            window.initSocialShare();
        }

        // CORRECTED LINE: This now calls the new initialization function
        if (typeof window.initGithubLastCommit === 'function') {
            window.initGithubLastCommit();
        }

        await new Promise(resolve => setTimeout(resolve, 50));
        contentArea.style.opacity = '1';
        window.location.hash = `#/${pageName}.html${anchor ? '#' + anchor : ''}`;
        setActiveNavLink(pageName);

        let projectTitle = null;
        let projectDescription = null;
        
        if (anchor) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const projectElement = document.getElementById(anchor);
            if (projectElement) {
                projectTitle = projectElement.querySelector('h3').innerText;
                projectDescription = projectElement.querySelector('.project-details p').innerText;

                const headerHeight = document.querySelector('.main-header-fixed').offsetHeight;
                const offset = 15;
                const topPosition = projectElement.getBoundingClientRect().top + window.scrollY - headerHeight - offset;
                
                window.scrollTo({
                    top: topPosition,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        updatePageMetadata(pageName, projectTitle, projectDescription);
        
        if (typeof window.triggerHeaderScrollCheck === 'function') {
            window.triggerHeaderScrollCheck();
        }
    } catch (error) {
        console.error('Error loading content:', error);
        contentArea.innerHTML = '<p>Failed to load content.</p>';
        contentArea.style.opacity = '1';
        document.body.classList.remove('hide-scrollbar-visually');
    }
}

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedPageData = event.target.getAttribute('data-page');
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