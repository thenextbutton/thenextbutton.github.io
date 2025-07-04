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

    function handleScroll() {
        // Check if the scroll is programmatic (from spa_loader.js)
        if (window.isProgrammaticScroll) {
            // If it's a programmatic scroll, ensure controls are visible and do not fade them out
            if (controlsWrapper) {
                controlsWrapper.classList.remove('fade-out-controls');
                clearTimeout(fadeControlsTimeoutId); // Clear any pending fade-out
            }
            return; // Exit the function, do not apply fade logic
        }

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

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Also trigger on resize to adjust layout if needed
    handleScroll(); // Initial call to set correct state on page load

    // Expose this function globally if other scripts need to trigger a header check
    window.triggerHeaderScrollCheck = handleScroll;
});
