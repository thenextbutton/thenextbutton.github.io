document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    const SCROLL_THRESHOLD = 50;
    let isProfileImageVisible = true; 

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > SCROLL_THRESHOLD) {

            if (isProfileImageVisible) { 
                profileImage.classList.add('hidden');
                msCertLogo.classList.add('hidden');


                if (typeof window.getRandomProfileImage === 'function') {
                    profileImage.src = window.getRandomProfileImage();
                }
                isProfileImageVisible = false;
            }
        } else {

            if (!isProfileImageVisible) { 
                profileImage.classList.remove('hidden');
                msCertLogo.classList.remove('hidden');

                isProfileImageVisible = true; 
            }
        }
    }

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    window.triggerHeaderScrollCheck = handleScroll;
});
