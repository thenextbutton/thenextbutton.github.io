document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('scroll-progress-bar');
    const navLinks = document.querySelectorAll('.main-nav a'); // Get all navigation links

    // The core scroll listener remains the same
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
    
    // This function is now async and handles the full animation cycle
    window.handlePageTransition = async () => {
        return new Promise(resolve => {
            // First, start the animation
            progressBar.classList.add('scroll-shrinking');

            // Wait for the transition to complete
            const onTransitionEnd = () => {
                progressBar.removeEventListener('transitionend', onTransitionEnd);
                
                // Reset the bar to its initial state
                progressBar.classList.remove('scroll-shrinking');
                progressBar.style.width = '0%';
                
                resolve();
            };

            progressBar.addEventListener('transitionend', onTransitionEnd, { once: true });
            
            // Fallback in case transitionend event doesn't fire
            setTimeout(() => {
                progressBar.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }, 600); // Must be longer than the CSS transition time
        });
    };
});