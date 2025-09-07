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
                
                if (activeWrapper && activeWrapper !== socialWrapper) {
                    handleClose();
                }

                socialWrapper.classList.toggle('active');
                activeWrapper = socialWrapper.classList.contains('active') ? socialWrapper : null;

                clearTimeout(globalTimer);
            });

            // --- Social links and copy button listeners ---
            socialLinks.forEach(link => {
                link.addEventListener('click', () => {
                    handleClose();
                });
            });

            copyButton.addEventListener('click', () => {
                const linkToCopy = copyButton.dataset.link;
                if (linkToCopy) {
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                        const icon = copyButton.querySelector('i');
                        const originalIconClass = 'fas fa-clipboard';
                        const copiedIconClass = 'fas fa-check';
                        icon.className = copiedIconClass;
                        
                        setTimeout(() => {
                            icon.className = originalIconClass;
                            handleClose(); 
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            });
            
            // This is to handle clicks outside of the share menu to close it
            document.addEventListener('click', (event) => {
                if (!socialWrapper.contains(event.target) && !shareButton.contains(event.target)) {
                    handleClose();
                }
            });
        });
    };
});