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
    

    window.handlePageTransition = () => {
        // Add the shrinking class to start the height animation
        progressBar.classList.add('scroll-shrinking');
        
        // Wait for the height transition to complete
        setTimeout(() => {
            // Reset the width immediately
            progressBar.style.width = '0%';
            // Remove the shrinking class to return to full height
            progressBar.classList.remove('scroll-shrinking');
        }, 500); // This delay should match the CSS height transition duration
    };
});