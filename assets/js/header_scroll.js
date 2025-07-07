// assets/js/header_scroll.js

document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const mainHeading = document.querySelector('h1');

    const SCROLL_THRESHOLD = 50;
    // This flag synchronously tracks if the elements should be visually hidden
    // based on the scroll position. It ensures consistent state management.
    let areElementsVisuallyHidden = false;

    // --- More Robust Throttling Utility Function with Trailing Edge ---
    // This throttle ensures that the function is called on the leading edge (immediately),
    // periodically during continuous events, AND on the trailing edge (after events stop).
    function throttle(func, limit) {
        let timeoutId;
        let lastArgs;
        let lastThis;
        let lastResult;
        let lastCallTime = 0; // Tracks the time of the last *actual* function execution

        // Helper to invoke the function
        const invokeFunc = (time) => {
            lastResult = func.apply(lastThis, lastArgs);
            lastCallTime = time;
        };

        const throttled = function() {
            const now = Date.now();
            lastArgs = arguments;
            lastThis = this;

            // Clear any existing trailing timeout, as a new event has occurred
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }

            // If enough time has passed since the last execution, execute immediately (leading edge)
            if (now - lastCallTime > limit) {
                invokeFunc(now);
            } else {
                // Otherwise, schedule a trailing execution.
                // This ensures that once the rapid events stop, the function will run one last time.
                timeoutId = setTimeout(() => {
                    invokeFunc(Date.now()); // Execute with current time
                    timeoutId = null; // Clear the timeout ID after execution
                }, limit - (now - lastCallTime)); // Calculate time remaining until next possible execution
            }

            return lastResult;
        };

        // Optional: Provide a way to cancel any pending trailing calls
        throttled.cancel = () => {
            clearTimeout(timeoutId);
            timeoutId = null;
            lastCallTime = 0; // Reset for next immediate execution if needed
        };

        return throttled;
    }
    // --- END More Robust Throttling Utility Function ---

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
    // The handleScroll function will now be called at most once every 50 milliseconds
    // during scrolling or resizing, and once more after scrolling stops.
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