const themeSwitch = document.getElementById('theme-switch');
const themeToggleText = document.getElementById('theme-toggle-text');
const body = document.body;
const msCertLogo = document.querySelector('.corner-logo-fixed');

const DARK_MODE_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Wht_rgb.png';
const LIGHT_MODE_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Blk_rgb.png';

function applyTheme(isLightMode) {
    if (isLightMode) {
        body.classList.add('light-mode');
        themeSwitch.checked = true;
        themeToggleText.textContent = 'Dark Mode';
        msCertLogo.src = LIGHT_MODE_LOGO_SRC;
    } else {
        body.classList.remove('light-mode');
        themeSwitch.checked = false;
        themeToggleText.textContent = 'Light Mode';
        msCertLogo.src = DARK_MODE_LOGO_SRC;
    }
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    applyTheme(true);
} else {
    applyTheme(false);
}

themeSwitch.addEventListener('change', () => {
    applyTheme(themeSwitch.checked);
});