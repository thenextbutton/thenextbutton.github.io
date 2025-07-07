// assets/js/header_scroll.js

document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const mainHeading = document.querySelector('h1');

    const SCROLL_THRESHOLD = 50;
    // This flag now synchronously tracks if the elements should be visually hidden
    // based on the scroll position. It replaces the previous 'isProfileImageActuallyHidden'
    // to eliminate asynchronous update issues that caused inconsistency.
    let areElementsVisuallyHidden = false;

    // --- Throttling Utility Function ---
    // Limits how often a function can run.
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    // --- END Throttling Utility Function ---

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // --- Header (Profile Image, Logo, H1) Fade Logic ---
        if (currentScrollTop > SCROLL_THRESHOLD) {
            // User is scrolling down, elements should be hidden.
            // Only execute this block if the elements are not already marked as visually hidden.
            if (!areElementsVisuallyHidden) {
                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');
                mainHeading.classList.add('slide-up');
                // Immediately update the state flag to reflect that elements are now logically hidden.
                areElementsVisuallyHidden = true;
            }
        } else {
            // User is scrolling up, elements should be shown.
            // Only execute this block if the elements are currently marked as visually hidden.
            if (areElementsVisuallyHidden) {
                // Set a new random profile image *before* its visibility changes.
                // This ensures the new image is present as it slides back into view.
                // The MS Cert logo remains the same, as per your requirement.
                if (typeof window.getRandomProfileImage === 'function') {
                    profileImage.src = window.getRandomProfileImage();
                }

                profileImage.classList.remove('hidden');
                msCertLogo.classList.remove('hidden');
                mainHeading.classList.remove('slide-up');
                // Immediately update the state flag to reflect that elements are now logically visible.
                areElementsVisuallyHidden = false;
            }
        }
    }

    // --- Apply Throttling to Event Listeners ---
    // The handleScroll function will now be called at most once every 100 milliseconds
    // during scrolling or resizing.
    const throttledHandleScroll = throttle(handleScroll, 50);

    window.addEventListener('scroll', throttledHandleScroll);
    window.addEventListener('resize', throttledHandleScroll);

    // Initial call to set correct state on page load.
    // This call is not throttled to ensure immediate setup.
    handleScroll();

    // Expose this function globally if other scripts need to trigger a header check.
    // When called externally, it will trigger the throttled version.
    window.triggerHeaderScrollCheck = throttledHandleScroll;
});