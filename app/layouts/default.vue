<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <!-- Skip Navigation Link for Accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-700 focus:text-text-inverse focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>

    <Navbar />
    <PromoBanner />
    <main id="main-content" class="flex-grow">
      <slot />
    </main>
    <Footer />
    <Toast />
    <!-- <SignupModal /> -->
  </div>
</template>
