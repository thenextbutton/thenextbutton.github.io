document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };


    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                entry.target.classList.remove('hidden-scroll');

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const projectItems = document.querySelectorAll('.github-project-item');

    projectItems.forEach(item => {

        item.classList.add('hidden-scroll');

        observer.observe(item);
    });
});
