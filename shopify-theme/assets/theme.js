/**
 * The Legendary Prints - Theme JavaScript
 * Main JavaScript file for theme functionality
 */

// Cart functionality
class CartManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateCartCount();
    this.setupEventListeners();
  }

  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.updateCartBubbles(cart.item_count);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  updateCartBubbles(count) {
    document.querySelectorAll('.cart-count-bubble').forEach(bubble => {
      bubble.textContent = count;
      bubble.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  setupEventListeners() {
    // Listen for cart updates
    document.addEventListener('cart:updated', (event) => {
      this.updateCartBubbles(event.detail.item_count);
    });
  }
}

// Product quick view/modal functionality
class ProductModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    // Add quick view buttons to product cards if needed
    // This can be extended for quick view functionality
  }
}

// Announcement bar dismiss functionality
class AnnouncementBar {
  constructor() {
    this.init();
  }

  init() {
    const dismissBtn = document.querySelector('.announcement-bar-close');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        const bar = document.querySelector('.announcement-bar');
        if (bar) {
          bar.style.display = 'none';
          localStorage.setItem('announcement-dismissed', 'true');
        }
      });
    }

    // Check if previously dismissed
    if (localStorage.getItem('announcement-dismissed') === 'true') {
      const bar = document.querySelector('.announcement-bar');
      if (bar) bar.style.display = 'none';
    }
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Lazy loading for images
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
}

// Form validation helper
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
  });

  return isValid;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart manager
  new CartManager();

  // Initialize product modal
  new ProductModal();

  // Initialize announcement bar
  new AnnouncementBar();

  // Initialize smooth scroll
  initSmoothScroll();

  // Initialize lazy loading
  initLazyLoading();
});

// Accessibility: Trap focus in modals
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Export utilities for use in other scripts
window.ThemeUtils = {
  trapFocus,
  validateForm
};
