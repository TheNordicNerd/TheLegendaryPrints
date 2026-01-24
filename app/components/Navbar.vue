<template>
  <header class="navbar-header w-full top-0 left-0 right-0 z-50 shadow">
    <nav
      class="navbar-container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6"
      aria-label="Main navigation"
    >
      <div class="navbar-content mx-auto flex items-center justify-between max-w-[1200px] w-full">
        <!-- Logo -->
        <div class="navbar-logo flex-shrink-0">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 font-extrabold hover:text-accent-500-600 transition-colors duration-200"
            aria-label="The Legendary Prints - Home"
          >
            <div
              class="p-4 mr-2 flex items-center justify-center rounded-lg text-white bg-accent-500"
            >
              <Icon name="i-lucide-printer" size="24" aria-hidden="true" />
            </div>
            <div class="flex flex-col justify-start items-start">
              <h3 class="hidden text-lg sm:inline text-text-primary">The Legendary Prints</h3>
              <span class="hidden text-xs sm:inline text-text-secondary"
                >It Just Hits Different.</span
              >
              <span class="sm:hidden">TLP</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex lg:items-center lg:gap-8">
          <ul class="flex items-center gap-6">
            <li v-for="link in links" :key="link.to" class="relative group text-sm">
              <!-- Links without children -->
              <NavLink
                v-if="!link.children || link.children.length === 0"
                :to="link.to"
                :icon="link.icon"
                :text="link.text"
                :is-drop-down="false"
              />

              <!-- Links with children (dropdown) -->
              <div v-else class="relative z-50">
                <div
                  @mouseenter="openDesktopDropdown(link.text)"
                  @mouseleave="scheduleCloseDesktopDropdown"
                >
                  <NavLink
                    to="/products"
                    :icon="link.icon"
                    :text="link.text"
                    :is-drop-down="true"
                    :active-dropdown="activeDesktopDropdown"
                  />
                </div>

                <!-- Dropdown Menu -->
                <div
                  v-show="activeDesktopDropdown === link.text"
                  class="dropdown-menu absolute top-full left-0 mt-2 w-56 bg-surface-raised rounded-lg shadow-xl border border-border-subtle py-2 opacity-0 scale-95 transition-all duration-200"
                  :class="{ 'dropdown-visible': activeDesktopDropdown === link.text }"
                  @mouseenter="cancelCloseDesktopDropdown"
                  @mouseleave="closeDesktopDropdown"
                >
                  <NavLink
                    v-for="child in link.children"
                    :to="child.to"
                    :icon="child?.icon"
                    :text="child.text"
                    :key="child.to"
                    :is-drop-down-child="true"
                  />
                </div>
              </div>
            </li>
          </ul>

          <!-- CTA Button -->
          <Button
            variant="primary"
            class="text-white rounded-md"
            size="sm"
            icon-left="i-lucide-package"
            left-icon-size="16"
            to="/products"
          >
            Order Now
          </Button>
          <div class="flex justify-start gap-2">
            <!-- Cart Button -->
            <div class="relative">
              <Button
                variant="ghost"
                size="sm"
                rounded="lg"
                icon="i-lucide-shopping-cart"
                icon-size="20"
                label="View cart"
                @click="handleCartClick"
              />
              <div
                v-if="cartItemCount > 0"
                class="absolute -top-1 -right-1 bg-accent-700 text-text-inverse text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
                aria-label="`${cartItemCount} items in cart`"
              >
                {{ cartItemCount }}
              </div>
            </div>

            <!-- Theme Toggle -->
            <Button
              variant="ghost"
              size="sm"
              rounded="lg"
              :icon="themeIcon"
              icon-size="20"
              label="Toggle theme"
              @click="handleToggleTheme"
            />
          </div>
        </div>

        <!-- Mobile Actions & Menu Button -->
        <div class="lg:hidden flex items-center gap-2">
          <!-- Cart Button (Mobile) -->
          <div class="relative">
            <Button
              variant="ghost"
              size="sm"
              rounded="lg"
              icon="i-lucide-shopping-cart"
              icon-size="20"
              label="View cart"
              @click="handleCartClick"
            />
            <div
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-accent-700 text-text-inverse text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
              aria-label="`${cartItemCount} items in cart`"
            >
              {{ cartItemCount }}
            </div>
          </div>
          <!-- Theme Toggle (Mobile) -->
          <Button
            variant="ghost"
            size="sm"
            rounded="lg"
            :icon="themeIcon"
            icon-size="20"
            label="Toggle theme"
            @click="handleToggleTheme"
          />

          <!-- Mobile Menu Button -->
          <Button
            variant="ghost"
            size="sm"
            rounded="lg"
            :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            icon-size="24"
            @click="toggleMobileMenu"
            aria-label="Toggle mobile menu"
            :aria-expanded="isMobileMenuOpen"
          />
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="mobile-menu">
        <div
          v-show="isMobileMenuOpen"
          class="lg:hidden mobile-menu flex mt-4 border-t border-border-subtle bg-surface-base"
        >
          <ul class="py-4 space-y-1">
            <li v-for="link in links" :key="link.to">
              <!-- Links without children -->
              <NuxtLink
                v-if="!link.children || link.children.length === 0"
                :to="link.to"
                class="mobile-nav-link flex items-center gap-3 px-4 py-3 text-base font-semibold text-text-primary hover:bg-accent-100 hover:text-accent-500 transition-colors duration-200"
                active-class="text-accent-500 bg-accent-50"
                @click="closeMobileMenu"
              >
                <Icon v-if="link.icon" :name="link.icon" size="20" />
                {{ link.text }}
              </NuxtLink>

              <!-- Links with children (accordion) -->
              <div v-else>
                <button
                  class="mobile-nav-link w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-text-primary hover:bg-accent-100 hover:text-accent-500 transition-colors duration-200"
                  @click="toggleMobileDropdown(link.text)"
                >
                  <span class="flex items-center gap-3">
                    <Icon v-if="link.icon" :name="link.icon" size="20" />
                    {{ link.text }}
                  </span>
                  <Icon
                    name="i-lucide-chevron-down"
                    size="18"
                    class="transition-transform duration-200"
                    :class="{ 'rotate-180': activeMobileDropdown === link.text }"
                  />
                </button>

                <!-- Submenu -->
                <Transition name="mobile-submenu">
                  <ul
                    v-show="activeMobileDropdown === link.text"
                    class="ml-4 border-l-2 border-accent-200"
                  >
                    <li v-for="child in link.children" :key="child.to">
                      <NuxtLink
                        :to="child.to"
                        class="mobile-submenu-link flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-accent-100 hover:text-accent-500 transition-colors duration-200"
                        active-class="text-accent-500 bg-accent-50"
                        @click="closeMobileMenu"
                      >
                        <Icon v-if="child.icon" :name="child.icon" size="18" />
                        {{ child.text }}
                      </NuxtLink>
                    </li>
                  </ul>
                </Transition>
              </div>
            </li>
          </ul>

          <!-- Mobile CTA -->
          <div class="px-4 pt-4 border-t border-border-subtle">
            <Button
              variant="primary"
              size="md"
              rounded="md"
              :full-width="true"
              icon-right="i-lucide-phone"
              right-icon-size="16"
              to="/contact"
              @click="closeMobileMenu"
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
  /**
   * Navbar Component
   *
   * A responsive navigation bar with:
   * - Desktop dropdown menus (hover & click)
   * - Mobile accordion menus
   * - Smooth transitions and animations
   * - Active route highlighting
   * - Accessible keyboard navigation
   *
   * @component
   */

  import { products } from "~/data/products";

  interface Link {
    text: string;
    to: string;
    icon?: string;
    children?: Link[];
  }

  // Generate product links dynamically from products data
  const productLinks = products.map((product) => ({
    text: product.name,
    to: `/products/${product.slug}`,
    icon: product.icon,
  }));

  // Navigation links configuration
  const links = ref<Link[]>([
    {
      text: "Home",
      to: "/",
      icon: "i-lucide-home",
    },
    {
      text: "Products",
      to: "/products",
      icon: "i-lucide-package",
      children: productLinks,
    },
    {
      text: "About",
      to: "/about",
      icon: "i-lucide-info",
    },
    {
      text: "Contact",
      to: "/contact",
      icon: "i-lucide-mail",
    },
  ]);

  // Mobile menu state
  const isMobileMenuOpen = ref(false);
  const activeMobileDropdown = ref<string | null>(null);

  // Desktop dropdown state
  const activeDesktopDropdown = ref<string | null>(null);
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  // Theme management
  const { icon: themeIcon, toggleTheme } = useTheme();

  const handleToggleTheme = (event: MouseEvent) => {
    toggleTheme();
    // Remove focus from button on mobile to prevent stuck active state
    (event.target as HTMLElement)?.blur();
  };

  // Cart management
  const cart = useUnifiedCart();
  const cartItemCount = cart.itemCount;
  const router = useRouter();

  const handleCartClick = (event: MouseEvent) => {
    router.push("/cart");
    // Remove focus from button on mobile to prevent stuck active state
    (event.target as HTMLElement)?.blur();
  };

  // Mobile menu functions
  const toggleMobileMenu = (event: MouseEvent) => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (!isMobileMenuOpen.value) {
      activeMobileDropdown.value = null;
    }
    // Remove focus from button on mobile to prevent stuck active state
    (event.target as HTMLElement)?.blur();
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    activeMobileDropdown.value = null;
  };

  const toggleMobileDropdown = (linkText: string) => {
    activeMobileDropdown.value = activeMobileDropdown.value === linkText ? null : linkText;
  };

  // Desktop dropdown functions
  const toggleDesktopDropdown = (linkText: string) => {
    activeDesktopDropdown.value = activeDesktopDropdown.value === linkText ? null : linkText;
  };

  const openDesktopDropdown = (linkText: string) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    activeDesktopDropdown.value = linkText;
  };

  const scheduleCloseDesktopDropdown = () => {
    closeTimer = setTimeout(() => {
      activeDesktopDropdown.value = null;
    }, 200);
  };

  const cancelCloseDesktopDropdown = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const closeDesktopDropdown = () => {
    scheduleCloseDesktopDropdown();
  };

  // Close mobile menu on route change
  const route = useRoute();
  watch(
    () => route.path,
    () => {
      closeMobileMenu();
    },
  );

  // Close mobile menu on escape key
  if (import.meta.client) {
    onMounted(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeMobileMenu();
          activeDesktopDropdown.value = null;
        }
      };
      window.addEventListener("keydown", handleEscape);
      onUnmounted(() => {
        window.removeEventListener("keydown", handleEscape);
      });
    });
  }
