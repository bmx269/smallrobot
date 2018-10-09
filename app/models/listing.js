import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string'),
  listingType: DS.attr('string'),
  listingCount: DS.attr('number'),
  element: DS.belongsTo('element')
});
