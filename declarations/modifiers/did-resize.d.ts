import Modifier from 'ember-modifier';
import type Owner from '@ember/owner';
import type { ArgsFor } from 'ember-modifier';
export type DidResizeHandler = (entry: ResizeObserverEntry, observer: ResizeObserver) => void;
export interface DidResizeSignature {
    Args: {
        Positional: [handler: DidResizeHandler, options?: ResizeObserverOptions];
    };
    Element: Element;
}
export default class DidResizeModifier extends Modifier<DidResizeSignature> {
    element: Element;
    handler: DidResizeHandler;
    options: ResizeObserverOptions;
    static observer: ResizeObserver | null;
    static handlers: WeakMap<Element, DidResizeHandler> | null;
    constructor(owner: Owner, args: ArgsFor<DidResizeSignature>);
    modify(element: Element, positional: [DidResizeHandler, ResizeObserverOptions?]): void;
    observe(): void;
    addHandler(): void;
    removeHandler(): void;
}
//# sourceMappingURL=did-resize.d.ts.map