document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const msCertLogo = document.querySelector('.corner-logo-fixed');

    let lastScrollTop = 0; 

    function handleScroll() {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {

            profileImage.classList.add('hidden');
            msCertLogo.classList.add('hidden');
        } else {

            profileImage.classList.remove('hidden');
            msCertLogo.classList.remove('hidden');
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    window.triggerHeaderScrollCheck = handleScroll;
});
