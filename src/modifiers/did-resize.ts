import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

import type Owner from '@ember/owner';
import type { ArgsFor } from 'ember-modifier';

export type DidResizeHandler = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver,
) => void;

export interface DidResizeSignature {
  Args: {
    Positional: [handler: DidResizeHandler, options?: ResizeObserverOptions];
  };
  Element: Element;
}

export default class DidResizeModifier extends Modifier<DidResizeSignature> {
  // Public API
  declare element: Element;
  declare handler: DidResizeHandler;
  options: ResizeObserverOptions = {};

  // Private API
  static observer: ResizeObserver | null = null;
  static handlers: WeakMap<Element, DidResizeHandler> | null = null;

  constructor(owner: Owner, args: ArgsFor<DidResizeSignature>) {
    super(owner, args);

    if (!('ResizeObserver' in window)) {
      return;
    }

    if (!DidResizeModifier.observer) {
      DidResizeModifier.handlers = new WeakMap();
      DidResizeModifier.observer = new ResizeObserver(
        (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
          window.requestAnimationFrame(() => {
            for (const entry of entries) {
              const handler = DidResizeModifier.handlers?.get(entry.target);
              if (handler) handler(entry, observer);
            }
          });
        },
      );
    }

    registerDestructor(this, unobserve);
  }

  modify(
    element: Element,
    positional: [DidResizeHandler, ResizeObserverOptions?],
  ) {
    unobserve(this);

    this.element = element;

    const [handler, options] = positional;

    // Save arguments for when we need them
    this.handler = handler;
    this.options = options ?? this.options;

    this.observe();
  }

  observe() {
    if (DidResizeModifier.observer) {
      this.addHandler();
      DidResizeModifier.observer.observe(this.element, this.options);
    }
  }

  addHandler() {
    DidResizeModifier.handlers?.set(this.element, this.handler);
  }

  removeHandler() {
    DidResizeModifier.handlers?.delete(this.element);
  }
}

/**
 * Destructor function for the modifier
 */
function unobserve(instance: DidResizeModifier) {
  if (instance.element && DidResizeModifier.observer) {
    DidResizeModifier.observer.unobserve(instance.element);
    instance.removeHandler();
  }
}
