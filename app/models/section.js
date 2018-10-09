import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string'),
  divider: DS.attr('boolean'),
  animated: DS.attr('boolean'),
  reverse: DS.attr('boolean'),
  show: DS.attr('boolean'),
  isHero: DS.attr('boolean'),
  animation: DS.attr('string'),
  background: DS.attr('string'),
  colHorizontalAlignment: DS.attr('string'),
  colVerticalAlignment: DS.attr('string'),
  heroSize: DS.attr('string'),
  overlay: DS.attr('string'),
  backgroundImage: DS.belongsTo('file'),
  column: DS.hasMany('column'),
  page: DS.belongsTo('page'),
});
