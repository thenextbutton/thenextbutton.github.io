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
                event.stopPropagation(); // Prevents the click from bubbling up to the document
                
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

            // --- Social links and copy button listeners ---
            socialLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    // Start the 5-second timer when a social link is clicked
                    clearTimeout(globalTimer);
                    globalTimer = setTimeout(handleClose, 5000);
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
                        
                        // Give visual feedback then clear the timer and close the menu after 2 seconds
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