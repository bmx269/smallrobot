import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string'),
  style: DS.attr('string'),
  slide: DS.hasMany('slide'),
  element: DS.belongsTo('element')
});
