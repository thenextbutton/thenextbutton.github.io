const fontMinus = document.getElementById('font-minus');
const fontReset = document.getElementById('font-reset');
const fontPlus = document.getElementById('font-plus');
const contentColumn = document.querySelector('.content-column');

const DEFAULT_FONT_SIZE = 14;

let currentFontSize = parseFloat(getComputedStyle(contentColumn).fontSize);

const savedFontSize = localStorage.getItem('fontSize');
if (savedFontSize) {
    currentFontSize = parseFloat(savedFontSize);
} else {
    currentFontSize = DEFAULT_FONT_SIZE;
}
contentColumn.style.fontSize = currentFontSize + 'px';


fontMinus.addEventListener('click', () => {
    currentFontSize = Math.max(8, currentFontSize - 1);
    contentColumn.style.fontSize = currentFontSize + 'px';
    localStorage.setItem('fontSize', currentFontSize);
});

fontReset.addEventListener('click', () => {
    currentFontSize = DEFAULT_FONT_SIZE;
    contentColumn.style.fontSize = currentFontSize + 'px';
    localStorage.setItem('fontSize', currentFontSize);
});

fontPlus.addEventListener('click', () => {
    currentFontSize = Math.min(30, currentFontSize + 1);
    contentColumn.style.fontSize = currentFontSize + 'px';
    localStorage.setItem('fontSize', currentFontSize);
});