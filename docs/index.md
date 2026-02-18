---
layout: home

hero:
  name: ember-resize-modifier
  tagline: Resize Modifier for Ember.js Applications using ResizeObserver
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/elwayman02/ember-resize-modifier

features:
  - title: Simple API
    details: Just add the {{didResize}} modifier to any element and pass a callback handler.
  - title: Shared Observer
    details: Uses a single shared ResizeObserver instance for optimal performance across multiple elements.
  - title: Graceful Degradation
    details: Becomes a no-op in browsers that don't support ResizeObserver — no errors, no fallback needed.
---
