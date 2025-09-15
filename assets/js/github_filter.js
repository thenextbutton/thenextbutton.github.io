const tagContainer = document.querySelector('.all-tags');
const projectCards = document.querySelectorAll('.github-project-item');

if (tagContainer) {
  tagContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.tag')) {
      const selectedCategory = target.getAttribute('data-category');
       // Remove 'active' class from all tags and add it to the clicked one
      document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
      target.classList.add('active');
       projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          // Show the card
          card.classList.remove('slide-out');
          card.style.display = 'flex'; // Revert to original display property
        } else {
          // Hide the card with a smooth animation
          card.classList.add('slide-out');
          // Use a timeout to fully remove the card from the layout after the animation
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // 300ms matches the animation duration
        }
      });
    }
  });
}