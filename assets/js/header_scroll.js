document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const mainHeading = document.querySelector('h1');
    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper'); // Get the control box

    const SCROLL_THRESHOLD = 50;
    const FADE_OUT_DELAY = 300; // Milliseconds before the controls fade back in after scrolling stops

    let hideHeaderTimeoutId = null;
    let fadeControlsTimeoutId = null;
    let isProfileImageActuallyHidden = false; // Tracks if the image is visually hidden (after transition)
    let isScrollActive = false; // New flag to track if user is actively scrolling

    // Function to handle the header (profile image, logo, h1) logic
    function handleHeaderVisibility() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {
            // If scrolled past the threshold, hide logos
            if (!isProfileImageActuallyHidden) {
                clearTimeout(hideHeaderTimeoutId);

                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');
                mainHeading.classList.add('slide-up'); // Add class to slide h1 up

                const profileImageTransitionDuration = parseFloat(getComputedStyle(profileImage).transitionDuration) * 1000;

                hideHeaderTimeoutId = setTimeout(() => {
                    if (profileImage.classList.contains('hidden') && typeof window.getRandomProfileImage === 'function') {
                        profileImage.src = window.getRandomProfileImage();
                    }
                    isProfileImageActuallyHidden = true;
                    hideHeaderTimeoutId = null;
                }, profileImageTransitionDuration);
            }
        } else {
            // If scrolled near the top, show logos
            if (isProfileImageActuallyHidden || profileImage.classList.contains('hidden')) {
                clearTimeout(hideHeaderTimeoutId);
                hideHeaderTimeoutId = null;

                profileImage.classList.remove('hidden');
                msCertLogo.classList.remove('hidden');
                mainHeading.classList.remove('slide-up'); // Remove class to slide h1 down
                isProfileImageActuallyHidden = false;
            }
        }
    }

    // Function to handle the control box fade logic for user-initiated scrolls
    function handleControlsFade() {
        if (!controlsWrapper) return;

        // When scrolling starts, immediately hide the controls
        // This condition ensures it only adds the class once per scroll session
        if (!isScrollActive) {
            controlsWrapper.classList.add('fade-out-controls');
        }
        isScrollActive = true; // Mark as actively scrolling

        // Clear any previous timeout for fading back in
        clearTimeout(fadeControlsTimeoutId);

        // Set a new timeout to fade back in after scrolling stops
        fadeControlsTimeoutId = setTimeout(() => {
            isScrollActive = false; // Mark scrolling as stopped
            // Only show controls if at the top of the page, otherwise keep them hidden
            if (window.pageYOffset <= SCROLL_THRESHOLD) {
                controlsWrapper.classList.remove('fade-out-controls');
            }
        }, FADE_OUT_DELAY);
    }

    // Main scroll event handler that dispatches to specific logic functions
    function onScroll() {
        // If programmatic scroll, bypass user-initiated scroll logic for controls
        if (window.isProgrammaticScroll) {
            // Ensure controls are visible during programmatic scroll, and clear any fade-out timeout
            if (controlsWrapper) {
                controlsWrapper.classList.remove('fade-out-controls');
                clearTimeout(fadeControlsTimeoutId);
                isScrollActive = false; // Reset scroll active state
            }
            // Still run header visibility logic as it's independent
            handleHeaderVisibility();
            return; // Exit, do not proceed with user-initiated fade logic
        }

        // For user-initiated scrolls
        handleHeaderVisibility(); // Always run header logic
        handleControlsFade();     // Run controls fade logic
    }

    // Function to enable the scroll listener
    function enableScrollListener() {
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll); // Resize might also affect scroll position

        // Initial state setup for controlsWrapper when listener is enabled
        if (controlsWrapper) {
            if (window.pageYOffset > SCROLL_THRESHOLD) {
                controlsWrapper.classList.add('fade-out-controls'); // Start hidden if scrolled down
            } else {
                controlsWrapper.classList.remove('fade-out-controls'); // Start visible if at top
            }
        }
        handleHeaderVisibility(); // Initial call for header visibility
    }

    // Function to disable the scroll listener
    function disableScrollListener() {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        // Ensure controls are visible when listener is disabled (e.g., during page load/transition)
        if (controlsWrapper) {
            controlsWrapper.classList.remove('fade-out-controls'); // Ensure visible
            clearTimeout(fadeControlsTimeoutId);
            isScrollActive = false; // Reset scroll state
        }
    }

    // Expose these functions globally
    window.enableHeaderScrollListener = enableScrollListener;
    window.disableHeaderScrollListener = disableScrollListener;

    // Initial setup: enable the listener
    enableScrollListener();
});
