document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const body = document.body;
    const msCertLogo = document.querySelector('.corner-logo-fixed');
    const profileImage = document.querySelector('.profile-image');

    const DARK_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Wht_rgb.webp';
    const LIGHT_MODE_MS_LOGO_SRC = 'assets/images/MS_Cert_Professional_logo_Blk_rgb.webp';

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
     * Applies the specified theme to the body, updates the toggle, and sets logo/icon visibility and position.
     * @param {string} themeName - 'light' or 'dark'.
     */
    function applyTheme(themeName) {
        if (themeName === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode'); // Ensure dark-mode is removed for light theme
            themeSwitch.checked = false; // Toggle OFF for Light Mode
            msCertLogo.src = LIGHT_MODE_MS_LOGO_SRC; // Set light mode logo

            // Sun is active (left), Moon is inactive (right)
            sunIcon.style.transform = 'translateY(-50%) translateX(0)'; // Sun stays at its active position
            sunIcon.style.opacity = '1'; // Fade in sun
            sunIcon.style.color = '#FFD700'; // Yellow for sun

            // MODIFIED: Moon now fades out in place (translateX(0))
            moonIcon.style.transform = 'translateY(-50%) translateX(0)'; 
            moonIcon.style.opacity = '0'; // Fade out moon
            moonIcon.style.color = '#f0f0f0'; // Ensure moon is default color when hidden/shown
        } else { // themeName === 'dark'
            body.classList.remove('light-mode');
            body.classList.add('dark-mode'); // Ensure dark-mode is added for dark theme
            themeSwitch.checked = true; // Toggle ON for Dark Mode
            msCertLogo.src = DARK_MODE_MS_LOGO_SRC; // Set dark mode logo

            // Moon is active (right), Sun is inactive (left) 
            moonIcon.style.transform = 'translateY(-50%) translateX(0)'; // Moon stays at its active position
            moonIcon.style.opacity = '1'; // Fade in moon
            moonIcon.style.color = '#f0f0f0'; // White for moon

            // MODIFIED: Sun now fades out in place (translateX(0))
            sunIcon.style.transform = 'translateY(-50%) translateX(0)'; 
            sunIcon.style.opacity = '0'; // Fade out sun
            sunIcon.style.color = '#FFD700'; // Ensure sun is yellow when hidden/shown
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
            applyTheme('dark'); // User manually switched to dark mode
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light'); // User manually switched to light mode
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

    // Set initial profile image on load
    if (profileImage) {
        profileImage.src = window.getRandomProfileImage();
    }
});
