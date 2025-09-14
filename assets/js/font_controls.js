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

    // Removed controlsWrapper and related observer/transition logic
    // as visibility is now controlled by scroll_animations.js via scroll listener.

    const applyFontSize = (newSize) => {
        l = newSize;
        o.style.fontSize = l + "px";
        localStorage.setItem("fontSize", l);

        // No setTimeout needed here for the control box, as it won't react to font changes.
        // It will only react to actual scrolling.

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