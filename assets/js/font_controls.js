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

    if (typeof controlsObserver === 'undefined') {
        console.error("controlsObserver is not defined. Ensure scroll_animations.js loads before font_control.js");
        return;
    }

    const applyFontSize = (newSize) => {
        // --- MODIFIED LOGIC: Temporarily disable CSS transition AND unobserve ---
        if (controlsWrapper) {
            // Store the original transition property
            const originalTransition = controlsWrapper.style.transition;
            controlsWrapper.dataset.originalTransition = originalTransition; // Store in a data attribute

            // Disable all transitions on the control box
            controlsWrapper.style.transition = 'none';
            console.log("Controls Transition: DISABLED.");

            controlsObserver.unobserve(controlsWrapper);
            console.log("Controls Observer: UN-OBSERVING for font change.");
        }
        // --- END MODIFIED LOGIC ---

        l = newSize;
        o.style.fontSize = l + "px";
        localStorage.setItem("fontSize", l);

        setTimeout(() => {
            if (controlsWrapper) {
                // Ensure it's visible by removing the fade-out class
                controlsWrapper.classList.remove('fade-out-controls');

                // Re-observe after the delay
                controlsObserver.observe(controlsWrapper);
                console.log("Controls Observer: RE-OBSERVING after font change.");

                // --- MODIFIED LOGIC: Re-enable CSS transition ---
                // Restore the original transition property
                if (controlsWrapper.dataset.originalTransition !== undefined) {
                    controlsWrapper.style.transition = controlsWrapper.dataset.originalTransition;
                    console.log("Controls Transition: RE-ENABLED.");
                    delete controlsWrapper.dataset.originalTransition; // Clean up data attribute
                }
                // --- END MODIFIED LOGIC ---
            }
        }, 1500); // Keep increased delay for stability

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