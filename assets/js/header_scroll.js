// assets/js/header_scroll.js

document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const mainHeading = document.querySelector('h1');

    const SCROLL_THRESHOLD = 50;
    let hideHeaderTimeoutId = null; // Still useful for clearing pending animations/changes

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
            // If scrolled past the threshold, hide logos
            // Only hide if they are not already hidden
            if (!profileImage.classList.contains('hidden')) {
                clearTimeout(hideHeaderTimeoutId); // Clear any pending show actions

                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');
                mainHeading.classList.add('slide-up');

                // Optional: If you want to change the image AFTER it's fully hidden,
                // you can keep a timeout here, but it's not strictly necessary for the core fix.
                // For simplicity and directness, we'll change it when showing.
            }
        } else {
            // If scrolled near the top, show logos
            // Only show if they are currently hidden
            if (profileImage.classList.contains('hidden')) {
                clearTimeout(hideHeaderTimeoutId); // Clear any pending hide actions

                // Set a new random profile image *before* it becomes visible again
                // The MS Cert logo remains the same, as per your requirement.
                profileImage.src = window.getRandomProfileImage();

                profileImage.classList.remove('hidden');
                msCertLogo.classList.remove('hidden');
                mainHeading.classList.remove('slide-up');
            }
        }
    }

    // --- Apply Throttling to Event Listeners ---
    // The handleScroll function will now be called at most once every 100 milliseconds
    // during scrolling or resizing.
    const throttledHandleScroll = throttle(handleScroll, 100);

    window.addEventListener('scroll', throttledHandleScroll);
    window.addEventListener('resize', throttledHandleScroll);

    // Initial call to set correct state on page load (this one doesn't need throttling)
    handleScroll();

    // Expose this function globally if other scripts need to trigger a header check.
    // When called externally, it will trigger the throttled version.
    window.triggerHeaderScrollCheck = throttledHandleScroll;
});