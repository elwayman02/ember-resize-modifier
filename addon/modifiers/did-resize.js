import Modifier from 'ember-modifier';

export default class DidResizeModifier extends Modifier {
  // Public API
  handler = null;
  options = {};

  // Private API
  static observer = null;
  static handlers = null;

  constructor() {
    super(...arguments);

    if (!('ResizeObserver' in window)) {
      return;
    }

    if (!DidResizeModifier.observer) {
      DidResizeModifier.handlers = new WeakMap();
      DidResizeModifier.observer = new ResizeObserver((entries, observer) => {
        for (let entry of entries) {
          const handler = DidResizeModifier.handlers.get(entry.target);
          if (handler) handler(entry, observer);
        }
      });
    }
  }

  addHandler() {
    DidResizeModifier.handlers.set(this.element, this.handler);
  }

  removeHandler() {
    DidResizeModifier.handlers.delete(this.element);
  }

  observe() {
    if (DidResizeModifier.observer) {
      this.addHandler();
      DidResizeModifier.observer.observe(this.element, this.options);
    }
  }

  unobserve() {
    if (DidResizeModifier.observer) {
      DidResizeModifier.observer.unobserve(this.element);
      this.removeHandler();
    }
  }

  // Stop observing temporarily on update in case options have changed
  didUpdateArguments() {
    this.unobserve();
  }

  didReceiveArguments() {
    let [handler, options] = this.args.positional;

    // Save arguments for when we need them
    this.handler = handler;
    this.options = options || this.options;

    this.observe();
  }

  willRemove() {
    this.unobserve();
  }
}
