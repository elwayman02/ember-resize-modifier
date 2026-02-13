# didResize

The `didResize` modifier triggers a callback when resize events are observed on the target element.

## Signature

```typescript
interface DidResizeSignature {
  Args: {
    Positional: [handler: DidResizeHandler, options?: ResizeObserverOptions];
  };
  Element: Element;
}

type DidResizeHandler = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver,
) => void;
```

## Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `handler` | `(entry: ResizeObserverEntry, observer: ResizeObserver) => void` | Yes | Callback invoked on resize |
| `options` | `ResizeObserverOptions` | No | Options passed to `ResizeObserver.observe()` |

## Handler Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `entry` | [`ResizeObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry) | Contains the new dimensions of the observed element |
| `observer` | [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) | The ResizeObserver instance |

## ResizeObserverOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `box` | `'content-box' \| 'border-box' \| 'device-pixel-content-box'` | `'content-box'` | Which box model to observe |

## Implementation Details

- Uses a **single shared `ResizeObserver`** instance across all uses of the modifier for optimal performance.
- Handlers are stored in a `WeakMap` keyed by the observed element.
- Resize callbacks are batched via `requestAnimationFrame`.
- Automatically cleans up (unobserves) when the element is destroyed or when arguments change.
- Becomes a **no-op** in browsers that don't support `ResizeObserver`.

## Importing

```typescript
// Default export (modifier class)
import DidResizeModifier from 'ember-resize-modifier/modifiers/did-resize';

// Named export
import { didResize } from 'ember-resize-modifier';
```

## Example

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { didResize } from 'ember-resize-modifier';

export default class ApiDemo extends Component {
  @tracked lastEntry = null;

  onResize = (entry, observer) => {
    this.lastEntry = entry;
  };

  get dimensions() {
    if (!this.lastEntry) return 'Resize to see dimensions';
    const { width, height } = this.lastEntry.contentRect;
    return `${Math.round(width)} × ${Math.round(height)}`;
  }

  <template>
    <div {{didResize this.onResize}} style="padding: 1rem; border: 2px solid #2980b9; border-radius: 8px; resize: both; overflow: auto; min-width: 150px; min-height: 60px;">
      <code>{{this.dimensions}}</code>
    </div>
  </template>
}
```
