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

        if (!lastCommitElement) {
            console.warn(`Element with ID '${elementId}' not found. Cannot display last commit date.`);
            return;
        }

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // If there's an API error, just log it and don't update the UI
                console.error(`GitHub API error: ${response.status} - ${response.statusText}`);
                lastCommitElement.textContent = 'Last updated: N/A (Error fetching data)';
                return;
            }

            const commits = await response.json();

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
            } else {
                lastCommitElement.textContent = 'Last updated: N/A (No commits found)';
            }
        } catch (error) {
            console.error('Failed to fetch last commit date:', error);
            lastCommitElement.textContent = 'Last updated: N/A (Network error)';
        }
    }

    // Call the function when the DOM is ready, targeting the 'now-page-last-updated' element
    // This will run automatically when the 'now_content.html' is loaded by spa_loader.js
    // We need to ensure it runs *after* the content is injected.
    // The spa_loader.js already calls functions like initScrollAnimations and initAutoLinker
    // after content is loaded, so we can leverage that.
    window.updateNowPageLastCommit = function() {
        fetchLastCommitDate('thenextbutton', 'thenextbutton.github.io', 'now-page-last-updated');
    };

    // Initial call for when the page is first loaded directly or through SPA
    // This will be called by spa_loader.js
});

