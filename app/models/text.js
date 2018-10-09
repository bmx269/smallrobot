import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string'),
  body: DS.attr(''),
  element: DS.belongsTo('element')
});
