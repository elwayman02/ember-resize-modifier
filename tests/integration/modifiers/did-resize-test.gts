/* eslint-disable ember/template-no-let-reference */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { clearRender, find, render, rerender } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import sinon from 'sinon';
import didResize from '#src/modifiers/did-resize.ts';

type ResizeCallback = (
  entries: { target: Element | null }[],
  observer: { observe: Record<string, unknown> },
) => void;

class ResizeTestState {
  @tracked resizeStub = sinon.stub();
  @tracked resizeStub2 = sinon.stub();
  @tracked resizeStub3 = sinon.stub();

  resizeCallback: ResizeCallback | null = null;
  readonly observeStub = sinon.stub();
  readonly unobserveStub = sinon.stub();
  readonly disconnectStub = sinon.stub();

  private readonly nativeResizeObserver = window.ResizeObserver;
  private readonly nativeRaf = window.requestAnimationFrame;

  constructor() {
    const { observeStub, unobserveStub, disconnectStub } = this;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const state = this;

    window.ResizeObserver = class MockResizeObserver {
      constructor(callback: ResizeCallback) {
        state.resizeCallback = callback;
      }
      observe = observeStub;
      unobserve = unobserveStub;
      disconnect = disconnectStub;
    } as unknown as typeof ResizeObserver;

    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      cb(0);
      return 0;
    };

    // reset static properties so every test runs independently
    didResize.observer = null;
    didResize.handlers = null;
  }

  teardown() {
    window.ResizeObserver = this.nativeResizeObserver;
    window.requestAnimationFrame = this.nativeRaf;
  }
}

module('Integration | Modifier | did-resize', function (hooks) {
  setupRenderingTest(hooks);

  let state: ResizeTestState;

  hooks.beforeEach(function () {
    state = new ResizeTestState();
  });

  hooks.afterEach(function () {
    state.teardown();
  });

  test('modifier integrates with ResizeObserver', async function (assert) {
    await render(
      <template>
        <div {{didResize state.resizeStub}}></div>
      </template>,
    );

    assert.ok(state.resizeCallback, 'ResizeObserver received callback');
    assert.ok(state.observeStub.calledOnce, 'observe was called');

    const [element, options] = state.observeStub.args[0] as [
      Element,
      Record<string, unknown>,
    ];

    assert.ok(element, 'element was passed to observe');
    assert.strictEqual(
      Object.keys(options).length,
      0,
      'empty object passed as default options',
    );
  });

  test('modifier triggers handler when ResizeObserver fires callback', async function (assert) {
    await render(
      <template>
        <div id="test-element" {{didResize state.resizeStub}}></div>
      </template>,
    );
    const entry = { target: find('#test-element') };
    const fakeObserver = { observe: {} };

    state.resizeCallback!([entry], fakeObserver);

    assert.ok(
      state.resizeStub.calledOnceWith(entry, fakeObserver),
      'handler fired with correct parameters',
    );
  });

  test('modifier passes options to ResizeObserver', async function (assert) {
    const options = { box: 'content-box' as const };

    await render(
      <template>
        <div {{didResize state.resizeStub options}}></div>
      </template>,
    );

    const [element, observeOptions] = state.observeStub.args[0] as [
      Element,
      Record<string, unknown>,
    ];

    assert.ok(element, 'element was passed to observe');
    assert.deepEqual(observeOptions, options, 'options were correctly passed');
  });

  test('modifier graceful no-op if ResizeObserver does not exist', async function (assert) {
    // @ts-expect-error - intentionally deleting for test
    delete window.ResizeObserver;

    await render(
      <template>
        <div {{didResize state.resizeStub}}></div>
      </template>,
    );
    assert.notOk(state.resizeCallback, 'no callback received');
    assert.notOk(state.observeStub.calledOnce, 'observe was not called');
  });

  test('modifier calls unobserve when arguments change', async function (assert) {
    await render(
      <template>
        <div {{didResize state.resizeStub}}></div>
      </template>,
    );

    assert.notOk(state.unobserveStub.called, 'unobserve not called yet');
    assert.ok(state.observeStub.calledOnce, 'observe was called');

    state.resizeStub = sinon.stub();
    await rerender();

    assert.ok(state.unobserveStub.calledOnce, 'unobserve called');
    assert.ok(state.observeStub.calledTwice, 'observe was called again');
  });

  test('handlers are setup and called correctly when multiple modifiers are present', async function (assert) {
    await render(
      <template>
        <div id="test-element1" {{didResize state.resizeStub}}></div>
        <div id="test-element2" {{didResize state.resizeStub2}}></div>
        <div id="test-element3" {{didResize state.resizeStub3}}></div>
      </template>,
    );

    const entries = ['#test-element1', '#test-element2', '#test-element3'].map(
      (elementId) => {
        return { target: find(elementId) };
      },
    );
    const fakeObserver = { observe: {} };

    // trigger resize on all elements
    state.resizeCallback!(entries, fakeObserver);

    assert.ok(
      state.resizeStub.calledOnce,
      'First handler was called only once',
    );
    assert.ok(
      state.resizeStub2.calledOnce,
      'Second handler was called only once',
    );
    assert.ok(
      state.resizeStub3.calledOnce,
      'Third handler was called only once',
    );

    // trigger resize only on the first element
    state.resizeCallback!([entries[0]!], fakeObserver);
    assert.ok(
      state.resizeStub.calledTwice,
      'First handler was called a second time',
    );
    assert.notOk(
      state.resizeStub2.calledTwice,
      'Second handler was not called a second time',
    );
    assert.notOk(
      state.resizeStub3.calledTwice,
      'Third handler was not called a second time',
    );
  });

  test('element gets unobserved before removing from the DOM', async function (assert) {
    await render(
      <template>
        <div id="test-element" {{didResize state.resizeStub}}></div>
      </template>,
    );
    const element = find('#test-element');
    await clearRender();

    assert.ok(
      state.unobserveStub.calledOnceWith(element),
      'unobserve is called with the HTMLElement of the modifier',
    );

    const entry = { target: element };
    const fakeObserver = { observe: {} };
    state.resizeCallback!([entry], fakeObserver);
    assert.notOk(
      state.resizeStub.called,
      'handler function is not called after element is removed from the DOM',
    );
  });
});
