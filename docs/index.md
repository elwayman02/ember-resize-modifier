# Ember-Resize-Modifier

This addon provides a [`did-resize`](modifiers/did-resize) modifier for detecting 
resize events on the element or component it's attached to.

## Browser Support

Our features are [supported](https://caniuse.com/#search=resizeobserver) in the latest versions of every browser except IE 11.
The previous version of Safari (13), also does not support this feature, but it's supported in 13.1.
MDN actually lists ResizeObserverEntry as [unsupported by Safari](https://caniuse.com/#feat=mdn-api_resizeobserverentry) altogether, 
but this is incorrect and we have logged an issue with MDN to fix their data. We have tested this in 
the latest Safari and confirmed that it in fact works as expected.

In browsers where ResizeObserver is not supported, this modifer becomes a no-op. It will not error, 
nor will it employ a fallback. Features built with this addon will simply gracefully not respond to resize events.
