/**
 * github_last_commit.js
 *
 * This script fetches the last commit date for a specified GitHub repository,
 * optionally for a specific file, and displays it on the webpage,
 * calculating the difference in days.
 * It's designed to be called by spa_loader.js after content is loaded.
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Fetches the last commit date for a given GitHub repository and updates a specified HTML element.
     * Can optionally fetch for a specific file path within the repository.
     * @param {string} owner - The GitHub repository owner (e.g., 'thenextbutton').
     * @param {string} repo - The GitHub repository name (e.g., 'thenextbutton.github.io').
     * @param {string} elementId - The ID of the HTML element to update with the last commit info.
     * @param {string|null} filePath - Optional. The path to the specific file (e.g., 'content/now_content.html').
     */
    async function fetchAndDisplayLastCommitDate(owner, repo, elementId, filePath = null) {
        let apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;

        if (filePath) {
            // Encode the file path to handle special characters correctly in URL
            apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
        }

        const lastCommitElement = document.getElementById(elementId);

        if (!lastCommitElement) {
            console.warn(`Element with ID '${elementId}' not found. Cannot display last commit date.`);
            return;
        }

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // More detailed error logging
                console.error(`GitHub API error for path '${filePath || 'repository'}': ${response.status} - ${response.statusText}`);
                lastCommitElement.textContent = 'Last updated: N/A (API error)';
                return;
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const lastCommitDateStr = data[0].commit.author.date;
                const lastCommitDate = new Date(lastCommitDateStr);
                const today = new Date();

                // Normalize dates to midnight for accurate day difference calculation
                lastCommitDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                const diffTime = Math.abs(today.getTime() - lastCommitDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let displayText = '';
                if (diffDays === 0) {
                    displayText = 'Last updated: today';
                } else if (diffDays === 1) {
                    displayText = 'Last updated: 1 day ago';
                } else {
                    displayText = `Last updated: ${diffDays} days ago`;
                }

                lastCommitElement.textContent = displayText;
            } else {
                lastCommitElement.textContent = 'Last updated: N/A (No commits found for this path)';
            }
        } catch (error) {
            console.error('Failed to fetch last commit date:', error);
            lastCommitElement.textContent = 'Last updated: N/A (Network error)';
        }
    }

    // Expose this function globally so it can be called by spa_loader.js
    window.updateGithubFileCommitDate = function(pageFilePath) {
        // These are your repository details, and the element ID for displaying the date.
        // You can change 'last-updated-text' if your content pages use different IDs.
        fetchAndDisplayLastCommitDate('thenextbutton', 'thenextbutton.github.io', 'last-updated-text', pageFilePath);
    };

    // Note: The previous direct call for 'now-page-last-updated' has been removed.
    // The SPA loader will now be responsible for calling `window.updateGithubFileCommitDate`
    // with the appropriate file path after content is loaded.
});