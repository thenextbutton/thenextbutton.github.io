// assets/js/github_last_commit.js

document.addEventListener('DOMContentLoaded', () => {

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

    function updateAllGithubProjectCommitDates() {
        const githubProjects = document.querySelectorAll('.github-project-item');
        if (githubProjects.length > 0) {
            githubProjects.forEach(project => {
                const repoName = project.getAttribute('data-repo');

                const filePath = project.getAttribute('data-path'); 
                if (repoName) {
                    const elementId = `last-updated-${project.id}`;

                    fetchAndDisplayLastCommitDate('thenextbutton', repoName, elementId, filePath);
                }
            });
            return true;
        }
        return false;
    }

    window.updateGithubFileCommitDate = function(pageFilePath) {
        if (!updateAllGithubProjectCommitDates()) {
            fetchAndDisplayLastCommitDate('thenextbutton', 'thenextbutton.github.io', 'last-updated-text', pageFilePath);
        }
    };
});