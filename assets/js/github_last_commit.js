// assets/js/github_last_commit.js

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Fetches the last commit date for a given GitHub repository.
     * @param {string} owner - The GitHub repository owner.
     * @param {string} repo - The GitHub repository name.
     * @param {string} elementId - The ID of the HTML element to update.
     * @param {string|null} filePath - Optional. The path to the specific file.
     */
    async function fetchAndDisplayLastCommitDate(owner, repo, elementId, filePath = null) {
        let apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;

        if (filePath) {
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
                console.error(`GitHub API error for path '${filePath || 'repository'}': ${response.status} - ${response.statusText}`);
                lastCommitElement.textContent = 'Last updated: N/A (API error)';
                return;
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const lastCommitDateStr = data[0].commit.author.date;
                const lastCommitDate = new Date(lastCommitDateStr);
                const today = new Date();

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

    // New function to update all GitHub project commit dates.
    function updateAllGithubProjectCommitDates() {
        const githubProjects = document.querySelectorAll('.github-project-item[data-repo]');
        if (githubProjects.length > 0) {
            githubProjects.forEach(project => {
                const repoName = project.getAttribute('data-repo');
                if (repoName) {
                    const elementId = `last-updated-${project.id}`;
                    fetchAndDisplayLastCommitDate('thenextbutton', repoName, elementId);
                }
            });
            return true; // Return true if it found projects to update
        }
        return false; // Return false if no projects were found
    }

    // Expose this function globally so it can be called by spa_loader.js.
    // It will first try to update all projects on the page.
    // If no projects are found, it will fall back to updating the single "now" page element.
    window.updateGithubFileCommitDate = function(pageFilePath) {
        if (!updateAllGithubProjectCommitDates()) {
            fetchAndDisplayLastCommitDate('thenextbutton', 'thenextbutton.github.io', 'last-updated-text', pageFilePath);
        }
    };
});