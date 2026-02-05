<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl lg:text-5xl mb-8 text-text-primary">Contact Us</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Contact Form - First on mobile, left on desktop -->
        <div class="bg-surface-raised p-8 rounded-lg border border-border-subtle relative md:order-2">
          <h2 class="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-text-primary mb-2"
                >Name</label
              >
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-text-primary mb-2"
                >Email</label
              >
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
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
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
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
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200 resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              :full-width="true"
              rounded="lg"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Sending..." : "Send Message" }}
            </Button>
          </form>
        </div>

        <!-- Contact Information - Second on mobile, right on desktop -->
        <div class="md:order-1">
          <h2 class="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
          <p class="text-text-secondary mb-8">
            Have questions about our custom sticker printing services? We're here to help! Reach out
            to our team for design support, order inquiries, or any other questions.
          </p>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-neutral-100 rounded-lg">
                <Icon name="i-lucide-mail" size="24" class="text-magenta" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Email</h3>
                <a
                  :href="`mailto:${businessConfig.email}`"
                  class="text-cyan hover:text-text-primary transition-colors"
                >
                  {{ businessConfig.email }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-neutral-100 rounded-lg">
                <Icon name="i-lucide-phone" size="24" class="text-magenta" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Phone</h3>
                <a
                  :href="`tel:${businessConfig.phoneFormatted}`"
                  class="text-cyan hover:text-text-primary transition-colors"
                >
                  {{ businessConfig.phone }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-neutral-100 rounded-lg">
                <Icon name="i-lucide-clock" size="24" class="text-magenta" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Business Hours</h3>
                <p class="text-text-secondary">{{ businessConfig.businessHours.weekdays }}</p>
                <p class="text-text-secondary">{{ businessConfig.businessHours.weekend }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-neutral-100 rounded-lg">
                <Icon name="i-lucide-map-pin" size="24" class="text-magenta" />
              </div>
              <div>
                <h3 class="font-bold text-text-primary mb-1">Location</h3>
                <a
                  :href="businessConfig.googleMapsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-cyan hover:text-text-primary transition-colors"
                >
                  {{ businessConfig.address.street }}<br />
                  {{ businessConfig.address.city }}, {{ businessConfig.address.state }} {{ businessConfig.address.zip }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  import businessConfig from "~/config/businessConfig";

  const form = ref({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const isSubmitting = ref(false);
  const toast = useToast();

  const handleSubmit = async () => {
    isSubmitting.value = true;

    try {
      await $fetch("/api/contact/submit", {
        method: "POST",
        body: {
          name: form.value.name,
          email: form.value.email,
          subject: form.value.subject,
          message: form.value.message,
        },
      });

      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      form.value = {
        name: "",
        email: "",
        subject: "",
        message: "",
      };
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send message. Please try again.");
    } finally {
      isSubmitting.value = false;
    }
  };

  // SEO Meta Tags
  useSeoMeta({
    title: `Contact Us | Custom Sticker Support & Help - ${businessConfig.name}`,
    description: `Questions about custom stickers? Email ${businessConfig.email} or call ${businessConfig.phone}. Design support & order help. ${businessConfig.businessHours.weekdays}.`,
    ogTitle: `Contact ${businessConfig.name} - Custom Sticker Support`,
    ogDescription: `Questions about custom stickers? Expert team ready to help with design support and order inquiries. ${businessConfig.businessHours.weekdays}.`,
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
          name: `Contact ${businessConfig.name}`,
          description: "Contact us for custom sticker printing questions and support",
          url: `${businessConfig.website}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: businessConfig.name,
            url: businessConfig.website,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              email: businessConfig.email,
              telephone: businessConfig.phoneFormatted,
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
