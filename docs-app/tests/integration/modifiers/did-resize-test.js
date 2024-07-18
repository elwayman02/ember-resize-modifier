import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { clearRender, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import DidResizeModifier from 'ember-resize-modifier/modifiers/did-resize';

module('Integration | Modifier | did-resize', function (hooks) {
  setupRenderingTest(hooks);

  let resizeCallback = null;
  let observeStub = sinon.stub();
  let unobserveStub = sinon.stub();
  let disconnectStub = sinon.stub();
  let resizeObserver = window.ResizeObserver;
  let originalRequestAnimationFrame = window.requestAnimationFrame;
  let mockResizeObserver = class MockResizeObserver {
    constructor(callback) {
      resizeCallback = callback;
    }

    observe = observeStub;
    unobserve = unobserveStub;
    disconnect = disconnectStub;
  };

  hooks.beforeEach(function () {
    observeStub.reset();
    unobserveStub.reset();
    disconnectStub.reset();
    this.resizeStub = sinon.stub();
    window.ResizeObserver = mockResizeObserver;
    window.requestAnimationFrame = (callback) => callback();

    // reset static properties to make sure every test case runs independently
    DidResizeModifier.observer = null;
    DidResizeModifier.handlers = null;
    resizeCallback = null;
  });

  hooks.afterEach(function () {
    window.ResizeObserver = resizeObserver;
    window.requestAnimationFrame = originalRequestAnimationFrame;
  });

  test('modifier integrates with ResizeObserver', async function (assert) {
    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);

    assert.ok(resizeCallback, 'ResizeObserver received callback');
    assert.ok(observeStub.calledOnce, 'observe was called');

    let [element, options] = observeStub.args[0];

    assert.ok(element, 'element was passed to observe');
    assert.strictEqual(
      Object.keys(options).length,
      0,
      'empty object passed as default options',
    );
  });

  test('modifier triggers handler when ResizeObserver fires callback', async function (assert) {
    await render(
      hbs`<div id="test-element" {{did-resize this.resizeStub}}></div>`,
    );
    let entry = { target: find('#test-element') };
    let fakeObserver = { observe: {} };

    resizeCallback([entry], fakeObserver);

    assert.ok(
      this.resizeStub.calledOnceWith(entry, fakeObserver),
      'handler fired with correct parameters',
    );
  });

  test('modifier passes options to ResizeObserver', async function (assert) {
    this.options = { box: 'content-box' };

    await render(hbs`<div {{did-resize this.resizeStub this.options}}></div>`);

    let [element, options] = observeStub.args[0];

    assert.ok(element, 'element was passed to observe');
    assert.deepEqual(options, this.options, 'options were correctly passed');
  });

  test('modifier graceful no-op if ResizeObserver does not exist', async function (assert) {
    delete window.ResizeObserver;

    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);
    assert.notOk(resizeCallback, 'no callback received');
    assert.notOk(observeStub.calledOnce, 'observe was not called');
  });

  test('modifier calls unobserve when arguments change', async function (assert) {
    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);

    assert.notOk(unobserveStub.called, 'unobserve not called yet');
    assert.ok(observeStub.calledOnce, 'observe was called');

    this.set('resizeStub', sinon.stub());

    assert.ok(unobserveStub.calledOnce, 'unobserve called');
    assert.ok(observeStub.calledTwice, 'observe was called again');
  });

  test('handlers are setup and called correctly when multiple modifiers are present', async function (assert) {
    this.setProperties({
      resizeStub2: sinon.stub(),
      resizeStub3: sinon.stub(),
    });

    await render(
      hbs`<div id="test-element1" {{did-resize this.resizeStub}}></div>
<div id="test-element2" {{did-resize this.resizeStub2}}></div>
<div id="test-element3" {{did-resize this.resizeStub3}}></div>`,
    );

    let entries = ['#test-element1', '#test-element2', '#test-element3'].map(
      (elementId) => {
        return { target: find(elementId) };
      },
    );
    let fakeObserver = { observe: {} };

    // trigger resize on all elements
    resizeCallback(entries, fakeObserver);

    assert.ok(this.resizeStub.calledOnce, 'First handler was called only once');
    assert.ok(
      this.resizeStub2.calledOnce,
      'Second handler was called only once',
    );
    assert.ok(
      this.resizeStub3.calledOnce,
      'Third handler was called only once',
    );

    // trigger resize only on the first element
    resizeCallback([entries[0]], fakeObserver);
    assert.ok(
      this.resizeStub.calledTwice,
      'First handler was called a second time',
    );
    assert.notOk(
      this.resizeStub2.calledTwice,
      'Second handler was not called a second time',
    );
    assert.notOk(
      this.resizeStub3.calledTwice,
      'Third handler was not called a second time',
    );
  });

  test('element gets unobserved before removing from the DOM', async function (assert) {
    await render(
      hbs`<div id='test-element' {{did-resize this.resizeStub}}></div>`,
    );
    let element = find('#test-element');
    await clearRender();

    assert.ok(
      unobserveStub.calledOnceWith(element),
      'unobserve is called with the HTMLElement of the modifier',
    );

    let entry = { target: element };
    let fakeObserver = { observe: {} };
    resizeCallback([entry], fakeObserver);
    assert.notOk(
      this.resizeStub.called,
      'handler function is not called after element is removed from the DOM',
    );
  });
});
