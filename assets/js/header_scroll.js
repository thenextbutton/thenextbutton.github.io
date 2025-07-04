document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const mainHeading = document.querySelector('h1');
    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper'); // Get reference to the control box

    const SCROLL_THRESHOLD = 50;
    let hideHeaderTimeoutId = null;
    let isProfileImageActuallyHidden = false; // Tracks if the image is visually hidden (after transition)

    let scrollEndTimer = null; // Timer for detecting end of scroll
    const SCROLL_END_DELAY = 300; // Milliseconds to wait after last scroll event to fade in controls

    function handleScroll() {
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

        // --- Control Box Fade-on-Scroll Logic ---
        // Clear the existing timer whenever a scroll event occurs
        clearTimeout(scrollEndTimer);

        // Immediately hide the control box when scrolling starts
        if (controlsWrapper) {
            controlsWrapper.classList.add('fade-out-controls');
        }

        // Set a new timer to show the control box after scrolling stops for a brief moment
        scrollEndTimer = setTimeout(() => {
            if (controlsWrapper) {
                controlsWrapper.classList.remove('fade-out-controls');
            }
        }, SCROLL_END_DELAY);
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Also trigger on resize to adjust layout if needed
    handleScroll(); // Initial call to set correct state on page load

    // Expose this function globally if other scripts need to trigger a header check
    window.triggerHeaderScrollCheck = handleScroll;
});
