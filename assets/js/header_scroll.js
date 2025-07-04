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

    // Main scroll event handler that dispatches to specific logic functions
    function onScroll() {
        // Always run header visibility logic
        handleHeaderVisibility();

        if (!controlsWrapper) return; // Exit if controlsWrapper doesn't exist

        // If programmatic scroll, ensure controls are visible and bypass user-initiated fade logic
        if (window.isProgrammaticScroll) {
            controlsWrapper.classList.remove('fade-out-controls'); // Ensure visible
            clearTimeout(fadeControlsTimeoutId); // Clear any pending fade-out
            return; // Exit, do not proceed with user-initiated fade logic
        }

        // --- Control Box Fade Logic for user-initiated scrolls ---
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {
            // If scrolled down, immediately hide the controls
            controlsWrapper.classList.add('fade-out-controls');
            clearTimeout(fadeControlsTimeoutId); // Clear any pending fade-in
        } else {
            // If at the top (or scrolled up to the top), schedule controls to fade in
            clearTimeout(fadeControlsTimeoutId); // Clear any existing timeout
            fadeControlsTimeoutId = setTimeout(() => {
                controlsWrapper.classList.remove('fade-out-controls'); // Make visible
            }, FADE_OUT_DELAY);
        }
    }

    // Function to enable the scroll listener
    function enableScrollListener() {
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll); // Resize might also affect scroll position

        // Initial state setup for controlsWrapper when listener is enabled
        // This runs once when the page loads or when the listener is re-enabled by SPA loader.
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
        }
    }

    // Expose these functions globally
    window.enableHeaderScrollListener = enableScrollListener;
    window.disableHeaderScrollListener = disableScrollListener;

    // Initial setup: enable the listener
    enableScrollListener();
});
