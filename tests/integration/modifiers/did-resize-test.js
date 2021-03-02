import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Modifier | did-resize', function (hooks) {
  setupRenderingTest(hooks);

  let resizeCallback = null;
  const observeStub = sinon.stub();
  const unobserveStub = sinon.stub();
  const disconnectStub = sinon.stub();
  const resizeObserver = window.ResizeObserver;
  const mockResizeObserver = class MockResizeObserver {
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
  });

  hooks.afterEach(function () {
    window.ResizeObserver = resizeObserver;
  });

  test('modifier integrates with ResizeObserver', async function (assert) {
    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);

    assert.ok(resizeCallback, 'ResizeObserver received callback');
    assert.ok(observeStub.calledOnce, 'observe was called');

    let [element, options] = observeStub.args[0];

    assert.ok(element, 'element was passed to observe');
    assert.equal(
      Object.keys(options).length,
      0,
      'empty object passed as default options'
    );
  });

  test('modifier triggers handler when ResizeObserver fires callback', async function (assert) {
    await render(
      hbs`<div id="test-element" {{did-resize this.resizeStub}}></div>`
    );
    let entry = { target: find('#test-element') };
    let fakeObserver = { observe: {} };

    resizeCallback([entry], fakeObserver);

    assert.ok(
      this.resizeStub.calledOnceWith(entry, fakeObserver),
      'handler fired with correct parameters'
    );
  });

  test('modifier passes options to ResizeObserver', async function (assert) {
    this.options = { box: 'content-box' };

    await render(hbs`<div {{did-resize this.resizeStub this.options}}></div>`);

    let [element, options] = observeStub.args[0];

    assert.ok(element, 'element was passed to observe');
    assert.equal(options, this.options, 'options were correctly passed');
  });

  test('modifier graceful no-op if ResizeObserver does not exist', async function (assert) {
    delete window.ResizeObserver;

    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);

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
});
