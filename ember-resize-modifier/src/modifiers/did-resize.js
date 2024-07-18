import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export default class DidResizeModifier extends Modifier {
  // Public API
  element;
  handler;
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
        window.requestAnimationFrame(() => {
          for (let entry of entries) {
            const handler = DidResizeModifier.handlers.get(entry.target);
            if (handler) handler(entry, observer);
          }
        });
      });
    }

    registerDestructor(this, unobserve);
  }

  modify(element, positional /*, named*/) {
    unobserve(this);

    this.element = element;

    const [handler, options] = positional;

    // Save arguments for when we need them
    this.handler = handler;
    this.options = options || this.options;

    this.observe();
  }

  observe() {
    if (DidResizeModifier.observer) {
      this.addHandler();
      DidResizeModifier.observer.observe(this.element, this.options);
    }
  }

  addHandler() {
    DidResizeModifier.handlers.set(this.element, this.handler);
  }

  removeHandler() {
    DidResizeModifier.handlers.delete(this.element);
  }
}

/**
 *
 * @param {DidResizeModifier} instance
 */
function unobserve(instance) {
  if (instance.element && DidResizeModifier.observer) {
    DidResizeModifier.observer.unobserve(instance.element);
    instance.removeHandler();
  }
}
