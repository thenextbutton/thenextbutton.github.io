document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
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

    window.getRandomProfileImage = function() {
        const randomIndex = Math.floor(Math.random() * PROFILE_IMAGE_SOURCES.length);
        return PROFILE_IMAGE_SOURCES[randomIndex];
    };

    /**
     * Applies the specified theme to the body, updates the toggle, and sets logo/icon visibility.
     * @param {string} themeName - 'light' or 'dark'.
     */
    function applyTheme(themeName) {
        if (themeName === 'light') {
            body.classList.add('light-mode');
            themeSwitch.checked = false;
            msCertLogo.src = LIGHT_MODE_MS_LOGO_SRC;

            if (moonIcon && sunIcon) { // Ensure icons exist before manipulating
                moonIcon.style.opacity = '0';
                sunIcon.style.opacity = '1';
                sunIcon.style.color = '#FFD700';
                moonIcon.style.color = '#f0f0f0';
            }
        } else { // themeName === 'dark'
            body.classList.remove('light-mode');
            themeSwitch.checked = true;
            msCertLogo.src = DARK_MODE_MS_LOGO_SRC;

            if (moonIcon && sunIcon) { // Ensure icons exist before manipulating
                moonIcon.style.opacity = '1';
                sunIcon.style.opacity = '0';
                moonIcon.style.color = '#f0f0f0';
                sunIcon.style.color = '#FFD700';
            }
        }
    }

    // --- Initial Theme Load Logic ---
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
        if (prefersLight.matches) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    }

    // --- Theme Toggle Button Logic ---
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Listen for System Theme Changes (unless overridden by user) ---
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (event) => {
        if (!localStorage.getItem('theme')) {
            if (event.matches) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        }
    });

    // Ensure profile image is set only after the DOM is fully parsed and the element exists
    if (profileImage) {
        profileImage.src = window.getRandomProfileImage();
    } else {
        console.error("Profile image element not found. Cannot set its source.");
    }
});
