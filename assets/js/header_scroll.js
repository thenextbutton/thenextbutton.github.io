document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    let lastScrollTop = 0; // Stores the last scroll position

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Determine scroll direction
        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            profileImage.classList.add('hidden');
            msCertLogo.classList.add('hidden');
        } else {
            // Scrolling up
            profileImage.classList.remove('hidden');
            msCertLogo.classList.remove('hidden');
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check on load (in case page loads scrolled down)
    handleScroll();

    // Expose handleScroll globally so other scripts can trigger it
    window.triggerHeaderScrollCheck = handleScroll;
});
