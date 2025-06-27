const fontMinusBtn = document.getElementById('font-minus');
const fontPlusBtn = document.getElementById('font-plus');
const contentColumn = document.querySelector('.content-column');

let currentFontSize = parseFloat(getComputedStyle(contentColumn).fontSize);

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STEP = 1;

function updateFontSize() {
    contentColumn.style.fontSize = currentFontSize + 'px';
}

fontMinusBtn.addEventListener('click', () => {
    if (currentFontSize > MIN_FONT_SIZE) {
        currentFontSize -= FONT_SIZE_STEP;
        updateFontSize();
    }
});

fontPlusBtn.addEventListener('click', () => {
    if (currentFontSize < MAX_FONT_SIZE) {
        currentFontSize += FONT_SIZE_STEP;
        updateFontSize();
    }
});