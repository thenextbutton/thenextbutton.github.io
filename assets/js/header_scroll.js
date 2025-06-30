document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    const SCROLL_THRESHOLD = 50;
    let hideTimeoutId = null;
    let isProfileImageActuallyHidden = false; // Tracks if the image is visually hidden (after transition)

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {
            // If scrolled past the threshold, hide logos
            // This block runs when the user scrolls down and the logos should go out of view.
            if (!isProfileImageActuallyHidden) { // Only run if the image was previously visible
                // Clear any pending timeout that might try to show the image prematurely
                clearTimeout(hideTimeoutId);

                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');

                // Get the transition duration from CSS for the profile image transform
                // This ensures we wait until it's fully out of view before changing the source.
                // It's crucial that this matches the CSS transition duration for .profile-image.hidden
                const profileImageTransitionDuration = parseFloat(getComputedStyle(profileImage).transitionDuration) * 1000;

                // Set a timeout to change the image source *after* it's completely off-screen.
                // This timeout will only proceed if the image *remains* hidden for the duration.
                hideTimeoutId = setTimeout(() => {
                    // Only change source if the image still has the 'hidden' class
                    // (meaning it wasn't scrolled back into view before the timeout fired)
                    if (profileImage.classList.contains('hidden') && typeof window.getRandomProfileImage === 'function') {
                        profileImage.src = window.getRandomProfileImage();
                    }
                    isProfileImageActuallyHidden = true; // Mark as visually hidden after the transition
                    hideTimeoutId = null; // Reset timeout ID
                }, profileImageTransitionDuration);
            }
        } else {
            // If scrolled near the top, show logos
            // If currently visually hidden OR has the 'hidden' class (meaning it's transitioning out)
            if (isProfileImageActuallyHidden || profileImage.classList.contains('hidden')) {
                // Clear any pending timeout that would change the image source while it's coming back into view
                clearTimeout(hideTimeoutId);
                hideTimeoutId = null; // Reset the timeout ID

                profileImage.classList.remove('hidden');
                msCertLogo.classList.remove('hidden');
                isProfileImageActuallyHidden = false; // Mark as visible
            }
        }
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Also attach a resize event listener to handle viewport height changes (like address bar hiding/showing)
    window.addEventListener('resize', handleScroll);

    // Initial check on load
    handleScroll();

    // Expose handleScroll globally
    window.triggerHeaderScrollCheck = handleScroll;
});
