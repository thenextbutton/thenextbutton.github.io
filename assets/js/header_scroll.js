document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    // Define a scroll threshold in pixels.
    // If the page is scrolled more than this, logos will hide.
    // Adjust this value if you want them to hide sooner or later.
    const SCROLL_THRESHOLD = 50;

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {
            // Scrolled past the threshold, hide logos
            profileImage.classList.add('hidden');
            msCertLogo.classList.add('hidden');
        } else {
            // Scrolled near the top, show logos
            profileImage.classList.remove('hidden');
            msCertLogo.classList.remove('hidden');
        }
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check on load (in case page loads scrolled down)
    handleScroll();

    // Expose handleScroll globally so other scripts (like font_controls.js) can trigger it
    window.triggerHeaderScrollCheck = handleScroll;
});
