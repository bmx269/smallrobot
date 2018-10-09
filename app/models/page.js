import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  created: DS.attr('string'),
  updated: DS.attr('string'),
  status: DS.attr('boolean'),
  slug: DS.attr('string'),
  heroActive: DS.attr('boolean'),
  navColor: DS.attr('string'),
  section: DS.hasMany('section')
});
