import { pageTitle } from 'ember-page-title';
import { tracked } from '@glimmer/tracking';
import didResize from 'ember-resize-modifier/modifiers/did-resize';

class ResizeDemo {
  @tracked count = 0;

  onResize = () => {
    this.count++;
  };
}

const demo = new ResizeDemo();

<template>
  {{pageTitle "ember-resize-modifier Demo"}}

  <h1>ember-resize-modifier</h1>

  <p>Resize the browser window to see the counter increment.</p>

  {{! template-lint-disable no-inline-styles }}
  <div
    style="padding: 1rem; border: 2px solid #ccc; resize: both; overflow: auto; min-width: 200px; min-height: 100px;"
    {{didResize demo.onResize}}
  >
    <p>I have been resized <strong>{{demo.count}}</strong> times!</p>
    <p><em>Drag the corner to resize this box.</em></p>
  </div>
</template>
