document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const body = document.body;
        const html = document.documentElement;

        // Get the total height of the document
        const totalHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

        // Calculate the current scroll position
        const scrollPosition = html.scrollTop;

        // Calculate the percentage scrolled
        const scrollPercentage = (scrollPosition / (totalHeight - html.clientHeight)) * 100;

        // Update the width of the progress bar
        progressBar.style.width = scrollPercentage + '%';
    });
});