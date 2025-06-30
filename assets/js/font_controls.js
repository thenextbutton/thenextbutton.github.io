// Wrap the font control logic in a function that can be called externally
function initFontControls() {
    const fontMinus = document.getElementById('font-minus');
    const fontReset = document.getElementById('font-reset');
    const fontPlus = document.getElementById('font-plus');
    // Change target from contentColumn to body
    const targetElement = document.body; // Target the body element for global font size control

    if (!targetElement) {
        console.warn("Target element (body) not found for font controls.");
        return;
    }

    // Define a default font size for the body
    // This should ideally match your body's default font-size in style.css for desktop
    const DEFAULT_BODY_FONT_SIZE = 14; // Assuming your desktop body font is 14px

    let currentFontSize = parseFloat(getComputedStyle(targetElement).fontSize);

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentFontSize = parseFloat(savedFontSize);
    } else {
        currentFontSize = DEFAULT_BODY_FONT_SIZE;
    }
    targetElement.style.fontSize = currentFontSize + 'px';

    // IMPORTANT: Remove existing event listeners to prevent duplicates
    // This is crucial when re-initializing elements that might have been replaced
    // Cloning and replacing is a robust way to remove all existing listeners
    const cloneMinus = fontMinus.cloneNode(true);
    fontMinus.parentNode.replaceChild(cloneMinus, fontMinus);
    const cloneReset = fontReset.cloneNode(true);
    fontReset.parentNode.replaceChild(cloneReset, fontReset);
    const clonePlus = fontPlus.cloneNode(true);
    fontPlus.parentNode.replaceChild(clonePlus, fontPlus);

    // Re-add event listeners to the new cloned nodes
    cloneMinus.addEventListener('click', () => {
        currentFontSize = Math.max(8, currentFontSize - 1); // Minimum 8px
        targetElement.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);
        if (typeof window.triggerHeaderScrollCheck === 'function') {
            window.triggerHeaderScrollCheck();
        }
    });

    cloneReset.addEventListener('click', () => {
        currentFontSize = DEFAULT_BODY_FONT_SIZE;
        targetElement.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);
        if (typeof window.triggerHeaderScrollCheck === 'function') {
            window.triggerHeaderScrollCheck();
        }
    });

    clonePlus.addEventListener('click', () => {
        currentFontSize = Math.min(30, currentFontSize + 1); // Maximum 30px
        targetElement.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);
        if (typeof window.triggerHeaderScrollCheck === 'function') {
            window.triggerHeaderScrollCheck();
        }
    });
}

// Call initFontControls once on initial DOMContentLoaded
// The spa_loader.js will call it again after loading content
document.addEventListener('DOMContentLoaded', initFontControls);
