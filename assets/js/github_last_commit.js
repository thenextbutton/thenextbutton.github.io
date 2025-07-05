/**
 * github_last_commit.js
 *
 * This script fetches the last commit date for a specified GitHub repository
 * and displays it on the webpage, calculating the difference in days.
 * It's designed to be called by spa_loader.js after content is loaded.
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Fetches the last commit date for a given GitHub repository and updates a specified HTML element.
     * @param {string} owner - The GitHub repository owner (e.g., 'thenextbutton').
     * @param {string} repo - The GitHub repository name (e.g., 'thenextbutton.github.io').
     * @param {string} elementId - The ID of the HTML element to update with the last commit info.
     */
    async function fetchLastCommitDate(owner, repo, elementId) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
        const lastCommitElement = document.getElementById(elementId);

        console.log(`[github_last_commit.js] Attempting to fetch commit for: ${owner}/${repo}`);
        console.log(`[github_last_commit.js] Targeting element ID: ${elementId}`);

        if (!lastCommitElement) {
            console.error(`[github_last_commit.js] Error: Element with ID '${elementId}' not found. Cannot display last commit date.`);
            return;
        }

        try {
            const response = await fetch(apiUrl);
            console.log(`[github_last_commit.js] Fetch response status: ${response.status}`);

            if (!response.ok) {
                // If there's an API error, log it and update the UI with an error message
                console.error(`[github_last_commit.js] GitHub API error: ${response.status} - ${response.statusText}`);
                lastCommitElement.textContent = `Last updated: N/A (Error: ${response.status} ${response.statusText})`;
                return;
            }

            const commits = await response.json();
            console.log(`[github_last_commit.js] Fetched commits data:`, commits);

            if (commits && commits.length > 0) {
                const lastCommitDate = new Date(commits[0].commit.author.date);
                const now = new Date();

                // Calculate the difference in milliseconds
                const diffMs = now.getTime() - lastCommitDate.getTime();

                // Convert to days
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                let displayText = '';
                if (diffDays === 0) {
                    displayText = 'Last updated: today';
                } else if (diffDays === 1) {
                    displayText = 'Last updated: 1 day ago';
                } else {
                    displayText = `Last updated: ${diffDays} days ago`;
                }

                lastCommitElement.textContent = displayText;
                console.log(`[github_last_commit.js] Successfully updated: ${displayText}`);
            } else {
                lastCommitElement.textContent = 'Last updated: N/A (No commits found)';
                console.warn(`[github_last_commit.js] No commits found for ${owner}/${repo}.`);
            }
        } catch (error) {
            console.error('[github_last_commit.js] Failed to fetch last commit date:', error);
            lastCommitElement.textContent = 'Last updated: N/A (Network error or other issue)';
        }
    }

    // Call the function when the DOM is ready, targeting the 'last-updated-text' element.
    // This will run automatically when the 'now_content.html' is loaded by spa_loader.js.
    // We need to ensure it runs *after* the content is injected.
    // The spa_loader.js already calls functions like initScrollAnimations and initAutoLinker
    // after content is loaded, so we can leverage that.
    window.updateNowPageLastCommit = function() {
        console.log("[github_last_commit.js] window.updateNowPageLastCommit called.");
        // MODIFIED: Changed 'now-page-last-updated' to 'last-updated-text'
        fetchLastCommitDate('thenextbutton', 'thenextbutton.github.io', 'last-updated-text');
    };

    // Initial call for when the page is first loaded directly or through SPA
    // This will be called by spa_loader.js
    // Note: The spa_loader.js will handle calling window.updateNowPageLastCommit
    // after the content is loaded into the DOM.
});
