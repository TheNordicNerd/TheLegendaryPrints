/**
 * useHeroAnimation Composable
 *
 * Provides animation functionality for hero sections using Intersection Observer.
 * Detects when the hero section enters the viewport and triggers animations.
 *
 * @returns {Object} Animation state and ref
 * @returns {Ref<HTMLElement | null>} heroRef - Template ref for the hero element
 * @returns {Ref<boolean>} isVisible - Whether the hero is visible in viewport
 *
 * @example
 * const { heroRef, isVisible } = useHeroAnimation();
 */

export const useHeroAnimation = () => {
  const heroRef = ref<HTMLElement | null>(null);
  const isVisible = ref(false);

  onMounted(() => {
    if (!heroRef.value) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger animation when hero enters viewport
          if (entry.isIntersecting) {
            isVisible.value = true;
            // Optionally disconnect after first intersection
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before element enters
      }
    );

    // Start observing
    observer.observe(heroRef.value);

    // Cleanup on unmount
    onUnmounted(() => {
      observer.disconnect();
    });
  });

  return {
    heroRef,
    isVisible,
  };
};
