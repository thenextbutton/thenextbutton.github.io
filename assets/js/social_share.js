document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    const initSocialShare = () => {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            let timer;

            newButton.addEventListener('click', () => {
                const wrapper = newButton.nextElementSibling;
                const isActive = wrapper.classList.toggle('active');

                // Clear any existing timer
                clearTimeout(timer);

                // Start a new timer if the icons are now active
                if (isActive) {
                    timer = setTimeout(() => {
                        wrapper.classList.remove('active');
                    }, 5000); // 5000 milliseconds = 5 seconds
                }
            });
        });

        const copyButtons = document.querySelectorAll('.copy-link-btn');
        const originalIconClass = 'fas fa-clipboard';
        const copiedIconClass = 'fas fa-check';

        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const linkToCopy = button.dataset.link;
                if (linkToCopy) {
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                        const icon = button.querySelector('i');
                        icon.className = copiedIconClass;
                        setTimeout(() => {
                            icon.className = originalIconClass;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            });
        });
    };

    const observer = new MutationObserver((mutationsList) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                initSocialShare();
            }
        }
    });

    observer.observe(contentArea, { childList: true });

    // Initial check for content
    initSocialShare();
});