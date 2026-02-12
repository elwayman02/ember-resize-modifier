# Getting Started

## Installation

```bash
pnpm add ember-resize-modifier
```

Or with npm:

```bash
npm install ember-resize-modifier
```

## Compatibility

- Ember.js v4.12 or above
- Embroider or ember-auto-import v2

## Browser Support

The `didResize` modifier is [supported](https://caniuse.com/#search=resizeobserver) in the latest versions of every browser except IE 11. In browsers where `ResizeObserver` is not supported, this modifier becomes a no-op. It will not error, nor will it employ a fallback. Features built with this addon will simply gracefully not respond to resize events.

## Quick Example

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { didResize } from 'ember-resize-modifier';

export default class ResizeDemo extends Component {
  @tracked width = 0;
  @tracked height = 0;

  onResize = (entry) => {
    this.width = Math.round(entry.contentRect.width);
    this.height = Math.round(entry.contentRect.height);
  };

  <template>
    <div {{didResize this.onResize}} style="padding: 1rem; border: 2px dashed #3eaf7c; border-radius: 8px; resize: both; overflow: auto; min-width: 150px; min-height: 80px;">
      <p>↔ Drag to resize this box</p>
      <p><strong>{{this.width}}</strong> × <strong>{{this.height}}</strong></p>
    </div>
  </template>
}
```
