import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string')
  // element: DS.belongsTo('element', { async: false }),
});
