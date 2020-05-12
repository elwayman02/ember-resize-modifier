import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

let resizeCallback;
let observeStub;
let unobserveStub;
let disconnectStub;
let MockResizeObserver;

module('Integration | Modifier | did-resize', function (hooks) {
  setupRenderingTest(hooks);

  let resizeObserver;

  hooks.beforeEach(function () {
    resizeCallback = null;
    observeStub = sinon.stub();
    unobserveStub = sinon.stub();
    disconnectStub = sinon.stub();

    MockResizeObserver = class MockResizeObserver {
      constructor(callback) {
        resizeCallback = callback;
      }

      observe = observeStub;
      unobserve = unobserveStub;
      disconnect = disconnectStub;
    }

    resizeObserver = window.ResizeObserver;
    window.ResizeObserver = MockResizeObserver;

    this.resizeStub = sinon.stub();
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
    assert.equal(Object.keys(options).length, 0, 'empty object passed as default options');
  });

  test('modifier triggers handler when ResizeObserver fires callback', async function (assert) {
    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);

    let fakeEntry = { target: {} };
    let fakeObserver = { observe: {} };

    resizeCallback([fakeEntry], fakeObserver);

    assert.ok(this.resizeStub.calledOnceWith(fakeEntry, fakeObserver), 'handler fired with correct parameters');
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
});
