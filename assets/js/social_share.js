document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    const initSocialShare = () => {
        // Find and process all share buttons
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            // Check if the button already has a listener to prevent duplicates
            if (button.dataset.listenerAdded) {
                return;
            }
            button.dataset.listenerAdded = 'true';

            let timer;

            button.addEventListener('click', () => {
                const wrapper = button.nextElementSibling;
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

        // Find and process all copy link buttons
        const copyButtons = document.querySelectorAll('.copy-link-btn');
        const originalIconClass = 'fas fa-clipboard';
        const copiedIconClass = 'fas fa-check';

        copyButtons.forEach(button => {
            // Check if the button already has a listener
            if (button.dataset.listenerAdded) {
                return;
            }
            button.dataset.listenerAdded = 'true';
            
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

    // Create a MutationObserver to watch for changes to the content area's children
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            // Re-initialize social share when new content is added to the content area
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                initSocialShare();
            }
        }
    });

    // Start observing the content area for child element changes
    observer.observe(contentArea, { childList: true });

    // Initial call to set up listeners for the very first page load
    initSocialShare();
});