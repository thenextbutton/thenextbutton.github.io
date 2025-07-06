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

    let i = e.cloneNode(!0);
    e.parentNode.replaceChild(i, e);

    let c = t.cloneNode(!0);
    t.parentNode.replaceChild(c, t);

    let d = n.cloneNode(!0);
    n.parentNode.replaceChild(d, n);

    const controlsWrapper = document.querySelector('.bottom-right-controls-wrapper');

    // Make sure controlsObserver is defined and accessible
    // It should be coming from scroll_animations.js which must be loaded first.
    if (typeof controlsObserver === 'undefined') {
        console.error("controlsObserver is not defined. Ensure scroll_animations.js loads before font_control.js");
        return; // Exit if observer isn't ready
    }

    const applyFontSize = (newSize) => {
        // --- NEW LOGIC: Unobserve before changing font size ---
        if (controlsWrapper) { // Check if controlsWrapper exists
            controlsObserver.unobserve(controlsWrapper);
            console.log("Controls Observer: UN-OBSERVING for font change.");
        }
        // --- END NEW LOGIC ---

        l = newSize;
        o.style.fontSize = l + "px";
        localStorage.setItem("fontSize", l);

        // --- NEW LOGIC: Re-observe after a delay ---
        // Increased delay to 750ms - experiment with this value!
        setTimeout(() => {
            if (controlsWrapper) { // Check if controlsWrapper exists
                controlsWrapper.classList.remove('fade-out-controls'); // Ensure visibility
                controlsObserver.observe(controlsWrapper);
                console.log("Controls Observer: RE-OBSERVING after font change.");
            }
        }, 1500); // Increased delay
        // --- END NEW LOGIC ---

        // Check if triggerHeaderScrollCheck exists before calling
        if (typeof window.triggerHeaderScrollCheck === 'function') {
            window.triggerHeaderScrollCheck();
        }
    };

    i.addEventListener("click", () => {
        applyFontSize(Math.max(8, l - 1));
    });

    c.addEventListener("click", () => {
        applyFontSize(14);
    });

    d.addEventListener("click", () => {
        applyFontSize(Math.min(25, l + 1));
    });
}

document.addEventListener("DOMContentLoaded", initFontControls);