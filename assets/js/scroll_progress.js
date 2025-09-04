document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('scroll-progress-bar');
    let scrollListenerActive = false;
    let boundScrollHandler;

    const scrollHandler = () => {
        const docElement = document.documentElement;
        const totalHeight = docElement.scrollHeight - docElement.clientHeight;
        const scrollPosition = docElement.scrollTop;
        let scrollPercentage = (scrollPosition / totalHeight) * 100;
        if (totalHeight === 0) {
            scrollPercentage = 100;
        }
        progressBar.style.width = scrollPercentage + '%';
    };
    
    // Function to start the scroll listener
    const startScrollListener = () => {
        if (!scrollListenerActive) {
            boundScrollHandler = scrollHandler.bind(this);
            window.addEventListener('scroll', boundScrollHandler);
            scrollListenerActive = true;
        }
    };
    
    // Function to stop the scroll listener
    const stopScrollListener = () => {
        if (scrollListenerActive) {
            window.removeEventListener('scroll', boundScrollHandler);
            scrollListenerActive = false;
        }
    };

    // The function called by spa_loader.js
    window.handlePageTransition = async () => {
        // Stop the scroll listener to hold the current width
        stopScrollListener();
        
        return new Promise(resolve => {
            const onTransitionEnd = () => {
                progressBar.removeEventListener('transitionend', onTransitionEnd);
                
                // Reset the bar to its initial state
                progressBar.classList.remove('scroll-shrinking');
                progressBar.style.width = '0%';
                
                resolve();
            };
            
            progressBar.addEventListener('transitionend', onTransitionEnd, { once: true });
            
            // Add the shrinking class to start the animation
            progressBar.classList.add('scroll-shrinking');
            
            // Fallback in case transitionend event doesn't fire
            setTimeout(() => {
                progressBar.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }, 600);
        });
    };

    // Initial start of the scroll listener on page load
    startScrollListener();
});