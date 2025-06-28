const themeSwitch = document.getElementById('theme-switch');
const themeToggleText = document.getElementById('theme-toggle-text');
const body = document.body;
const msCertLogo = document.querySelector('.corner-logo-fixed');
const profileImage = document.querySelector('.profile-image'); // Get reference to profile image

// Define all image paths here, making this the centralized location
const DARK_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Wht_rgb.png';
const LIGHT_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Blk_rgb.png';
const PROFILE_IMAGE_SRC = 'https://avatars.githubusercontent.com/u/64163980?v=4'; // Profile image is likely static

function applyTheme(isDarkMode) {
    if (isDarkMode) {
        body.classList.remove('light-mode');
        themeSwitch.checked = true;
        msCertLogo.src = DARK_MODE_MS_LOGO_SRC;
        profileImage.src = PROFILE_IMAGE_SRC; // Set profile image for dark mode (or just always)
    } else {
        body.classList.add('light-mode');
        themeSwitch.checked = false;
        msCertLogo.src = LIGHT_MODE_MS_LOGO_SRC;
        profileImage.src = PROFILE_IMAGE_SRC; // Set profile image for light mode (or just always)
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');

// Apply theme on page load, which also sets the initial logo sources
if (savedTheme === 'light') {
    applyTheme(false); // Apply light mode
} else {
    applyTheme(true); // Apply dark mode (default)
}

themeToggleText.textContent = 'Dark Mode';

themeSwitch.addEventListener('change', () => {
    applyTheme(themeSwitch.checked);
});