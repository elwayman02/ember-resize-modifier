# did-resize

This modifier triggers a callback when resize events are observed on the target element.

## Basic Usage

A callback handler is always expected to be passed to `did-resize`:

```handlebars{data-execute=false}
  <div {{did-resize this.onResize}}></div>
```

The handler will be called with an instance of [ResizeObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry)
and the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver) instance itself:

```javascript
  onResize(entry, observer) {
    // do something
  }
```

Here is an example of using the `did-resize` modifier to increment a counter every time the containing `<div>` has been resized:

```handlebars
<div {{did-resize this.onResize}}>I have been resized {{this.count}} times!</div>
```

## Advanced Usage

`did-resize` also supports passing an `options` hash into ResizeObserver:

```handlebars{data-execute=false}
  <div {{did-resize this.onResize this.options}}></div>
```

The options supported are documented under [ResizeObserver.observe](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe).
