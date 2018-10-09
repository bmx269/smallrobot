import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  created: DS.attr('date'),
  status: DS.attr('boolean'),
  intro: DS.attr(''),
  slug: DS.attr('string'),
  navColor: DS.attr('string'),
  heroActive: DS.attr('boolean'),
  heroBlurb: DS.attr(''),
  heroByline: DS.attr('string'),
  heroColor: DS.attr('string'),
  heroOverlay: DS.attr('string'),
  heroLayout: DS.attr('string'),
  heroBackground: DS.belongsTo('file'),
  section: DS.hasMany('section')
});
