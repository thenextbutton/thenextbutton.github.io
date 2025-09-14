function fadeInLists() {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Check if the element is in the viewport
      if (entry.isIntersecting) {
        // Add the 'show' class to trigger the animation
        const listItem = entry.target;
        listItem.classList.add('show');
        
        // Stop observing the element to save performance
        observer.unobserve(listItem);
      }
    });
  }, {
    threshold: 1.0 // Trigger when % of the element is visible
  });

  // Select all lists with the .content-list class
  const lists = document.querySelectorAll('.content-list');

  // Loop through each list
  lists.forEach(list => {
    // For each list, observe its child <li> elements
    list.querySelectorAll('li').forEach(item => {
      observer.observe(item);
    });
  });
}