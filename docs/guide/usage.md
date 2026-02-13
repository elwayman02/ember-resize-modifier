# Usage

## Basic Usage

Pass a callback handler to `didResize`. The handler receives a [ResizeObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry) and the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver) instance:

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { didResize } from 'ember-resize-modifier';

export default class BasicResizeDemo extends Component {
  @tracked width = 0;
  @tracked height = 0;

  onResize = (entry) => {
    this.width = Math.round(entry.contentRect.width);
    this.height = Math.round(entry.contentRect.height);
  };

  <template>
    <div {{didResize this.onResize}} style="padding: 1rem; border: 2px dashed #3eaf7c; border-radius: 8px; resize: both; overflow: auto; min-width: 150px; min-height: 80px;">
      <p>↔ Drag the corner to resize</p>
      <p>Width: <strong>{{this.width}}px</strong></p>
      <p>Height: <strong>{{this.height}}px</strong></p>
    </div>
  </template>
}
```

## Resize Counter

Count how many times an element has been resized. You can drag the corner handle or use the buttons:

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { didResize } from 'ember-resize-modifier';

export default class ResizeCounter extends Component {
  @tracked count = 0;

  onResize = () => { this.count += 1; };

  <template>
    <div {{didResize this.onResize}} style="padding: 1rem; border: 2px solid #e67e22; border-radius: 8px; resize: both; overflow: auto; min-width: 200px; min-height: 100px; max-width: 100%;">
      <p>Resized <strong>{{this.count}}</strong> times</p>
      <p>↘ Drag the corner to resize</p>
    </div>
  </template>
}
```

## Advanced Usage

`didResize` also supports passing an `options` hash as the second positional argument. Options are documented under [ResizeObserver.observe](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe):

| Option | Description |
|--------|-------------|
| `box`  | Sets which box model the observer will observe changes to. Possible values are `content-box` (default), `border-box`, and `device-pixel-content-box`. |

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { didResize } from 'ember-resize-modifier';

export default class BorderBoxDemo extends Component {
  @tracked inlineSize = 0;
  @tracked blockSize = 0;

  options = { box: 'border-box' };

  onResize = (entry) => {
    const size = entry.borderBoxSize?.[0];
    if (size) {
      this.inlineSize = Math.round(size.inlineSize);
      this.blockSize = Math.round(size.blockSize);
    }
  };

  <template>
    <div {{didResize this.onResize this.options}} style="padding: 2rem; border: 8px solid #9b59b6; border-radius: 8px; resize: both; overflow: auto; min-width: 150px; min-height: 80px;">
      <p>Observing <code>border-box</code> changes</p>
      <p>Inline: <strong>{{this.inlineSize}}px</strong></p>
      <p>Block: <strong>{{this.blockSize}}px</strong></p>
    </div>
  </template>
}
```
