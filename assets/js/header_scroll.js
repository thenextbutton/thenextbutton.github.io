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

    // Function to handle the actual scroll logic
    function handleScrollLogic() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // --- Header (Profile Image, Logo, H1) Fade Logic ---
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

        // --- Control Box Fade Logic (only for user-initiated scrolls) ---
        if (controlsWrapper) { // Ensure the controlsWrapper exists
            // Add fade-out class immediately on scroll
            controlsWrapper.classList.add('fade-out-controls');

            // Clear any existing timeout to prevent flickering if user keeps scrolling
            clearTimeout(fadeControlsTimeoutId);

            // Set a new timeout to remove the fade-out class after scrolling stops
            fadeControlsTimeoutId = setTimeout(() => {
                controlsWrapper.classList.remove('fade-out-controls');
            }, FADE_OUT_DELAY);
        }
    }

    // Function to enable the scroll listener
    function enableScrollListener() {
        window.addEventListener('scroll', handleScrollLogic);
        window.addEventListener('resize', handleScrollLogic);

        // MODIFIED: Initial check for controls visibility on load
        // If scrolled past threshold on initial load, immediately apply fade-out-controls
        if (controlsWrapper) {
            if (window.pageYOffset > SCROLL_THRESHOLD) {
                controlsWrapper.classList.add('fade-out-controls'); // Keep hidden if scrolled
            } else {
                controlsWrapper.classList.remove('fade-out-controls'); // Make visible if at top
            }
        }
        // Still call handleScrollLogic to set header state, but controls are handled above
        handleScrollLogic();
    }

    // Function to disable the scroll listener
    function disableScrollListener() {
        window.removeEventListener('scroll', handleScrollLogic);
        window.removeEventListener('resize', handleScrollLogic);
        // Ensure controls are visible when listener is disabled (e.g., during page load)
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
