document.addEventListener('DOMContentLoaded', () => {
    window.initSocialShare = () => {
        const shareContainers = document.querySelectorAll('.share-container');

        shareContainers.forEach(container => {
            const shareButton = container.querySelector('.share-btn');
            const socialWrapper = container.querySelector('.social-icons-wrapper');
            const copyButton = container.querySelector('.copy-link-btn');
            const socialLinks = container.querySelectorAll('.social-icons-wrapper a');
            
            let timer;

            const handleClose = () => {
                socialWrapper.classList.remove('active');
                clearTimeout(timer);
            };

            // Event listener for the "Share Project" button
            shareButton.addEventListener('click', () => {
                const isActive = socialWrapper.classList.toggle('active');
                clearTimeout(timer);

                if (isActive) {
                    timer = setTimeout(handleClose, 5000); // 5-second timer
                }
            });

            // Event listener for the social links (Facebook, Twitter, etc.)
            socialLinks.forEach(link => {
                link.addEventListener('click', () => {
                    handleClose(); // Close the wrapper immediately
                });
            });

            // Event listener for the "Copy Link" button
            copyButton.addEventListener('click', () => {
                const linkToCopy = copyButton.dataset.link;
                if (linkToCopy) {
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                        const icon = copyButton.querySelector('i');
                        const originalIconClass = 'fas fa-clipboard';
                        const copiedIconClass = 'fas fa-check';
                        icon.className = copiedIconClass;
                        
                        // Close the wrapper after a 2-second visual feedback
                        setTimeout(() => {
                            icon.className = originalIconClass;
                            handleClose();
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            });
        });
    };
});