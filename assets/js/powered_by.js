document.addEventListener('DOMContentLoaded', () => {
    // Function to create and append the "Powered by GitHub" element
    function createPoweredByGitHub() {
        const poweredByP = document.createElement('p');
        poweredByP.className = 'powered-by-github';

        const poweredByLink = document.createElement('a');
        poweredByLink.href = 'https://github.com/';
        poweredByLink.target = '_blank';
        poweredByLink.rel = 'noopener noreferrer';
        poweredByLink.textContent = 'Powered by GitHub';

        poweredByP.appendChild(poweredByLink);
        document.body.appendChild(poweredByP);
    }

    // Call this function once when the DOM is ready
    createPoweredByGitHub();
});
