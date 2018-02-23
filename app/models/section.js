import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('string'),
  divider: DS.attr('boolean'),
  parallax: DS.attr('boolean'),
  reverse: DS.attr('boolean'),
  show: DS.attr('boolean'),
  background: DS.attr('string'),
  layout: DS.attr('string'),
  backgroundImage: DS.belongsTo('file', { async: true }),
  column: DS.hasMany('column', { async: true }),
  page: DS.belongsTo('page', { async: true }),
});
