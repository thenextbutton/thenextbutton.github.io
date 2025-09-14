document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const docElement = document.documentElement;

        // Calculate the total scrollable height
        const totalHeight = docElement.scrollHeight - docElement.clientHeight;

        // Calculate the current scroll position
        const scrollPosition = docElement.scrollTop;

        // Calculate the percentage scrolled
        let scrollPercentage = (scrollPosition / totalHeight) * 100;

        // Ensure the bar reaches 100% when at the very bottom
        if (totalHeight === 0) {
            scrollPercentage = 100; // Handle pages with no scroll
        }

        // Update the width of the progress bar
        progressBar.style.width = scrollPercentage + '%';
    });
});