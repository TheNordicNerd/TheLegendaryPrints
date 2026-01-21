/**
 * HeroSection Component - BDD Tests
 *
 * Tests follow Given/When/Then format for behavior-driven development
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import HeroSection from './HeroSection.vue';

describe('HeroSection Component', () => {
  let wrapper: VueWrapper;

  const mountOptions = {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a :to="to"><slot /></a>',
          props: ['to'],
        },
      },
    },
  };

  describe('Component Rendering', () => {
    describe('Given a HeroSection with required props', () => {
      beforeEach(() => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Welcome to Our Site',
          },
        });
      });

      it('When the component renders, Then it displays the headline', () => {
        expect(wrapper.find('.hero-headline').text()).toBe('Welcome to Our Site');
      });

      it('When the component renders, Then it has the correct semantic structure', () => {
        expect(wrapper.find('section[role="banner"]').exists()).toBe(true);
        expect(wrapper.find('h1').exists()).toBe(true);
      });
    });

    describe('Given a HeroSection with all props', () => {
      beforeEach(() => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Main Headline',
            subheadline: 'Supporting subheadline text',
            ctaText: 'Get Started',
            ctaLink: '/products',
            backgroundImage: '/images/hero.jpg',
            overlayOpacity: 60,
          },
        });
      });

      it('When the component renders, Then it displays all content', () => {
        expect(wrapper.find('.hero-headline').text()).toBe('Main Headline');
        expect(wrapper.find('.hero-subheadline').text()).toBe('Supporting subheadline text');
        expect(wrapper.find('.hero-cta a').text()).toBe('Get Started');
      });

      it('When a background image is provided, Then it renders with correct style', () => {
        const background = wrapper.find('.hero-background');
        expect(background.exists()).toBe(true);
        expect(background.attributes('style')).toContain('background-image: url(/images/hero.jpg)');
      });

      it('When overlay opacity is set, Then it applies correct opacity', () => {
        const overlay = wrapper.find('.hero-overlay');
        expect(overlay.attributes('style')).toContain('opacity: 0.6');
      });

      it('When a CTA link is provided, Then it renders as NuxtLink with correct href', () => {
        const cta = wrapper.find('.hero-cta a');
        expect(cta.attributes('to')).toBe('/products');
      });
    });
  });

  describe('Props Handling', () => {
    describe('Given optional props are not provided', () => {
      beforeEach(() => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Just a Headline',
          },
        });
      });

      it('When subheadline is omitted, Then it does not render subheadline element', () => {
        expect(wrapper.find('.hero-subheadline').exists()).toBe(false);
      });

      it('When CTA is omitted, Then it does not render CTA button', () => {
        expect(wrapper.find('.hero-cta').exists()).toBe(false);
      });

      it('When background image is omitted, Then it does not render background element', () => {
        expect(wrapper.find('.hero-background').exists()).toBe(false);
      });
    });

    describe('Given different text alignment props', () => {
      it('When textAlign is "center", Then content has center alignment classes', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Centered',
            textAlign: 'center',
          },
        });
        const content = wrapper.find('.hero-content');
        expect(content.classes()).toContain('text-center');
        expect(content.classes()).toContain('items-center');
      });

      it('When textAlign is "left", Then content has left alignment classes', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Left Aligned',
            textAlign: 'left',
          },
        });
        const content = wrapper.find('.hero-content');
        expect(content.classes()).toContain('text-left');
        expect(content.classes()).toContain('items-start');
      });

      it('When textAlign is "right", Then content has right alignment classes', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Right Aligned',
            textAlign: 'right',
          },
        });
        const content = wrapper.find('.hero-content');
        expect(content.classes()).toContain('text-right');
        expect(content.classes()).toContain('items-end');
      });
    });

    describe('Given custom minHeight prop', () => {
      it('When minHeight is provided, Then it applies to section and content', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Custom Height',
            minHeight: '800px',
          },
        });
        const section = wrapper.find('section');
        const content = wrapper.find('.hero-content');
        expect(section.attributes('style')).toContain('min-height: 800px');
        expect(content.attributes('style')).toContain('min-height: 800px');
      });
    });
  });

  describe('Accessibility', () => {
    describe('Given a fully configured HeroSection', () => {
      beforeEach(() => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Accessible Hero',
            subheadline: 'Description text',
            ctaText: 'Learn More',
            ctaLink: '/learn',
            backgroundImage: '/bg.jpg',
          },
        });
      });

      it('When rendered, Then section has proper ARIA role', () => {
        expect(wrapper.find('section').attributes('role')).toBe('banner');
      });

      it('When rendered, Then background has aria-hidden', () => {
        expect(wrapper.find('.hero-background').attributes('aria-hidden')).toBe('true');
      });

      it('When rendered, Then overlay has aria-hidden', () => {
        expect(wrapper.find('.hero-overlay').attributes('aria-hidden')).toBe('true');
      });

      it('When rendered, Then CTA button has focus styles', () => {
        const cta = wrapper.find('.hero-cta a');
        expect(cta.classes()).toContain('focus:outline-none');
        expect(cta.classes()).toContain('focus:ring-2');
      });

      it('When rendered, Then headline uses H1 tag', () => {
        const h1 = wrapper.find('h1');
        expect(h1.exists()).toBe(true);
        expect(h1.classes()).toContain('hero-headline');
      });
    });
  });

  describe('Slot Support', () => {
    describe('Given additional content in default slot', () => {
      it('When slot content is provided, Then it renders within hero content', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Hero with Slot',
          },
          slots: {
            default: '<div class="custom-content">Extra Content</div>',
          },
        });
        expect(wrapper.find('.custom-content').text()).toBe('Extra Content');
      });
    });
  });

  describe('Computed Properties', () => {
    describe('Given different overlay opacity values', () => {
      it('When overlayOpacity is 0, Then opacity is 0', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Test',
            overlayOpacity: 0,
          },
        });
        expect(wrapper.find('.hero-overlay').attributes('style')).toContain('opacity: 0');
      });

      it('When overlayOpacity is 100, Then opacity is 1', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Test',
            overlayOpacity: 100,
          },
        });
        expect(wrapper.find('.hero-overlay').attributes('style')).toContain('opacity: 1');
      });

      it('When overlayOpacity is 50 (default), Then opacity is 0.5', () => {
        wrapper = mount(HeroSection, {
          ...mountOptions,
          props: {
            headline: 'Test',
          },
        });
        expect(wrapper.find('.hero-overlay').attributes('style')).toContain('opacity: 0.5');
      });
    });
  });
});
