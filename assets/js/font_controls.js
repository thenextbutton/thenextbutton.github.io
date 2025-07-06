function initFontControls() {
    let e = document.getElementById("font-minus"),
        t = document.getElementById("font-reset"),
        n = document.getElementById("font-plus"),
        o = document.documentElement;

    if (!o) {
        console.warn("Target element (html) not found for font controls.");
        return;
    }

    let l = parseFloat(getComputedStyle(o).fontSize);
    let r = localStorage.getItem("fontSize");
    l = r ? parseFloat(r) : 14;
    o.style.fontSize = l + "px";

    // Re-create button elements to remove existing event listeners
    // This is good practice if you're replacing elements, but for simple event listeners
    // directly adding them is also fine if the elements aren't being replaced after init.
    // For consistency with your original code, we'll keep the cloneNode pattern.
    let i = e.cloneNode(!0);
    e.parentNode.replaceChild(i, e);

    let c = t.cloneNode(!0);
    t.parentNode.replaceChild(c, t);

    let d = n.cloneNode(!0);
    n.parentNode.replaceChild(d, n);

    // Get the control box wrapper for convenience
    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');

    i.addEventListener("click", () => {
        // --- NEW LOGIC: Unobserve before changing font size ---
        if (typeof controlsObserver !== 'undefined' && controlsWrapper) {
            controlsObserver.unobserve(controlsWrapper);
        }
        // --- END NEW LOGIC ---

        l = Math.max(8, l - 1);
        o.style.fontSize = l + "px";
        localStorage.setItem("fontSize", l);

        // --- NEW LOGIC: Re-observe after a delay ---
        setTimeout(() => {
            if (typeof controlsObserver !== 'undefined' && controlsWrapper) {
                controlsWrapper.classList.remove('fade-out-controls'); // Ensure visibility
                controlsObserver.observe(controlsWrapper);
            }
        }, 300); // Adjust delay if needed
        // --- END NEW LOGIC ---

        "function" == typeof window.triggerHeaderScrollCheck && window.triggerHeaderScrollCheck();
    });

    c.addEventListener("click", () => {
        // --- NEW LOGIC: Unobserve before changing font size ---
        if (typeof controlsObserver !== 'undefined' && controlsWrapper) {
            controlsObserver.unobserve(controlsWrapper);
        }
        // --- END NEW LOGIC ---

        l = 14;
        o.style.fontSize = l + "px";
        localStorage.setItem("fontSize", l);

        // --- NEW LOGIC: Re-observe after a delay ---
        setTimeout(() => {
            if (typeof controlsObserver !== 'undefined' && controlsWrapper) {
                controlsWrapper.classList.remove('fade-out-controls'); // Ensure visibility
                controlsObserver.observe(controlsWrapper);
            }
        }, 300); // Adjust delay if needed
        // --- END NEW LOGIC ---

        "function" == typeof window.triggerHeaderScrollCheck && window.triggerHeaderScrollCheck();
    });

    d.addEventListener("click", () => {
        // --- NEW LOGIC: Unobserve before changing font size ---
        if (typeof controlsObserver !== 'undefined' && controlsWrapper) {
            controlsObserver.unobserve(controlsWrapper);
        }
        // --- END NEW LOGIC ---

        l = Math.min(25, l + 1);
        o.style.fontSize = l + "px";
        localStorage.setItem("fontSize", l);

        // --- NEW LOGIC: Re-observe after a delay ---
        setTimeout(() => {
            if (typeof controlsObserver !== 'undefined' && controlsWrapper) {
                controlsWrapper.classList.remove('fade-out-controls'); // Ensure visibility
                controlsObserver.observe(controlsWrapper);
            }
        }, 300); // Adjust delay if needed
        // --- END NEW LOGIC ---

        "function" == typeof window.triggerHeaderScrollCheck && window.triggerHeaderScrollCheck();
    });
}
document.addEventListener("DOMContentLoaded", initFontControls);