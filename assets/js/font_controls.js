// Wrap the font control logic in a function that can be called externally
function initFontControls() {
    const fontMinus = document.getElementById('font-minus');
    const fontReset = document.getElementById('font-reset');
    const fontPlus = document.getElementById('font-plus');
    const contentColumn = document.querySelector('.content-column'); // Select contentColumn dynamically

    // If contentColumn is not found (e.g., page still loading), exit
    if (!contentColumn) {
        console.warn("content-column not found for font controls. Retrying soon.");
        // You might want to add a small delay and retry here if it's a common race condition
        return;
    }

    const DEFAULT_FONT_SIZE = 14;

    let currentFontSize = parseFloat(getComputedStyle(contentColumn).fontSize);

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentFontSize = parseFloat(savedFontSize);
    } else {
        currentFontSize = DEFAULT_FONT_SIZE;
    }
    contentColumn.style.fontSize = currentFontSize + 'px';

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
        currentFontSize = Math.max(8, currentFontSize - 1); // Prevents font from going below 8px
        contentColumn.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);
    });

    cloneReset.addEventListener('click', () => {
        currentFontSize = DEFAULT_FONT_SIZE;
        contentColumn.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);
    });

    clonePlus.addEventListener('click', () => {
        currentFontSize = Math.min(30, currentFontSize + 1); // Prevents font from going above 30px
        contentColumn.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('fontSize', currentFontSize);
    });
}

// Call initFontControls once on initial DOMContentLoaded
// The spa_loader.js will call it again after loading content
document.addEventListener('DOMContentLoaded', initFontControls);
