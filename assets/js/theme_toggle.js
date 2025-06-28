const themeSwitch = document.getElementById('theme-switch');
const themeToggleText = document.getElementById('theme-toggle-text');
const body = document.body;
const msCertLogo = document.querySelector('.corner-logo-fixed');
const profileImage = document.querySelector('.profile-image');

const DARK_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Wht_rgb.png';
const LIGHT_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Blk_rgb.png';

// New: Separate profile image sources for dark and light modes
const DARK_MODE_PROFILE_IMAGE_SRC = 'assets/images/Profile_Image_Dark_Mode.png';
const LIGHT_MODE_PROFILE_IMAGE_SRC = 'assets/images/Profile_Image_Light_Mode.png'; 

function applyTheme(isDarkMode) {
    if (isDarkMode) {
        body.classList.remove('light-mode');
        themeSwitch.checked = true;
        msCertLogo.src = DARK_MODE_MS_LOGO_SRC;
        profileImage.src = DARK_MODE_PROFILE_IMAGE_SRC; // Use dark mode profile image
    } else {
        body.classList.add('light-mode');
        themeSwitch.checked = false;
        msCertLogo.src = LIGHT_MODE_MS_LOGO_SRC;
        profileImage.src = LIGHT_MODE_PROFILE_IMAGE_SRC; // Use light mode profile image
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
