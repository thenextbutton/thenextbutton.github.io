const themeSwitch = document.getElementById('theme-switch');
const themeToggleText = document.getElementById('theme-toggle-text');
const body = document.body;
const msCertLogo = document.querySelector('.corner-logo-fixed');
const profileImage = document.querySelector('.profile-image');

const DARK_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Wht_rgb.png';
const LIGHT_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Blk_rgb.png';

const PROFILE_IMAGE_SOURCES = [
    'assets/images/proflie_01.webp', 
    'assets/images/proflie_02.webp', 
    'assets/images/proflie_03.webp',
    'assets/images/proflie_04.webp', 
    'assets/images/proflie_05.webp', 
    'assets/images/proflie_06.webp', 
    'assets/images/proflie_07.webp', 
    'assets/images/proflie_08.webp', 
    'assets/images/proflie_09.webp', 
    'assets/images/proflie_10.webp', 
    'assets/images/proflie_11.webp', 
    'assets/images/proflie_12.webp', 
    'assets/images/proflie_13.webp'
];

// Make getRandomProfileImage globally accessible
window.getRandomProfileImage = function() {
    const randomIndex = Math.floor(Math.random() * PROFILE_IMAGE_SOURCES.length);
    return PROFILE_IMAGE_SOURCES[randomIndex];
};

function applyTheme(isDarkMode) {
    profileImage.src = window.getRandomProfileImage();

    if (isDarkMode) {
        body.classList.remove('light-mode');
        themeSwitch.checked = true;
        msCertLogo.src = DARK_MODE_MS_LOGO_SRC;
    } else {
        body.classList.add('light-mode');
        themeSwitch.checked = false;
        msCertLogo.src = LIGHT_MODE_MS_LOGO_SRC;
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    applyTheme(false);
} else {
    applyTheme(true);
}

themeToggleText.textContent = 'Dark Mode';

themeSwitch.addEventListener('change', () => {
    applyTheme(themeSwitch.checked);
});

// Set initial profile image on load
document.addEventListener('DOMContentLoaded', () => {
    profileImage.src = window.getRandomProfileImage();
});
