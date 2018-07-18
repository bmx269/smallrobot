import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | angled divider', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{angled-divider}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#angled-divider}}
        template block text
      {{/angled-divider}}
    `);

    assert.dom('*').hasText('');
  });
});
