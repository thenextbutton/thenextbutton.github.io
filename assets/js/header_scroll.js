document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const cornerLogo = document.querySelector('.corner-logo-fixed');
    const scrollThreshold = 100; // Amount of pixels to scroll down before hiding
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold && window.scrollY > lastScrollY) {
            // Scrolling down and past the threshold
            profileImage.classList.add('slide-up');
            cornerLogo.classList.add('slide-up');
        } else if (window.scrollY < lastScrollY || window.scrollY < scrollThreshold) {
            // Scrolling up, or at the very top of the page
            profileImage.classList.remove('slide-up');
            cornerLogo.classList.remove('slide-up');
        }
        lastScrollY = window.scrollY;
    });
});