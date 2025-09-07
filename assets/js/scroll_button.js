/*
 * This script handles the logic for the scroll-to-bottom button.
 * It shows the button when the user scrolls down and provides a smooth scroll to the bottom of the page.
 */

// Wait for the entire page content to load before running the script.
window.addEventListener('DOMContentLoaded', () => {

  // Get a reference to the button container and the button itself.
  const scrollBtnContainer = document.getElementById('scroll-to-bottom-container');
  const scrollBtn = document.getElementById('scroll-to-bottom-btn');

  // Define the scroll threshold (in pixels) to show the button.
  const scrollThreshold = 200;

  /**
   * Toggles the visibility of the scroll button based on the scroll position.
   */
  const toggleScrollButton = () => {
    // Check if the current vertical scroll position is greater than the threshold.
    if (window.scrollY > scrollThreshold) {
      scrollBtnContainer.classList.add('active');
    } else {
      scrollBtnContainer.classList.remove('active');
    }
  };

  /**
   * Handles the smooth scroll to the bottom of the page.
   */
  const scrollToBottom = () => {
    // Get the total height of the document body.
    const documentHeight = document.body.scrollHeight;
    
    // Smoothly scroll the window to the bottom.
    window.scrollTo({
      top: documentHeight,
      behavior: 'smooth'
    });
  };

  // Add the scroll event listener to the window.
  window.addEventListener('scroll', toggleScrollButton);

  // Add a click event listener to the button to trigger the scroll.
  scrollBtn.addEventListener('click', scrollToBottom);

});

