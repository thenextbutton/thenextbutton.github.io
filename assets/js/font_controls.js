document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("font-toggle-btn");
  const submenu = document.querySelector(".font-submenu");

  toggleBtn.addEventListener("click", () => {
  const rect = toggleBtn.getBoundingClientRect();
  submenu.style.top = `${rect.top}px`;
  submenu.classList.toggle("hidden");
  });

  const htmlRoot = document.documentElement;
  let currentSize = parseFloat(getComputedStyle(htmlRoot).fontSize);
  const savedSize = localStorage.getItem("fontSize");
  currentSize = savedSize ? parseFloat(savedSize) : 14;
  htmlRoot.style.fontSize = currentSize + "px";

  const applyFontSize = (newSize) => {
    currentSize = newSize;
    htmlRoot.style.fontSize = currentSize + "px";
    localStorage.setItem("fontSize", currentSize);
    if (typeof window.triggerHeaderScrollCheck === 'function') {
      window.triggerHeaderScrollCheck();
    }
  };

  document.getElementById("font-minus").addEventListener("click", () => {
    applyFontSize(Math.max(8, currentSize - 1));
  });

  document.getElementById("font-reset").addEventListener("click", () => {
    applyFontSize(14);
  });

  document.getElementById("font-plus").addEventListener("click", () => {
    applyFontSize(Math.min(25, currentSize + 1));
  });
});
