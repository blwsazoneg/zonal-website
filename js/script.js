document.addEventListener("DOMContentLoaded", () => {
  const programSection = document.querySelector(".program-section");
  const programContainer = document.querySelector(".program-container");
  const programCards = document.querySelectorAll(".program-card");

  if (!programContainer || programCards.length === 0) {
    console.error(
      "Program container or cards not found. Exiting slider script."
    );
    return;
  }

  const cardComputedStyle = getComputedStyle(programCards[0]);
  // Calculate card width including margin
  const cardWidthWithMargin =
    programCards[0].offsetWidth +
    parseFloat(cardComputedStyle.marginLeft) +
    parseFloat(cardComputedStyle.marginRight);

  const totalOriginalCards = 5; // Number of unique cards you have (Healing Streams, Rhapsody, Inner City, LoveWorld TV, LoveWorld Radio)
  const totalCardsInDOM = programCards.length; // This should be 2 * totalOriginalCards for looping
  let currentPosition = 0;
  const scrollSpeed = 0.5; // Adjust scroll speed (pixels per frame)

  // Initial positioning to place the first set of cards in view
  // We want the start of the *second* set of cards to align perfectly
  // with the beginning of the container when we reset the position.
  // So, we start the container at a negative offset equivalent to the width of the first set of cards.
  programContainer.style.transform = `translateX(-${
    cardWidthWithMargin * totalOriginalCards
  }px)`;
  currentPosition = -(cardWidthWithMargin * totalOriginalCards);

  function animateScroll() {
    currentPosition -= scrollSpeed;

    // Reset position to create seamless loop
    // When the *first* set of original cards has scrolled past the starting point,
    // reset to the beginning of the *second* set of original cards.
    // This makes the transition seamless because the content is identical.
    if (currentPosition <= -(cardWidthWithMargin * (totalOriginalCards * 2))) {
      currentPosition = -(cardWidthWithMargin * totalOriginalCards); // Reset to the start of the duplicated set
    }

    programContainer.style.transform = `translateX(${currentPosition}px)`;

    // Apply perspective effect to cards based on their position
    programCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = programSection.getBoundingClientRect(); // Get the .program-section rect

      // Calculate card's horizontal center relative to the container's center
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const distanceToCenter = cardCenterX - containerCenterX;

      // Normalize distance to a range (e.g., -1 to 1) for easier manipulation
      // Dividing by half the container width gives a normalized distance from the center.
      const normalizedDistance = distanceToCenter / (containerRect.width / 2);

      // Apply scaling, rotation, and vertical translation based on distance from center
      // Cards in the center are larger and straighter
      // Cards further from the center are smaller and slightly rotated/skewed
      let scale = 1 - Math.abs(normalizedDistance * 0.2); // Adjust 0.2 for stronger/weaker scaling
      scale = Math.max(0.7, scale); // Ensure cards don't shrink too much

      let rotateY = normalizedDistance * 15; // Adjust 15 for stronger/weaker rotation
      let translateY = Math.abs(normalizedDistance * 60); // Adjust 60 for more/less vertical movement

      // Adjust opacity for cards fading out at the edges
      let opacity = 1 - Math.abs(normalizedDistance * 1); // Adjust 1 for faster/slower fade
      opacity = Math.max(0.2, opacity); // Don't let cards disappear completely

      card.style.transform = `translateY(${translateY}px) scale(${scale}) perspective(800px) rotateY(${rotateY}deg)`;
      card.style.opacity = opacity;
    });

    requestAnimationFrame(animateScroll);
  }

  animateScroll(); // Start the animation
});
