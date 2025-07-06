document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const mainHeading = document.querySelector('h1');
    // Removed controlsWrapper here, as its logic is moved to scroll_animations.js

    const SCROLL_THRESHOLD = 50;
    let hideHeaderTimeoutId = null;
    let isProfileImageActuallyHidden = false; // Tracks if the image is visually hidden (after transition)

    // Removed scrollEndTimer and SCROLL_END_DELAY as they are no longer needed for controls

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
        // --- END Header Logic ---

        // The Control Box Fade-on-Scroll Logic has been completely removed from here.
        // It is now solely managed by scroll_animations.js.
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Also trigger on resize to adjust layout if needed
    handleScroll(); // Initial call to set correct state on page load

    // Expose this function globally if other scripts need to trigger a header check
    // This is still useful if the header's visibility needs to be recalculated by other parts of your app.
    window.triggerHeaderScrollCheck = handleScroll;
});