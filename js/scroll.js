/**
 * Scroll & Navigation Manager Module
 * Handles scroll progress, page active links, header states, back-to-top, and mobile drawer.
 */

export function initScroll() {
  const header = document.getElementById('header');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navLinksList = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1. Highlight Active Page Nav Link based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isDetailUnderPosts = currentPath === 'post-detail.html' && href === 'posts.html';
    if (href === currentPath || (currentPath === '' && href === 'index.html') || isDetailUnderPosts) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Scroll Progress & Header Shadow & BackToTop Visibility
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (header) {
      if (scrollTop > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // 3. Back To Top Action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Mobile Navigation Menu Toggle
  if (menuToggleBtn && navLinksList) {
    menuToggleBtn.addEventListener('click', () => {
      navLinksList.classList.toggle('open');
      menuToggleBtn.innerHTML = navLinksList.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        menuToggleBtn.innerHTML = '☰';
      });
    });
  }

  // 5. Scroll Fade-in Animation
  const fadeElements = document.querySelectorAll('.fade-in-section');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // 6. Skill Bar Fill Animation
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            if (level) {
              bar.style.width = `${level}%`;
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const skillContainer = document.querySelector('.skills-grid') || document.getElementById('skills');
    if (skillContainer) {
      skillObserver.observe(skillContainer);
    } else {
      // Fallback
      skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        if (level) bar.style.width = `${level}%`;
      });
    }
  }
}
