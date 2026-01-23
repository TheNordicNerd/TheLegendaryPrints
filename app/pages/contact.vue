<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl lg:text-5xl mb-8 text-text-primary">Contact Us</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div>
          <h2 class="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
          <p class="text-text-secondary mb-8">
            Have questions about our custom sticker printing services? We're here to help! Reach out to
            our team for design support, order inquiries, or any other questions.
          </p>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-accent-100 rounded-lg">
                <Icon name="i-lucide-mail" size="24" class="text-accent-700" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Email</h3>
                <a
                  href="mailto:hello@thelegendaryprints.com"
                  class="text-accent-700 hover:text-accent-800 transition-colors"
                >
                  hello@thelegendaryprints.com
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-accent-100 rounded-lg">
                <Icon name="i-lucide-phone" size="24" class="text-accent-700" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Phone</h3>
                <a
                  href="tel:+15551234567"
                  class="text-accent-700 hover:text-accent-800 transition-colors"
                >
                  (555) 123-4567
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-accent-100 rounded-lg">
                <Icon name="i-lucide-clock" size="24" class="text-accent-700" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Business Hours</h3>
                <p class="text-text-secondary">Monday - Friday: 9am - 6pm EST</p>
                <p class="text-text-secondary">Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-surface-raised p-8 rounded-lg border border-border-subtle">
          <h2 class="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-text-primary mb-2">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-text-primary mb-2">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-text-primary mb-2">
                Subject
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200 resize-none"
              ></textarea>
            </div>

            <Button type="submit" variant="primary" size="lg" :full-width="true" rounded="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  const form = ref({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = () => {
    // TODO: Implement form submission
    alert("Thank you for your message! We'll get back to you soon.");
    form.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };
  };

  // SEO Meta Tags
  useSeoMeta({
    title: "Contact Us | Custom Sticker Support & Help - TLP",
    description:
      "Questions about custom stickers? Email hello@thelegendaryprints.com or call (555) 123-4567. Design support & order help. Mon-Fri 9am-6pm EST.",
    ogTitle: "Contact TLP - Custom Sticker Support",
    ogDescription:
      "Questions about custom stickers? Expert team ready to help with design support and order inquiries. Monday-Friday 9am-6pm EST.",
    ogType: "website",
    twitterCard: "summary",
  });

  // Structured Data - Contact Page
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact The Legendary Prints",
          description: "Contact us for custom sticker printing questions and support",
          url: "https://thelegendaryprints.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: "The Legendary Prints",
            url: "https://thelegendaryprints.com",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              email: "hello@thelegendaryprints.com",
              telephone: "+1-555-123-4567",
              availableLanguage: "English",
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
            },
          },
        }),
      },
    ],
  });
</script>

<style scoped></style>

