document.addEventListener('DOMContentLoaded', () => {
    // This function will be called by spa_loader.js when content is ready
    window.initSocialShare = () => {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            // Remove any old listeners before adding new ones
            const oldButton = button;
            const newButton = oldButton.cloneNode(true);
            oldButton.parentNode.replaceChild(newButton, oldButton);
            
            let timer;

            newButton.addEventListener('click', () => {
                const wrapper = newButton.nextElementSibling;
                const isActive = wrapper.classList.toggle('active');

                clearTimeout(timer);

                if (isActive) {
                    timer = setTimeout(() => {
                        wrapper.classList.remove('active');
                    }, 5000);
                }
            });
        });

        const copyButtons = document.querySelectorAll('.copy-link-btn');
        const originalIconClass = 'fas fa-clipboard';
        const copiedIconClass = 'fas fa-check';

        copyButtons.forEach(button => {
            const oldButton = button;
            const newButton = oldButton.cloneNode(true);
            oldButton.parentNode.replaceChild(newButton, oldButton);

            newButton.addEventListener('click', () => {
                const linkToCopy = newButton.dataset.link;
                if (linkToCopy) {
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                        const icon = newButton.querySelector('i');
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

    // No longer need to call initSocialShare here because spa_loader.js will handle it
});