document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content-area');

  const initSocialShare = () => {
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
      button.addEventListener('click', () => {
        const wrapper = button.nextElementSibling;
        wrapper.classList.toggle('active');
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

  // Run the function once in case the content is already there
  initSocialShare();

  // Create an observer to watch for changes to the content area
  const observer = new MutationObserver((mutationsList, observer) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Content has been added or removed, so re-initialize
        initSocialShare();
      }
    }
  });

  // Start observing the content area for child element changes
  observer.observe(contentArea, { childList: true });
});