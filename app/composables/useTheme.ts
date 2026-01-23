/**
 * Theme Composable
 *
 * Manages theme state (light/dark mode) using VueUse
 * Automatically persists preference to localStorage
 * Syncs with system preference when no preference is saved
 *
 * @example
 * const { isDark, toggleTheme } = useTheme()
 *
 * // Toggle theme
 * toggleTheme()
 *
 * // Check if dark mode is active
 * if (isDark.value) {
 *   // Dark mode is active
 * }
 */
export function useTheme() {
  // useDark automatically:
  // - Adds/removes 'dark' class on <html> element
  // - Syncs with localStorage (key: 'vueuse-color-scheme')
  // - Syncs with system preference when no saved preference exists
  const isDark = useDark({
    selector: "html",
    attribute: "class",
    valueDark: "dark",
    valueLight: "",
    storageKey: "theme",
    storage: typeof window !== "undefined" ? localStorage : undefined,
  });

  // Create toggle function
  const toggleTheme = useToggle(isDark);

  // Set specific theme
  const setTheme = (theme: "light" | "dark") => {
    isDark.value = theme === "dark";
  };

  const icon = computed(() => (isDark.value ? "i-lucide-sun" : "i-lucide-moon"));

  // Get current theme as string
  const theme = computed(() => (isDark.value ? "dark" : "light"));

  return {
    isDark,
    theme,
    icon,
    toggleTheme,
    setTheme,
  };
}
