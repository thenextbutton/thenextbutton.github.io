/**
 * github_last_commit.js
 *
 * This script fetches the last commit date for a specified GitHub repository
 * and displays it on the webpage. It's designed to be reusable for any
 * element that needs to show a "last updated" timestamp.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration for the GitHub repository
    const githubRepoOwner = 'google'; // Replace with your GitHub username
    const githubRepoName = 'gemini-canvas-sample-app'; // Replace with your repository name

    // The ID of the HTML element where the last updated text will be displayed
    // This has been updated to a more generic ID.
    const lastUpdatedElementId = 'last-updated-text';

    // Get the element where the last updated date will be displayed
    const lastUpdatedElement = document.getElementById(lastUpdatedElementId);

    // If the element doesn't exist, log an error and exit
    if (!lastUpdatedElement) {
        console.error(`Error: Element with ID '${lastUpdatedElementId}' not found.`);
        return;
    }

    /**
     * Fetches the last commit date from the GitHub API.
     * @returns {Promise<string|null>} A promise that resolves with the formatted date string,
     * or null if an error occurs.
     */
    async function fetchLastCommitDate() {
        const apiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/commits?per_page=1`;

        try {
            const response = await fetch(apiUrl);

            // Check if the response was successful
            if (!response.ok) {
                // If not successful, throw an error with the status
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const commits = await response.json();

            // Ensure there's at least one commit
            if (commits && commits.length > 0) {
                const lastCommitDate = new Date(commits[0].commit.author.date);

                // Format the date for display (e.g., "Last updated on January 1, 2023")
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return `Last updated on ${lastCommitDate.toLocaleDateString('en-US', options)}`;
            } else {
                console.warn('No commits found for the specified repository.');
                return null;
            }
        } catch (error) {
            console.error('Failed to fetch last commit date:', error);
            // Return null or a default message in case of an error
            return 'Failed to load update date.';
        }
    }

    /**
     * Updates the content of the last updated element with the fetched date.
     */
    async function updateLastUpdatedText() {
        const dateText = await fetchLastCommitDate();
        if (dateText) {
            lastUpdatedElement.textContent = dateText;
        } else {
            // Fallback text if date cannot be fetched
            lastUpdatedElement.textContent = 'Update date unavailable.';
        }
    }

    // Call the function to update the text when the DOM is ready
    updateLastUpdatedText();
});
