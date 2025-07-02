document.addEventListener('DOMContentLoaded', () => {
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
        'assets/images/profile_13.webp'
    ];

    // Make getRandomProfileImage globally accessible
    window.getRandomProfileImage = function() {
        const randomIndex = Math.floor(Math.random() * PROFILE_IMAGE_SOURCES.length);
        return PROFILE_IMAGE_SOURCES[randomIndex];
    };

    /**
     * Applies the specified theme to the body, updates the toggle, and sets logo.
     * @param {string} themeName - 'light' or 'dark'.
     */
    function applyTheme(themeName) {
        if (themeName === 'light') {
            body.classList.add('light-mode');
            themeSwitch.checked = false; // Toggle OFF for Light Mode
            themeToggleText.textContent = 'Light Mode';
            msCertLogo.src = LIGHT_MODE_MS_LOGO_SRC; // Set light mode logo
        } else { // themeName === 'dark'
            body.classList.remove('light-mode');
            themeSwitch.checked = true; // Toggle ON for Dark Mode
            themeToggleText.textContent = 'Dark Mode';
            msCertLogo.src = DARK_MODE_MS_LOGO_SRC; // Set dark mode logo
        }
    }

    // --- Initial Theme Load Logic ---

    // 1. Check for saved preference in Local Storage
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // If a theme is saved, apply it
        applyTheme(savedTheme);
    } else {
        // 2. If no saved preference, detect system preference
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

        if (prefersLight.matches) {
            // System prefers light mode
            applyTheme('light');
        } else {
            // System prefers dark mode OR no preference detected (default to dark)
            applyTheme('dark');
        }
    }

    // --- Theme Toggle Button Logic ---

    themeSwitch.addEventListener('change', () => {
        // If themeSwitch.checked is true, it means the user wants Dark Mode
        // If themeSwitch.checked is false, it means the user wants Light Mode
        if (themeSwitch.checked) {
            applyTheme('dark'); // User manually switched to dark mode
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light'); // User manually switched to light mode
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Listen for System Theme Changes (unless overridden by user) ---

    // Get the media query list for dark mode preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Add a listener for changes to the system theme preference
    darkModeMediaQuery.addEventListener('change', (event) => {
        // Only apply system preference if the user hasn't explicitly set a theme
        // (i.e., if 'theme' is not in localStorage)
        if (!localStorage.getItem('theme')) {
            if (event.matches) {
                // System switched to dark mode
                applyTheme('dark');
            } else {
                // System switched to light mode
                applyTheme('light');
            }
        }
    });

    // Set initial profile image on load (kept from your original code)
    profileImage.src = window.getRandomProfileImage();
});
