const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // Check if the element is in the viewport
    if (entry.isIntersecting) {
      // Get the list item and add the 'show' class to trigger the animation
      const listItem = entry.target;
      listItem.classList.add('show');
      
      // Stop observing the element to save performance
      observer.unobserve(listItem);
    }
  });
}, {
  // Options for the observer
  threshold: 0.2 // Trigger when 20% of the element is visible
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