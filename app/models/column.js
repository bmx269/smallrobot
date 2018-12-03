import DS from 'ember-data';

export default DS.Model.extend({
  columnWidthXs: DS.attr('string'),
  columnWidthSm: DS.attr('string'),
  columnWidthMd: DS.attr('string'),
  columnWidthLg: DS.attr('string'),
  columnWidthXl: DS.attr('string'),
  section: DS.belongsTo('section'),
  element: DS.hasMany('element')
});
