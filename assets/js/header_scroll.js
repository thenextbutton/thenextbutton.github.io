document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    const SCROLL_THRESHOLD = 50;
    let isProfileImageVisible = true; // Tracks the current visual state of the profile image

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {
            // If scrolled past the threshold, hide logos
            // This block runs when the user scrolls down and the logos should go out of view.
            if (isProfileImageVisible) { // Only run if the image was previously visible
                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');

                // Get the transition duration from CSS for the profile image transform
                // This ensures we wait until it's fully out of view before changing the source.
                const profileImageTransitionDuration = parseFloat(getComputedStyle(profileImage).transitionDuration) * 1000;

                // Change the image source AFTER the hide transition completes
                setTimeout(() => {
                    if (typeof window.getRandomProfileImage === 'function') {
                        profileImage.src = window.getRandomProfileImage();
                    }
                }, profileImageTransitionDuration);

                isProfileImageVisible = false; // Update state to hidden
            }
        } else {
            // If scrolled near the top, show logos
            // This block runs when the user scrolls up and the logos should come into view.
            if (!isProfileImageVisible) { // Only run if the image was previously hidden
                profileImage.classList.remove('hidden');
                msCertLogo.classList.remove('hidden');
                // The image source has already been updated when it went out of view.
                // No need to change it again here, just let it slide in with the new source.
                isProfileImageVisible = true; // Update state to visible
            }
        }
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check on load (in case page loads scrolled down)
    handleScroll();

    // Expose handleScroll globally so other scripts (like font_controls.js) can trigger it
    window.triggerHeaderScrollCheck = handleScroll;
});
