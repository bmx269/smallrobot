import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr(''),
  image: DS.belongsTo('file'),
  slideshow: DS.belongsTo('slideshow')
});
