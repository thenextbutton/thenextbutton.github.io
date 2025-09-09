document.addEventListener('DOMContentLoaded', () => {
  const listItems = document.querySelectorAll('.content-list li');
  let delay = 0;

  listItems.forEach(item => {
    setTimeout(() => {
      item.classList.add('show');
    }, delay);
    delay += 100; // Adjust this value to change the delay between each item
  });
});