document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const cornerLogo = document.querySelector('.corner-logo-fixed');
    const scrollThreshold = 100;
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold && window.scrollY > lastScrollY) {
            // Scrolling down and past the threshold, add 'hidden' class
            profileImage.classList.add('hidden');
            cornerLogo.classList.add('hidden');
        } else if (window.scrollY < lastScrollY || window.scrollY < scrollThreshold) {
            // Scrolling up, or at the very top of the page, remove 'hidden' class
            profileImage.classList.remove('hidden');
            cornerLogo.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });
});