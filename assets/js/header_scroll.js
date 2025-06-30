document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    const SCROLL_THRESHOLD = 50;

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {

            profileImage.classList.add('hidden');
            msCertLogo.classList.add('hidden');
        } else {

            const wasProfileImageHidden = profileImage.classList.contains('hidden');

            profileImage.classList.remove('hidden');
            msCertLogo.classList.remove('hidden');

            if (wasProfileImageHidden && typeof window.getRandomProfileImage === 'function') {
                profileImage.src = window.getRandomProfileImage();
            }
        }
    }

    window.addEventListener('scroll', handleScroll);


    handleScroll();


    window.triggerHeaderScrollCheck = handleScroll;
});
