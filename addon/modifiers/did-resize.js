import Modifier from 'ember-modifier';

export default class DidIntersectModifier extends Modifier {
  // Public API
  handler = null;

  // Private API
  observer = null;

  observe() {
    if ('ResizeObserver' in window) {
      this.observer = new ResizeObserver((entries) => {
        this.handler(entries[0]);
      });

      this.observer.observe(this.element);
    }
  }

  didReceiveArguments() {
    let [handler] = this.args.positional;

    // Save arguments for when we need them
    this.handler = handler;

    this.observe();
  }

  willRemove() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
