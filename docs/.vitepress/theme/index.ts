import DefaultTheme from 'vitepress/theme';
import { setupEmber } from 'vite-plugin-ember/setup';
import type { Theme } from 'vitepress';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    setupEmber(app);
  },
} satisfies Theme;
