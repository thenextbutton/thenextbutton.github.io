document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    const SCROLL_THRESHOLD = 50;
    let nextProfileImageSrc = null; 

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {

            if (!profileImage.classList.contains('hidden')) {
                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');

                if (typeof window.getRandomProfileImage === 'function') {
                    nextProfileImageSrc = window.getRandomProfileImage();
                }
            }
        } else {

            const wasProfileImageHidden = profileImage.classList.contains('hidden');


            if (wasProfileImageHidden && nextProfileImageSrc) {
                profileImage.src = nextProfileImageSrc;
                nextProfileImageSrc = null; 
            } else if (!wasProfileImageHidden && typeof window.getRandomProfileImage === 'function') {

            }

            profileImage.classList.remove('hidden');
            msCertLogo.classList.remove('hidden');
        }
    }

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    window.triggerHeaderScrollCheck = handleScroll;
});
