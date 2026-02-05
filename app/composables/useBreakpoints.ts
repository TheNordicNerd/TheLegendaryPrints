import { ref, computed, onMounted, onUnmounted } from 'vue';

// Tailwind's default breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const useBreakpoints = () => {
  const windowWidth = ref(0);

  const updateWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });

  // Check if current width is greater than or equal to breakpoint
  const isGreaterOrEqual = (breakpoint: Breakpoint) => {
    return computed(() => windowWidth.value >= breakpoints[breakpoint]);
  };

  // Check if current width is less than breakpoint
  const isLessThan = (breakpoint: Breakpoint) => {
    return computed(() => windowWidth.value < breakpoints[breakpoint]);
  };

  // Check if current width is between two breakpoints
  const isBetween = (min: Breakpoint, max: Breakpoint) => {
    return computed(
      () => windowWidth.value >= breakpoints[min] && windowWidth.value < breakpoints[max]
    );
  };

  // Individual breakpoint checks (commonly used)
  const isSm = computed(() => windowWidth.value >= breakpoints.sm);
  const isMd = computed(() => windowWidth.value >= breakpoints.md);
  const isLg = computed(() => windowWidth.value >= breakpoints.lg);
  const isXl = computed(() => windowWidth.value >= breakpoints.xl);
  const is2xl = computed(() => windowWidth.value >= breakpoints['2xl']);

  // Current breakpoint name
  const current = computed<Breakpoint | 'xs'>(() => {
    const width = windowWidth.value;
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  });

  return {
    windowWidth: computed(() => windowWidth.value),
    isGreaterOrEqual,
    isLessThan,
    isBetween,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    current,
    breakpoints,
  };
};
