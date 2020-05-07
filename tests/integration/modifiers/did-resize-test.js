import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

let resizeCallback = null;
let observeStub = sinon.stub();
let disconnectStub = sinon.stub();

class MockResizeObserver {
  constructor(callback) {
    resizeCallback = callback;
  }

  observe = observeStub;
  disconnect = disconnectStub;
}

module('Integration | Modifier | did-resize', function (hooks) {
  setupRenderingTest(hooks);

  let resizeObserver;

  hooks.beforeEach(function () {
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
  });

  test('modifier triggers handler when ResizeObserver fires callback', async function (assert) {
    await render(hbs`<div {{did-resize this.resizeStub}}></div>`);

    resizeCallback([]);

    assert.ok(this.resizeStub.calledOnce, 'handler fired');
  });
});
