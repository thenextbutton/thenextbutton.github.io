function fadeInLists() {
  const listItems = document.querySelectorAll('.content-list li');
  let delay = 0;

  listItems.forEach(item => {
    setTimeout(() => {
      item.classList.add('show');
    }, delay);
    delay += 100;
  });
}