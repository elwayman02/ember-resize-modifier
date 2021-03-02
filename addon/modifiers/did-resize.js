import Modifier from 'ember-modifier';

export default class DidResizeModifier extends Modifier {
  // Public API
  handler = null;
  options = {};

  // Private API
  _didInstall = false;
  static observer = null;
  static handlers = [];

  addHandler() {
    DidResizeModifier.handlers.push({
      element: this.element,
      handler: this.handler,
    });
  }

  removeHandler() {
    DidResizeModifier.handlers.splice(
      DidResizeModifier.handlers.findIndex((h) => h.element === this.element),
      1
    );
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
    }
  }

  disconnect() {
    if (DidResizeModifier.observer) {
      DidResizeModifier.observer.disconnect();
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

    // Only observe if the modifier is installed
    if (this._didInstall) {
      this.observe();
    }
  }

  didInstall() {
    if (!('ResizeObserver' in window)) {
      return;
    }

    if (!DidResizeModifier.observer) {
      DidResizeModifier.observer = new ResizeObserver((entries, observer) => {
        for (let entry of entries) {
          const lookup = DidResizeModifier.handlers.find(
            (h) => h.element === entry.target
          );
          if (lookup) lookup.handler(entry, observer);
        }
      });
    }

    this.observe();
    this._didInstall = true;
  }

  willRemove() {
    this.disconnect();
  }
}
