<template>
  <div class="tooltip-wrapper" @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide">
    <slot />
    <Transition name="tooltip-fade">
      <div
        v-show="isVisible"
        :class="[
          'tooltip',
          `tooltip-${position}`,
          sizeClasses,
        ]"
        role="tooltip"
      >
        {{ text }}
        <div :class="['tooltip-arrow', `tooltip-arrow-${position}`]" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  /**
   * Tooltip Component
   *
   * A styled tooltip that appears on hover/focus
   *
   * @component
   * @example
   * <Tooltip text="Sign in to your account">
   *   <Button icon="i-lucide-user" />
   * </Tooltip>
   */

  interface TooltipProps {
    /** Tooltip text content */
    text: string;
    /** Position of the tooltip relative to the trigger element */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Size of the tooltip */
    size?: 'sm' | 'md' | 'lg';
    /** Delay before showing tooltip (ms) */
    delay?: number;
  }

  const props = withDefaults(defineProps<TooltipProps>(), {
    position: 'bottom',
    size: 'md',
    delay: 200,
  });

  const isVisible = ref(false);
  let showTimeout: ReturnType<typeof setTimeout> | null = null;

  const sizeClasses = computed(() => {
    const sizes = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
      lg: 'text-base px-4 py-2',
    };
    return sizes[props.size];
  });

  const show = () => {
    showTimeout = setTimeout(() => {
      isVisible.value = true;
    }, props.delay);
  };

  const hide = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
    isVisible.value = false;
  };

  onUnmounted(() => {
    if (showTimeout) {
      clearTimeout(showTimeout);
    }
  });
</script>

<style scoped>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .tooltip {
    position: absolute;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    border-radius: 6px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  /* Position variants */
  .tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  .tooltip-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  /* Arrow */
  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  .tooltip-arrow-top {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0 5px;
    border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
  }

  .tooltip-arrow-bottom {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent rgba(0, 0, 0, 0.9) transparent;
  }

  .tooltip-arrow-left {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent rgba(0, 0, 0, 0.9);
  }

  .tooltip-arrow-right {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-color: transparent rgba(0, 0, 0, 0.9) transparent transparent;
  }

  /* Transition */
  .tooltip-fade-enter-active,
  .tooltip-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .tooltip-fade-enter-from,
  .tooltip-fade-leave-to {
    opacity: 0;
  }

  .tooltip-top.tooltip-fade-enter-from,
  .tooltip-top.tooltip-fade-leave-to {
    transform: translateX(-50%) translateY(4px);
  }

  .tooltip-bottom.tooltip-fade-enter-from,
  .tooltip-bottom.tooltip-fade-leave-to {
    transform: translateX(-50%) translateY(-4px);
  }

  .tooltip-left.tooltip-fade-enter-from,
  .tooltip-left.tooltip-fade-leave-to {
    transform: translateY(-50%) translateX(4px);
  }

  .tooltip-right.tooltip-fade-enter-from,
  .tooltip-right.tooltip-fade-leave-to {
    transform: translateY(-50%) translateX(-4px);
  }

  /* Accessibility - Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .tooltip-fade-enter-active,
    .tooltip-fade-leave-active {
      transition-duration: 0.01ms !important;
    }
  }
</style>
