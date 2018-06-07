import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | development', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:development');
    assert.ok(route);
  });
});
