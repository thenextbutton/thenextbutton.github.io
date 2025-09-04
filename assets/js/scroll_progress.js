document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const docElement = document.documentElement;
        const totalHeight = docElement.scrollHeight - docElement.clientHeight;
        const scrollPosition = docElement.scrollTop;
        let scrollPercentage = (scrollPosition / totalHeight) * 100;
        if (totalHeight === 0) {
            scrollPercentage = 100;
        }
        progressBar.style.width = scrollPercentage + '%';
    });
    
    // MODIFIED: This function is now async and returns a promise
    window.handlePageTransition = async () => {
        return new Promise(resolve => {
            const handleTransitionEnd = (event) => {
                if (event.propertyName === 'height' || event.propertyName === 'opacity') {
                    progressBar.removeEventListener('transitionend', handleTransitionEnd);
                    // Reset the width immediately after the height transition ends
                    progressBar.style.width = '0%';
                    // Remove the shrinking class to return to full height for the new page
                    progressBar.classList.remove('scroll-shrinking');
                    resolve();
                }
            };
            
            // Add the shrinking class to start the height animation
            progressBar.classList.add('scroll-shrinking');
            
            // Add event listener to know when the transition completes
            progressBar.addEventListener('transitionend', handleTransitionEnd);
            
            // Fallback for browsers that don't fire transitionend
            setTimeout(() => {
                resolve();
            }, 600); // This should be slightly longer than your CSS transition (0.5s)
        });
    };
});