import type DidResizeModifier from './modifiers/did-resize.ts';

export default interface Registry {
  'did-resize': typeof DidResizeModifier;
}
