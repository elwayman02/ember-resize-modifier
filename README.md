# ember-resize-modifier

Resize Modifier for Ember.js Applications using ResizeObserver.

Check out the [documentation](https://ember-resize-modifier.jhawk.co/)!

We adhere to the [Ember Community Guidelines](https://emberjs.com/guidelines/) for our Code of Conduct.

## Compatibility

- Ember.js v4.12 or above
- Embroider or ember-auto-import v2

## Installation

```bash
pnpm add ember-resize-modifier
```

Or with npm:

```bash
npm install ember-resize-modifier
```

## Usage

Add the `didResize` modifier to any element and pass a callback handler:

```gjs
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
    <div {{didResize this.onResize}}>
      {{this.width}} × {{this.height}}
    </div>
  </template>
}
```

You can also pass options to `ResizeObserver.observe()`:

```gjs
import Component from '@glimmer/component';
import { didResize } from 'ember-resize-modifier';

export default class BorderBoxDemo extends Component {
  options = { box: 'border-box' };

  onResize = (entry) => {
    const size = entry.borderBoxSize?.[0];
    console.log(`Border box: ${size.inlineSize} × ${size.blockSize}`);
  };

  <template>
    <div {{didResize this.onResize this.options}}>
      Observing border-box changes
    </div>
  </template>
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
