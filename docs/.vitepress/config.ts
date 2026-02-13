import { defineConfig } from 'vitepress';
import vitePluginEmber, { emberFence } from 'vite-plugin-ember';

export default defineConfig({
  title: 'ember-resize-modifier',
  description: 'Resize Modifier for Ember.js Applications using ResizeObserver',

  vite: {
    plugins: [vitePluginEmber()],
    // Prevent esbuild pre-bundling — ember-modifier imports virtual @ember/* packages
    // that only the Ember Vite plugin can resolve
    optimizeDeps: {
      exclude: ['ember-modifier'],
    },
  },

  markdown: {
    config(md) {
      emberFence(md);
    },
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Usage', link: '/guide/usage' },
        ],
      },
      {
        text: 'API',
        items: [{ text: 'didResize', link: '/api/' }],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/elwayman02/ember-resize-modifier',
      },
    ],
  },
});
