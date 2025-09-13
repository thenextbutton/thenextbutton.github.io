/**
 * github_last_commit.js
 *
 * This script fetches the last commit date for a specified GitHub repository,
 * optionally for a specific file, and displays it on the webpage,
 * calculating the difference in days.
 * It's designed to work for both project listings and individual files.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Fetches the last commit date for a given GitHub repository and updates a specified HTML element.
     * Can optionally fetch for a specific file path within the repository.
     * @param {string} owner - The GitHub repository owner (e.g., 'thenextbutton').
     * @param {string} repo - The GitHub repository name (e.g., 'thenextbutton.github.io').
     * @param {HTMLElement} elementToUpdate - The HTML element to update with the last commit info.
     * @param {string|null} filePath - Optional. The path to the specific file (e.g., 'content/now_content.html').
     */
    async function fetchAndDisplayLastCommitDate(owner, repo, elementToUpdate, filePath = null) {
        let apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;

        if (filePath) {
            // Encode the file path to handle special characters correctly in URL
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
                elementToUpdate.textContent = 'Last updated: N/A (No commits found for this path)';
            }
        } catch (error) {
            console.error('Failed to fetch last commit date:', error);
            elementToUpdate.textContent = 'Last updated: N/A (Network error)';
        }
    }

    // This section automatically finds all elements with the 'github-project-item' class
    // and updates them with the last commit date from their data attributes.
    const projectItems = document.querySelectorAll('.github-project-item');

    projectItems.forEach(item => {
        const repo = item.getAttribute('data-repo');
        const path = item.getAttribute('data-path');

        // Check if the div has a data-repo attribute
        if (repo) {
            const owner = 'thenextbutton'; // Assuming your GitHub username is static
            const lastUpdatedElement = item.querySelector('.last-updated') || document.getElementById('last-updated-text');

            if (lastUpdatedElement) {
                fetchAndDisplayLastCommitDate(owner, repo, lastUpdatedElement, path);
            }
        }
    });
});