import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | article teaser', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{article-teaser}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#article-teaser}}
        Read More
      {{/article-teaser}}
    `);

    assert.dom('*').hasText('Read More');
  });
});
