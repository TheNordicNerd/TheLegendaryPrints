import { onMounted, onUnmounted } from 'vue';

export const useScrollAnimation = () => {
  let observer: IntersectionObserver | null = null;

  const initObserver = () => {
    if (typeof window === 'undefined') return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Optional: unobserve after animating (prevents re-animation on scroll up)
            // observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Observe all elements with data-animate attribute
      const animateElements = document.querySelectorAll('[data-animate]');
      animateElements.forEach((el) => observer?.observe(el));

      // Observe all elements with data-animate-stagger attribute
      const staggerElements = document.querySelectorAll('[data-animate-stagger]');
      staggerElements.forEach((el) => observer?.observe(el));

      console.log(`Observing ${animateElements.length} animated elements`);
      console.log(`Observing ${staggerElements.length} stagger elements`);
    }, 100);
  };

  const destroyObserver = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    initObserver();
  });

  onUnmounted(() => {
    destroyObserver();
  });

  return {
    initObserver,
    destroyObserver,
  };
};
