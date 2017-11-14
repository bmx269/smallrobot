import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string'),
  divider: DS.attr('boolean'),
  background: DS.attr('string'),
  layout: DS.attr('string'),
  column: DS.hasMany('column'),
  page: DS.belongsTo('page'),
});
