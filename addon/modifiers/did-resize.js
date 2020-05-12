import Modifier from 'ember-modifier';

export default class DidResizeModifier extends Modifier {
  // Public API
  handler = null;
  options = {};

  // Private API
  observer = null;

  observe() {
    if (this.observer) {
      this.observer.observe(this.element, this.options);
    }
  }

  unobserve() {
    if (this.observer) {
      this.observer.unobserve();
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
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

  didInstall() {
    if (!('ResizeObserver' in window)) {
      return;
    }

    this.observer = new ResizeObserver((entries, observer) => {
      this.handler(entries[0], observer);
    });

    this.observe();
  }

  willRemove() {
    this.disconnect();
  }
}