</script>

<style scoped>
  .navbar-header {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Desktop Dropdown Animation */
  .dropdown-menu {
    transform-origin: top;
  }

  .dropdown-visible {
    opacity: 1;
    transform: scale(1);
  }

  /* Mobile Menu Transitions */
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .mobile-menu-enter-to,
  .mobile-menu-leave-from {
    opacity: 1;
    max-height: 100vh;
  }

  /* Mobile Submenu Transitions */
  .mobile-submenu-enter-active,
  .mobile-submenu-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .mobile-submenu-enter-from,
  .mobile-submenu-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .mobile-submenu-enter-to,
  .mobile-submenu-leave-from {
    opacity: 1;
    max-height: 500px;
  }

  /* Nav Link Hover Effects */
  .nav-link {
    position: relative;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
  }

  .nav-link:hover::after {
    width: 80%;
  }

  /* Active Link Styling */
  .router-link-active.nav-link::after {
    width: 80%;
  }

  /* Dropdown Item Hover */
  .dropdown-item {
    position: relative;
    overflow: hidden;
  }

  .dropdown-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: currentColor;
    transform: scaleY(0);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropdown-item:hover::before {
    transform: scaleY(1);
  }

  /* Mobile Nav Link Tap Feedback */
  .mobile-nav-link:active,
  .mobile-submenu-link:active {
    transform: scale(0.98);
  }

  /* Accessibility - Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .navbar-header,
    .dropdown-menu,
    .nav-link,
    .dropdown-item,
    .mobile-nav-link,
    .mobile-submenu-link {
      transition-duration: 0.01ms !important;
    }

    .mobile-menu-enter-active,
    .mobile-menu-leave-active,
    .mobile-submenu-enter-active,
    .mobile-submenu-leave-active {
      transition-duration: 0.01ms !important;
    }
  }

  /* Responsive Typography */
  @media (max-width: 640px) {
    .navbar-logo {
      font-size: 1.125rem;
    }
  }
</style>
