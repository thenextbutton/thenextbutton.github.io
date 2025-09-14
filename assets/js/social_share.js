document.addEventListener('DOMContentLoaded', () => {
    let globalTimer = null;
    let activeWrapper = null;

    const handleClose = () => {
        if (activeWrapper) {
            activeWrapper.classList.remove('active');
            activeWrapper = null;
        }
        clearTimeout(globalTimer);
    };

    window.initSocialShare = () => {
        const shareContainers = document.querySelectorAll('.share-container');

        shareContainers.forEach(container => {
            const shareButton = container.querySelector('.share-btn');
            const socialWrapper = container.querySelector('.social-icons-wrapper');
            const copyButton = container.querySelector('.copy-link-btn');
            const socialLinks = socialWrapper.querySelectorAll('a');

            // --- Main "Share Project" button listener ---
            shareButton.addEventListener('click', (event) => {
                event.stopPropagation();
                
                // If another project is open, close it first
                if (activeWrapper && activeWrapper !== socialWrapper) {
                    handleClose();
                }

                // Toggle the current one
                socialWrapper.classList.toggle('active');
                activeWrapper = socialWrapper.classList.contains('active') ? socialWrapper : null;

                // Stop the timer if the menu is closed
                clearTimeout(globalTimer);
            });

            // --- Social links listener ---
            socialLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Clear any existing timer
                    clearTimeout(globalTimer);
                    // Start a new 5-second timer to close the menu
                    globalTimer = setTimeout(handleClose, 5000);
                });
            });

            // --- Copy Link button listener ---
            copyButton.addEventListener('click', () => {
                const linkToCopy = copyButton.dataset.link;
                if (linkToCopy) {
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                        const icon = copyButton.querySelector('i');
                        const originalIconClass = 'fas fa-clipboard';
                        const copiedIconClass = 'fas fa-check';
                        icon.className = copiedIconClass;
                        
                        // Clear any existing timer
                        clearTimeout(globalTimer);
                        
                        // Start a new 5-second timer to close the menu, and also revert the icon
                        globalTimer = setTimeout(() => {
                            icon.className = originalIconClass;
                            handleClose();
                        }, 5000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            });
            
            // This handles clicks outside of the share menu to close it
            document.addEventListener('click', (event) => {
                if (activeWrapper && !activeWrapper.contains(event.target) && !shareButton.contains(event.target)) {
                    handleClose();
                }
            });
        });
    };
});