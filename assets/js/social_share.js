document.addEventListener('DOMContentLoaded', () => {
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
          // Change icon to show "copied"
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
});