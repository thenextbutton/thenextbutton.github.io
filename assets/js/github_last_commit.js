/**
 * github_last_commit.js
 *
 * This script fetches the last commit date for GitHub repositories and displays it on the webpage.
 * It's designed to be called by a Single-Page Application (SPA) loader after content is loaded.
 */
(() => {
    /**
     * Fetches the last commit date for a given GitHub repository and updates a specified HTML element.
     * @param {string} owner - The GitHub repository owner.
     * @param {string} repo - The GitHub repository name.
     * @param {HTMLElement} elementToUpdate - The HTML element to update.
     * @param {string|null} filePath - Optional path to a specific file.
     */
    async function fetchAndDisplayLastCommitDate(owner, repo, elementToUpdate, filePath = null) {
        let apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;

        if (filePath) {
            apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.length > 0) {
                const commitDate = new Date(data[0].commit.committer.date);
                const now = new Date();
                const diffTime = Math.abs(now - commitDate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                let displayText = '';
                if (diffDays === 0) {
                    displayText = 'Last updated: today';
                } else if (diffDays === 1) {
                    displayText = 'Last updated: 1 day ago';
                } else {
                    displayText = `Last updated: ${diffDays} days ago`;
                }
                elementToUpdate.textContent = displayText;
            } else {
                elementToUpdate.textContent = 'Last updated: N/A (No commits found)';
            }
        } catch (error) {
            console.error('Failed to fetch last commit date:', error);
            elementToUpdate.textContent = 'Last updated: N/A (Network error)';
        }
    }

    /**
     * Public function to initialize the last commit updates on a page.
     * This function should be called by your SPA loader after content is loaded.
     */
    window.initGithubLastCommit = () => {
        // Handle the NOW page specifically
        const nowPageElement = document.querySelector('[data-page="now"]');
        if (nowPageElement && nowPageElement.classList.contains('active')) {
            const nowContentItem = document.querySelector('.github-project-item[data-repo="thenextbutton.github.io"]');
            const nowLastUpdatedText = document.getElementById('last-updated-text');
            if (nowContentItem && nowLastUpdatedText) {
                const repo = nowContentItem.getAttribute('data-repo');
                const path = nowContentItem.getAttribute('data-path');
                fetchAndDisplayLastCommitDate('thenextbutton', repo, nowLastUpdatedText, path);
            }
        }

        // Handle the GitHub projects page with multiple items
        const projectItems = document.querySelectorAll('.github-project-item');
        projectItems.forEach(item => {
            const repo = item.getAttribute('data-repo');
            if (repo) {
                const lastUpdatedElement = item.querySelector('.last-updated');
                if (lastUpdatedElement) {
                    const path = item.getAttribute('data-path');
                    fetchAndDisplayLastCommitDate('thenextbutton', repo, lastUpdatedElement, path);
                }
            }
        });
    };
})();