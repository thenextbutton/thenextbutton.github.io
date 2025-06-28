const themeSwitch = document.getElementById('theme-switch');
const themeToggleText = document.getElementById('theme-toggle-text');
const body = document.body;
const msCertLogo = document.querySelector('.corner-logo-fixed');
const profileImage = document.querySelector('.profile-image');

const DARK_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Wht_rgb.png';
const LIGHT_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Blk_rgb.png';


const PROFILE_IMAGE_SOURCES = [
    'assets/images/profile_01.webp', 
    'assets/images/profile_02.webp', 
    'assets/images/profile_03.webp', 
    'assets/images/profile_04.webp', 
    'assets/images/profile_05.webp', 
    'assets/images/profile_06.webp', 
    'assets/images/profile_07.webp', 
    'assets/images/profile_08.webp', 
    'assets/images/profile_09.webp', 
    'assets/images/profile_10.webp', 
    'assets/images/profile_11.webp', 
    'assets/images/profile_12.webp', 
    'assets/images/profile_13.webp',
    'assets/images/profile_14.webp'
];

// Function to get a random profile image URL
function getRandomProfileImage() {
    const randomIndex = Math.floor(Math.random() * PROFILE_IMAGE_SOURCES.length);
    return PROFILE_IMAGE_SOURCES[randomIndex];
}

function applyTheme(isDarkMode) {
    // Select a new random profile image on every theme toggle
    profileImage.src = getRandomProfileImage();

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

// Apply theme on page load, which also sets the initial random profile image
if (savedTheme === 'light') {
    applyTheme(false); // Apply light mode
} else {
    applyTheme(true); // Apply dark mode (default)
}

themeToggleText.textContent = 'Dark Mode';

themeSwitch.addEventListener('change', () => {
    applyTheme(themeSwitch.checked);
});
