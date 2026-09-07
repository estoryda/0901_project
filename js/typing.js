/**
 * Typing Effect Module
 * Creates a dynamic typing and erasing animation for the hero section subtitle.
 */

export function initTyping() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'Frontend Developer',
    'HTML / CSS / JavaScript Specialist',
    'UI/UX Passionate Creator',
    'Continuous Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseEnd = 2000;
  const pauseStart = 500;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
}
